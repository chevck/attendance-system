import moment from "moment";
import { useEffect, useState } from "react";
import { decode } from "string-encode-decode";
import { validateEmail } from "../utils/functions";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";
import axios from "axios";

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
    if (!decodedExpiryDate) {
      setLinkInExpired(true);
      toast.error("Invalid URL");
      return window.close();
    }
    console.log({ decodedExpiryDate, nowDate: moment().format() });
    const isExpired = moment().isAfter(decodedExpiryDate);
    setLinkInExpired(isExpired);
    if (isExpired) {
      toast.error("Attendance has closed for today!");
    }
  };

  const handleMarkAttendance = async () => {
    if (linkIsExpired)
      return toast.error("You are a believer, why you wan cheat?");
    const isEmailValid = validateEmail(email);
    if (!isEmailValid) return toast.error("Invalid Email");
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/attendance/sign`, {
        email,
      });
      toast.success("Successfully marked your attendance");
      window.close();
    } catch (error) {
      toast.error(error?.response?.data || "Error marking attendance");
    } finally {
      setLoading(false);
    }
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
