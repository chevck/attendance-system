import moment from "moment";
import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import QRCode from "react-qr-code";

export function CreateBarCode() {
  const [expiryTime, setExpiryTime] = useState(moment().format("hh:mm"));
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log({ expiryTime });

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
      const doc = {
        url: "http://192.168.0.106:3002/mark-attendance",
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
        />
      </div>
      <button
        disabled={loading}
        className='btn-create'
        onClick={handleCreateBarcode}
      >
        {loading ? (
          <div class='spinner-border text-success app-spinner' role='status'>
            <span class='sr-only'></span>
          </div>
        ) : (
          "Create Barcode"
        )}
      </button>
      {qrData ? <QRCode value={qrData} /> : null}
    </div>
  );
}
