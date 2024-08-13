import moment from "moment";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import QRCode from "react-qr-code";
import { Loader } from "../components/Loader";
import { encode } from "string-encode-decode";
import { CalendarIcon } from "../assets/CalendarIcon";
import axios from "axios";
import { toast } from "react-toastify";

export function CreateBarCode() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [qrData, setQrData] = useState(null);
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
      const doc = {
        url: `${process.env.REACT_APP_ROOT_URL}/mark-attendance?${stringDate}`,
        expiryDate,
      };
      setQrData(JSON.stringify(doc));
      setLoading(false);
    }, 4000);
  };

  const handleVerifyBarCodeCreator = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/admin/verify?seargentcode=${seargentcode}`
      );
      toast.success(data);
      handleCreateBarcode();
    } catch (error) {
      console.log({ error });
      toast.error(error?.response?.data || "Error verifying you seargent 🫡");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='create-barcode'>
      <h4>Create Barcode Scanner</h4>
      <div>
        <p>When should this barcode expire?</p>
        <br />
        <div className='date-picker-container'>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat='hh:mm a'
            placeholderText='Pick time'
            showIcon
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
              onChange={({ target: { value } }) => setSeargentCode(value)}
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
        <div>
          <button
            disabled={
              loading ||
              !(selectedDate && seargentcode && seargentcode.length === 4)
            }
            className='btn-create'
            onClick={handleVerifyBarCodeCreator}
          >
            {loading ? <Loader /> : "Create Barcode"}
          </button>
        </div>
      </div>
      {qrData ? <QRCode value={qrData} /> : null}
    </div>
  );
}
