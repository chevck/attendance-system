import { useState } from "react";
import { validateEmail } from "../../utils/functions";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader } from "../Loader";

export function AddNewEmailModal({ handleReturnInvalidAuthUserErr, authUser }) {
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
    handleReturnInvalidAuthUserErr();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/create`,
        {
          emails: emails.map((el) => el.toLowerCase()),
        },
        { headers: { seargentcode: authUser.seargentcode } }
      );
      toast.success("Emails created successfully!");
      setEmails([""]);
    } catch (error) {
      toast.error(error?.response?.data || "Error creating emails");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewEmailBlank = () => {
    if (emails.length === 10)
      return toast.error("You can only create TEN emails at once");
    const hasABlankOpening = emails.filter((el) => !el);
    if (hasABlankOpening.length) return toast.error("Fill empty email box");
    const invalidEmails = emails.filter((el) => !validateEmail(el));
    if (invalidEmails.length) return toast.error("Please put in a valid email");
    setEmails([...emails, ""]);
  };

  return (
    <div
      className='modal fade add-new-email-modal'
      id='addNewEmailModal'
      tabindex='-1'
      aria-labelledby='addNewEmailModalLabel'
      aria-hidden='true'
    >
      <div class='modal-dialog'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h1 class='modal-title fs-5' id='addNewEmailModalLabel'>
              Add New CCW Emails
            </h1>
            <button
              type='button'
              class='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div class='modal-body'>
            <div className='ccw-emails'>
              <p className='instruction-text'>
                Please put in a valid email below
              </p>
              {emails.map((el, key) => (
                <div className='input-flex' key={key}>
                  <input
                    key={key}
                    value={el}
                    placeholder='johndoe@gmail.com'
                    className='form-control'
                    onChange={({ target: { value } }) => {
                      emails[key] = value.trim();
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
            </div>
          </div>
          <div class='modal-footer'>
            <button
              type='button'
              class='btn btn-secondary ccw-btn close'
              data-bs-dismiss='modal'
            >
              Close
            </button>
            <button
              className='ccw-btn'
              disabled={loading}
              onClick={handleCreateEmails}
            >
              {loading ? <Loader /> : "Create Emails"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
