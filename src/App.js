/* eslint-disable no-unused-vars */
import QRCode from "react-qr-code";
import moment from "moment";
import { useState } from "react";
import { encode } from "string-encode-decode";
import { QrReader, QrReaderViewFinder } from "reactjs-qr-code-reader";

function App() {
  const [qrData, setQRData] = useState(null);
  const expiryDate = moment().add(2, "minute").toISOString(); // Set expiry date to 1 day from now
  const url = "http://192.168.0.106:3002/mark-attendance";
  const encodedDate = encode(expiryDate);
  console.log("encoded date", encode(expiryDate));
  const doc = new URLSearchParams({
    expiryDate: encodedDate,
  }).toString();
  const link = `${url}?${doc}`;
  console.log({ link });

  const data = {
    url: link,
    expiryDate: encodedDate,
  };
  const jsonData = JSON.stringify(data);

  const decodeQRCode = (qrData) => {
    try {
      const data = JSON.parse(qrData);
      const isExpired = moment().isAfter(data.expiryDate);
      console.log({ data });
      if (isExpired) {
        return "QR code is expired";
      }
      return `URL: ${data.url}`;
    } catch (error) {
      return "Invalid QR code";
    }
  };

  const handleError = (err) => {
    console.error(err);
    // setScannedData("Error scanning QR code");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      handleScan(reader.result);
    };
    reader.readAsText(file);
  };

  const handleScan = (event) => {
    console.log({ event });
    // const qrContent = event.target.value; // Assume this is the decoded QR code content
    // console.log({ qrContent });
    // setQRData(decodeQRCode(qrContent));
  };

  return (
    <div className='App'>
      {/* <QRCode value='https://github.com/gcoro/corcojs-qrcode-logo' /> */}
      <QRCode value={jsonData} />
      {/* <input
        type='text'
        placeholder='Scan QR code here'
        // onChange={handleScan}
      /> */}
      {qrData && <p>{qrData}</p>}
      {/* <input type='file' accept='image/*' onChange={handleFileUpload} /> */}
      {/* <QrReader delay={0} read={true} onRead={handleScan}>
        <QrReaderViewFinder />
      </QrReader> */}
      {/* <QrReader
        read={true}
        delay={0}
        onError={handleError}
        // onScan={handleScan}
        onRead={handleScan}
        // flipVideo={true}
        style={{ width: "100%" }}
      /> */}
    </div>
  );
}

export default App;
