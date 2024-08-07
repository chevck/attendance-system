import { useState } from "react";
import { validateEmail } from "../utils/functions";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";
import axios from "axios";

export const LoadEmails = () => {
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleCreateEmails = async () => {
    const hasABlankOpening = emails.filter((el) => !el);
    if (hasABlankOpening.length) return toast.error("Fill empty email box");
    // eslint-disable-next-line array-callback-return
    const invalidEmails = emails.filter((email) => {
      const isEmailValid = validateEmail(email);
      if (!isEmailValid) return email;
    });
    if (invalidEmails.length)
      return toast.error("There are invalid emails in your mix");
    setLoading(true);
    try {
      console.log("sds", process.env);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/create`, {
        emails,
      });
      toast.success("Emails created successfully!");
      setEmails([""]);
    } catch (error) {
      toast.error(error?.response?.data || "Error creating emails");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewEmailBlank = () => {
    if (emails.length === 5)
      return toast.error("You can only create FIVE emails at once");
    const hasABlankOpening = emails.filter((el) => !el);
    if (hasABlankOpening.length) return toast.error("Fill empty email box");
    const invalidEmails = emails.filter((el) => !validateEmail(el));
    if (invalidEmails.length) return toast.error("Please put in a valid email");
    setEmails([...emails, ""]);
  };

  return (
    <div className='ccw-emails'>
      <h3>Welcome Admin,</h3>
      <p>Please put in a valid email below</p>
      {emails.map((el, key) => (
        <div>
          <input
            key={key}
            value={el}
            placeholder='johndoe@gmail.com'
            className='form-control'
            onChange={({ target: { value } }) => {
              emails[key] = value;
              setEmails([...emails]);
            }}
          />
          <span
            className='remove'
            role='button'
            onClick={() => {
              if (emails.length < 2)
                return toast.error("You need to leave one email");
              emails.splice(key, 1);
              setEmails([...emails]);
            }}
          >
            Remove
          </span>
        </div>
      ))}
      <p
        role='button'
        className='add-email-btn'
        onClick={handleAddNewEmailBlank}
      >
        Add New Email +
      </p>
      <button
        className='ccw-btn'
        disabled={loading}
        onClick={handleCreateEmails}
      >
        {loading ? <Loader /> : "Create Emails"}
      </button>
    </div>
  );
};
