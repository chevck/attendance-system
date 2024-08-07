import { useState } from "react";
import { validateEmail } from "../utils/functions";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";

export const LoadEmails = () => {
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleCreateEmails = () => {
    const hasABlankOpening = emails.filter((el) => !el);
    if (hasABlankOpening.length) return toast.error("Fill empty email box");
    const validEmails = [];
    emails.forEach((email) => {
      const isEmailValid = validateEmail(email);
      if (!isEmailValid) return toast.error("Invalid Email");
      validEmails.push(email);
    });
    setLoading(true);
    console.log({ validEmails });

    try {
    } catch (error) {
      toast.error("Error creating email");
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
