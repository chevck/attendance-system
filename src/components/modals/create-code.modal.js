import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { toast } from "react-toastify";
import { encode } from "string-encode-decode";
import moment from "moment";
import { Loader } from "../Loader";
import QRCode from "react-qr-code";
import { CalendarIcon } from "../../assets/CalendarIcon";

export function CreateBarCodeModal({ handleReturnInvalidAuthUserErr }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [attendanceUrl, setAttendanceUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seargentcode, setSeargentCode] = useState("");
  const [seeCode, setSeeCode] = useState(false);

  useEffect(() => {
    setQrData(null);
  }, [selectedDate]);

  const handleCreateBarcode = () => {
    setLoading(true);
    setInterval(() => {
      const expiryDate = moment(selectedDate).toISOString();
      const encodedDate = encode(expiryDate);
      const stringDate = new URLSearchParams({
        expiryDate: encodedDate,
      }).toString();
      const attendanceUrl = `${process.env.REACT_APP_ROOT_URL}/mark-attendance?${stringDate}`;
      const doc = {
        url: attendanceUrl,
        expiryDate,
      };
      setAttendanceUrl(attendanceUrl);
      setQrData(JSON.stringify(doc));
      setLoading(false);
    }, 4000);
  };

  const handleVerifyBarCodeCreator = async () => {
    try {
      handleReturnInvalidAuthUserErr();
      setLoading(true);
      // const { data } = await axios.get(
      //   `${process.env.REACT_APP_BACKEND_URL}/admin/verify?seargentcode=${seargentcode}`
      // );
      // toast.success(data);
      handleCreateBarcode();
    } catch (error) {
      console.log({ error });
      setLoading(false);
      toast.error(error?.response?.data || "Error verifying you seargent 🫡");
    }
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(attendanceUrl);
    toast.success("copied url!");
  };

  return (
    <div
      className='modal fade create-barcode-modal'
      id='createBarCodeModal'
      tabindex='-1'
      aria-labelledby='createBarCodeModalLabel'
      aria-hidden='true'
    >
      <div class='modal-dialog'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h1 class='modal-title fs-5' id='addNewEmailModalLabel'>
              Create Registration Barcode
            </h1>
            <button
              type='button'
              class='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div class='modal-body'>
            <div className='create-barcode'>
              <div>
                <p>When should this barcode expire?</p>
                <br />
                <div className='date-picker-container'>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    timeCaption='Time'
                    dateFormat='h:mm aa'
                    placeholderText='Pick time'
                    showIcon
                    showTimeSelect
                    showTimeSelectOnly
                    includeDates={[new Date()]}
                    toggleCalendarOnIconClick
                    icon={<CalendarIcon />}
                    showTimeInput
                    timeInputLabel='Time:'
                  />
                </div>
                <br />
                <center>
                  <div className='password-input'>
                    <input
                      className='create-barcode-input'
                      placeholder='Seargent Code'
                      maxLength={4}
                      value={seargentcode}
                      type={seeCode ? "text" : "password"}
                      onChange={({ target: { value } }) =>
                        setSeargentCode(value)
                      }
                    />
                    <span onClick={() => setSeeCode(!seeCode)}>
                      {seeCode ? (
                        <i class='bi bi-eye-slash'></i>
                      ) : (
                        <i class='bi bi-eye'></i>
                      )}
                    </span>
                  </div>
                </center>
              </div>
              {qrData ? (
                <>
                  <QRCode value={qrData} />
                  <p className='copy' onClick={copyUrl}>
                    Copy URL <i class='bi bi-copy'></i>
                  </p>
                </>
              ) : null}
            </div>
          </div>
          <div class='modal-footer'>
            <button
              type='button'
              class='btn btn-secondary ccw-btn close'
              data-bs-dismiss='modal'
            >
              Close
            </button>
            <button
              disabled={
                loading ||
                !(selectedDate && seargentcode && seargentcode.length === 4)
              }
              className='ccw-btn btn-create'
              onClick={handleVerifyBarCodeCreator}
            >
              {loading ? <Loader /> : "Create Barcode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
