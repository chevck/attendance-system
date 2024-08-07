import moment from "moment";
import { useEffect, useState } from "react";
import { decode } from "string-encode-decode";
import { validateEmail } from "../utils/functions";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";

export function MarkAttendance() {
  const params = new URLSearchParams(window.location.search);
  const [linkIsExpired, setLinkInExpired] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLinkInExpired(isExpired);
    if (isExpired) toast.error("Attendance has closed for today!");
    // if isexpired, close the app
    // if (!isExpired) window.alert("is not expired");
    //     window.alert("is expired", isExpired);
    console.log({ isExpired });
  };

  const handleMarkAttendance = () => {
    if (linkIsExpired)
      return toast.error("You are a believer, why you wan cheat?");
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) return toast.error("Invalid Email");
    setLoading(true);
  };

  return (
    <div className='attendance-container'>
      <h4>Hmm, a CCW Member?</h4>
      <h6>Put your email in, let's see 😏</h6>
      <input
        className='form-control'
        placeholder='email@email.com'
        onChange={({ target: { value } }) => setEmail(value)}
        value={email}
        disabled={loading || linkIsExpired}
      />
      <button
        className='ccw-btn'
        disabled={loading || linkIsExpired}
        onClick={handleMarkAttendance}
      >
        {loading ? <Loader /> : "Mark Attendance"}
      </button>
    </div>
  );
}
