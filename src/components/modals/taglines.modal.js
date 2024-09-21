import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader } from "../Loader";

export function TagLinesModal({ handleReturnInvalidAuthUserErr, authUser }) {
  const [mainText, setMainText] = useState("");
  const [subText, setSubText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(() => {
    if (!authUser) return;
    handleGetLatestTagLine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const handleGetLatestTagLine = async () => {
    handleReturnInvalidAuthUserErr();
    console.log("getting latest tag line");
    try {
      const {
        data: { mainText, supportingText, successMessage },
      } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/taglines/latest`
      );
      setMainText(mainText);
      setSubText(supportingText);
      setSuccessMessage(successMessage);
      setDisableBtn(true);
    } catch (error) {
      console.log("errorr", error);
    }
  };

  const handleSaveTagLine = async () => {
    handleReturnInvalidAuthUserErr();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/taglines/create`,
        {
          mainText,
          supportingText: subText,
          successMessage,
        },
        { headers: { seargentcode: authUser.seargentcode } }
      );
      setLoading(false);
      toast.success("Tagline Saved Successfully!");
      document.getElementById("btn-close").click();
      setMainText("");
      setSubText("");
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Error saving tagline. Please try again later"
      );
    }
  };

  return (
    <div className=''>
      <div
        class='modal fade tagline-modal'
        id='tagLinesModal'
        tabindex='-1'
        aria-labelledby='tagLinesModalLabel'
        aria-hidden='true'
      >
        <div class='modal-dialog'>
          <div class='modal-content'>
            <div class='modal-header'>
              <h1 class='modal-title fs-5' id='tagLinesModalLabel'>
                Tag Lines
              </h1>
              <button
                type='button'
                class='btn-close'
                id='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div class='modal-body'>
              <h5>Feel free to edit these taglines to whatever you chusses!</h5>
              <div className=''>
                <label>Main Tagline</label>
                <input
                  placeholder='Enter Main Tagline'
                  onChange={({ target: { value } }) => {
                    setMainText(value);
                    if (disableBtn) setDisableBtn(false);
                  }}
                  value={mainText}
                />
              </div>
              <div className=''>
                <label>Supporting text</label>
                <input
                  placeholder='Enter supporting text'
                  onChange={({ target: { value } }) => {
                    setSubText(value);
                    if (disableBtn) setDisableBtn(false);
                  }}
                  value={subText}
                />
              </div>
              <div className=''>
                <label>Success Message</label>
                <input
                  placeholder='Enter Success Message'
                  onChange={({ target: { value } }) => {
                    setSuccessMessage(value);
                    if (disableBtn) setDisableBtn(false);
                  }}
                  value={successMessage}
                />
                <p>
                  We ask that you save the name placeholder as <b>**name**</b>{" "}
                  e.g <b>Thank you, **name**</b>
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
                type='button'
                class='btn btn-primary ccw-btn'
                disabled={
                  loading ||
                  mainText.length < 5 ||
                  subText.length < 5 ||
                  successMessage.length < 5 ||
                  disableBtn
                }
                onClick={handleSaveTagLine}
              >
                {loading ? <Loader /> : "Save Changes..."}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
