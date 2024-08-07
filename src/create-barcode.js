import moment from "moment";
import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import QRCode from "react-qr-code";

export function CreateBarCode() {
  const [expiryTime, setExpiryTime] = useState(moment().format("hh:mm"));
  const [qrData, setQrData] = useState(null);

  console.log({ expiryTime });

  const handleCreateBarcode = () => {
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
    console.log({ doc });
  };

  return (
    <div>
      <h4>Create Barcode Scanner</h4>
      <div>
        <label>When should this barcode expire?</label>
        <br />
        <TimePicker
          onChange={(time) => setExpiryTime(time)}
          value={expiryTime}
        />
      </div>
      <button onClick={handleCreateBarcode}>Create Barcode</button>
      {qrData ? <QRCode value={qrData} /> : null}
    </div>
  );
}
