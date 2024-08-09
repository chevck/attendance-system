import moment from "moment";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import QRCode from "react-qr-code";
import { Loader } from "../components/Loader";
import { encode } from "string-encode-decode";
import { CalendarIcon } from "../assets/CalendarIcon";

export function CreateBarCode() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQrData(null);
  }, [selectedDate]);

  console.log({ selectedDate });

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

  return (
    <div className='create-barcode'>
      <h4>Create Barcode Scanner</h4>
      <div>
        <p>When should this barcode expire?</p>
        <br />
        {/* <TimePicker
          onChange={(time) => setExpiryTime(time)}
          value={expiryTime}
          disableClock={true}
          amPmAriaLabel='PM'
        /> */}
        <div className='date-picker-container'>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat='hh:mm a'
            placeholderText='Pick time'
            showIcon
            toggleCalendarOnIconClick
            icon={<CalendarIcon />}
            showTimeInput
          />
        </div>
        <div>
          <button
            disabled={loading || !selectedDate}
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
