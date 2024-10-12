import moment from "moment";
// import Church from "../assets/church.png";
import { useEffect, useState } from "react";
import { decode } from "string-encode-decode";
import { validateEmail } from "../utils/functions";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";
import axios from "axios";
import { PageLoader } from "../components/PageLoader";

export function MarkAttendance() {
  const params = new URLSearchParams(window.location.search);
  const [linkIsExpired, setLinkInExpired] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [taglines, setTaglines] = useState({
    maintext: "",
    subtext: "",
    successMessage: "",
  });

  useEffect(() => {
    handleCheckExpiryDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to get the current system theme
  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // State to store the current theme (dark or light)
  const [theme, setTheme] = useState(getSystemTheme());

  useEffect(() => {
    // Function to handle theme change
    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    // Create a media query list for `prefers-color-scheme`
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Check for initial theme value
    setTheme(mediaQuery.matches ? "dark" : "light");

    // Add listener to detect changes in system theme
    mediaQuery.addEventListener("change", handleThemeChange);

    // Cleanup the listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleCheckExpiryDate = () => {
    const expiryDate = params.get("expiryDate");
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
      return toast.error("Attendance has closed for today!");
    }
    handleGetLatestTagline();
  };

  const handleGetLatestTagline = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/taglines/latest`
      );
      setTaglines({
        maintext: data.mainText,
        subtext: data.supportingText,
        successMessage: data.successMessage,
      });
      setPageLoading(false);
    } catch (error) {
      setPageLoading(false);
      console.log({ error });
      setTaglines({
        maintext: "So glad you made it! 🤗",
        subtext: "Let's get it recorded, shall we?",
        successMessage: "You are doing well, **name**",
      });
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
        email: email.toLowerCase(),
        name,
      });
      // toast.success(`You are doing well 👏🏽, ${name}`);
      toast.success(
        taglines.successMessage.replace("**name**", name.split(" ")[0].trim())
      );
      setLinkInExpired(true);
      setEmail("");
      setName("");
      // window.close();
    } catch (error) {
      toast.error(error?.response?.data || "Error marking attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLoader loading={pageLoading}>
      <div className='attendance-container'>
        <h4>{taglines.maintext}</h4>
        <h6>{taglines.subtext}</h6>
        <input
          className='form-control'
          placeholder='Your First Name'
          onChange={({ target: { value } }) => setName(value)}
          value={name}
          disabled={loading || linkIsExpired}
        />
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
    </PageLoader>
  );
}
