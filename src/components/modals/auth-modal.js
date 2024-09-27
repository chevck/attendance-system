import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loader } from "../Loader";

export function AuthModal({
  setAuthUser,
  closeAccessAuthModal,
  handleGetAllCCWMails,
  setPageLoading,
}) {
  const [loading, setLoading] = useState(false);
  const [seeCode, setSeeCode] = useState(false);
  const [seargentCode, setSeargentCode] = useState("");

  const handleConfirmAuthUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/admin?seargentcode=${seargentCode.toUpperCase()}`
      );
      setAuthUser(data);
      setSeargentCode("");
      closeAccessAuthModal();
      handleGetAllCCWMails();
      setLoading(false);
    } catch (error) {
      console.log("error confirming auth user", error);
      setLoading(false);
      toast.error(error?.response?.data || "Error verifying you seargent 🫡");
    }
  };

  return (
    <div
      class='modal fade'
      id='staticBackdrop'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabindex='-1'
      aria-labelledby='staticBackdropLabel'
      aria-hidden='true'
    >
      <div class='modal-dialog access-auth-modal'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h1 class='modal-title fs-5' id='staticBackdropLabel'>
              Welcome Admin (?) 👀
            </h1>
          </div>
          <div class='modal-body'>
            <h3>Confirm Identity.</h3>
            <h6>
              Please, provide your seargent code below to confirm your identity
            </h6>
            <div className='custom-password-input'>
              <input
                className='create-barcode-input'
                placeholder='Seargent Code'
                maxLength={4}
                value={seargentCode}
                type={seeCode ? "text" : "password"}
                onChange={({ target: { value } }) => setSeargentCode(value)}
              />
              <span onClick={() => setSeeCode(!seeCode)}>
                {seeCode ? (
                  <i class='bi bi-eye-slash'></i>
                ) : (
                  <i class='bi bi-eye'></i>
                )}
              </span>
            </div>
          </div>
          <div class='modal-footer'>
            <button
              type='button'
              class='btn btn-secondary'
              id='close-access-auth-modal'
              data-bs-dismiss='modal'
              style={{ display: "none" }}
            >
              Close
            </button>
            <button
              disabled={seargentCode.length < 4 || loading}
              onClick={handleConfirmAuthUser}
            >
              {loading ? <Loader /> : "Confirm ID"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
