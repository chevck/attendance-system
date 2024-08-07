import moment from "moment";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { decode } from "string-encode-decode";

export function MarkAttendance() {
  const location = useLocation();
  const { search } = location;
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    handleCheckExpiryDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckExpiryDate = () => {
    const expiryDate = params.get("expiryDate");
    console.log({ expiryDate });
    const decodedExpiryDate = decode(expiryDate);
    console.log({ decodedExpiryDate, nowDate: moment().format() });
    const isExpired = moment().isAfter(decodedExpiryDate);
    // if (isExpired) window.alert("is expired");
    // if isexpired, close the app
    // if (!isExpired) window.alert("is not expired");
    //     window.alert("is expired", isExpired);
    console.log({ isExpired });
  };

  const handleWriteToExcel = () => {};

  return (
    <div>
      Got here
      <div>
        <label>Enter email address</label>
        <input className='form-control' placeholder='email@email.com' />
      </div>
    </div>
  );
}
