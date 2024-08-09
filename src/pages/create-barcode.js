import moment from "moment";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import QRCode from "react-qr-code";
import { Loader } from "../components/Loader";
import { encode } from "string-encode-decode";

export function CreateBarCode() {
  const [expiryTime, setExpiryTime] = useState(moment().format("hh:mm"));
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQrData(null);
  }, [expiryTime]);

  const handleCreateBarcode = () => {
    setLoading(true);
    setInterval(() => {
      const expiryDate = moment()
        .set({
          hour: expiryTime.split(":")[0],
          minute: expiryTime.split(":")[1],
          millisecond: 0,
          second: 0,
        })
        .toISOString();
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

  return (
    <div className='create-barcode'>
      <h4>Create Barcode Scanner</h4>
      <div>
        <p>When should this barcode expire?</p>
        <br />
        <TimePicker
          onChange={(time) => setExpiryTime(time)}
          value={expiryTime}
          disableClock={true}
          amPmAriaLabel='PM'
        />
        {/* <div className='date-picker-container'>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat='MMM d'
              placeholderText='Filter attendance'
              showIcon
              toggleCalendarOnIconClick
              closeOnScroll
              icon={<CalendarIcon />}
              maxDate={new Date()}
            />
          </div> */}
        <div>
          <button
            disabled={loading}
            className='btn-create'
            onClick={handleCreateBarcode}
          >
            {loading ? <Loader /> : "Create Barcode"}
          </button>
        </div>
      </div>
      {qrData ? <QRCode value={qrData} /> : null}
    </div>
  );
}
