/* eslint-disable react-hooks/exhaustive-deps */
import { CalendarIcon } from "../assets/CalendarIcon";
import { CancelIcon } from "../assets/CancelIcon";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import FileDownload from "js-file-download";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";
import { validateEmail } from "../utils/functions";
import { PageLoader } from "../components/PageLoader";
import { AuthModal } from "../components/modals/auth-modal";
import { AddNewEmailModal } from "../components/modals/add-email.modal";
import { CreateBarCodeModal } from "../components/modals/create-code.modal";
import { TagLinesModal } from "../components/modals/taglines.modal";

const PasswordInput = ({ setSeargentCode, seargentCode }) => {
  const [seeCode, setSeeCode] = useState(false);
  return (
    <div className='custom-password-input'>
      <input
        placeholder='Seargent Code'
        onChange={({ target: { value } }) => setSeargentCode(value)}
        value={seargentCode}
        maxLength={4}
        type={seeCode ? "text" : "password"}
      />
      <span onClick={() => setSeeCode(!seeCode)}>
        {seeCode ? <i class='bi bi-eye-slash'></i> : <i class='bi bi-eye'></i>}
      </span>
    </div>
  );
};

const EmailTable = ({ el, key, setSelectedDataToUpdate }) => {
  return (
    <tr key={key}>
      <td colSpan={3}>{el.email.toLowerCase()}</td>
      <td className='actions'>
        <span
          role='button'
          data-bs-toggle='modal'
          data-bs-target='#updateEmailModal'
          onClick={() => setSelectedDataToUpdate({ ...el, newEmail: el.email })}
        >
          <i class='bi bi-pencil-square'></i>
        </span>
        <span
          role='button'
          data-bs-toggle='modal'
          data-bs-target='#deleteEmailModal'
          onClick={() => setSelectedDataToUpdate(el)}
        >
          <i class='bi bi-trash3-fill'></i>
        </span>
        <button
          data-bs-toggle='modal'
          data-bs-target='#updateEmailModal'
          onClick={() => setSelectedDataToUpdate({ ...el, newEmail: el.email })}
        >
          Update Email
        </button>
        <button
          data-bs-toggle='modal'
          data-bs-target='#deleteEmailModal'
          onClick={() => setSelectedDataToUpdate(el)}
        >
          <CancelIcon />
          Remove User
        </button>
      </td>
    </tr>
  );
};

export function Repository() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [allEmails, setAllEmails] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchEmailText, setSearchEmailText] = useState("");
  const [searchEmailResults, setSearchEmailResults] = useState([]);
  const [attendants, setAttendants] = useState([]);
  const [selectedDataToUpdate, setSelectedDataToUpdate] = useState(null);
  const [seargentCode, setSeargentCode] = useState("");
  const [emailToDelete, setEmailToDelete] = useState("");

  useEffect(() => {
    if (!selectedDate) return;
    handleReturnInvalidAuthUserErr();
    handleGetAttendees();
    setSearchEmailText("");
  }, [selectedDate]);

  useEffect(() => {
    if (!searchEmailText) return;
    handleReturnInvalidAuthUserErr();
    handleSearchEmail();
  }, [searchEmailText]);

  useEffect(() => {
    // open access auth modal on mount
    document.getElementById("access-auth-modal").click();
  }, []);

  const closeAccessAuthModal = () =>
    document.getElementById("close-access-auth-modal").click();

  const handleGetAllCCWMails = async () => {
    setPageLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users`
      );
      setAllEmails(data);
      setPageLoading(false);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data || "Error getting ccw emails");
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handleGetAttendees = async () => {
    try {
      setLoading(true);
      setPageLoading(true);
      setAttendants([]);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/attendance/get-attendees?filterDate=${selectedDate}`
      );
      setAttendants(data);
    } catch (error) {
      toast.error(
        error?.response?.data || "Error getting attendees for specified date"
      );
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handleDownloadAttendees = async () => {
    handleReturnInvalidAuthUserErr();
    try {
      setPageLoading(true);
      setDownloading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/attendance/download?filterDate=${selectedDate}`,
        {
          responseType: "arraybuffer",
        }
      );
      const filename = `CCW-Ibadan-Attendance-${moment(selectedDate).format(
        "Do MMM, YYYY"
      )}.xlsx`;
      FileDownload(data, filename);
    } catch (error) {
      toast.error(
        error?.response?.data ||
          "Error downloading attendees for specified filter"
      );
    } finally {
      setDownloading(false);
      setPageLoading(false);
    }
  };

  const handleDownloadCCWEmails = async () => {
    handleReturnInvalidAuthUserErr();
    try {
      setDownloading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/download`,
        {
          responseType: "arraybuffer",
        }
      );
      const filename = `CCW-Ibadan-Emails.xlsx`;
      FileDownload(data, filename);
    } catch (error) {
      toast.error(error?.response?.data || "Error downloading emails");
    } finally {
      setDownloading(false);
    }
  };

  const handleSearchEmail = () => {
    if (!searchEmailText.length) return;
    const results = allEmails.filter((obj) =>
      obj.email.toLowerCase().includes(searchEmailText.toLowerCase())
    );
    setSearchEmailResults([...results]);
  };

  const handleUpdateEmail = async () => {
    handleReturnInvalidAuthUserErr();
    if (!seargentCode)
      return toast.error("You need to give us your code, seargent 😏");
    const { newEmail, email } = selectedDataToUpdate;
    if (newEmail === email)
      return toast.error("The new email and the former email are the same!");
    const isEmailValid = validateEmail(newEmail);
    if (!isEmailValid) return toast.error("Invalid Email");
    try {
      setActionLoading(true);
      await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/admin/verify?seargentcode=${seargentCode.toUpperCase()}`
      );
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users`,
        {
          ...selectedDataToUpdate,
        }
      );
      const emailIndex = allEmails.findIndex(
        (email) => String(email._id) === String(data._id)
      );
      allEmails[emailIndex] = { ...allEmails[emailIndex], email: data.email };
      setAllEmails([...allEmails]);
      if (searchEmailResults.length) setSearchEmailText("");
      document.getElementById("update-email-close-modal").click();
      toast.success("Email updated successfully!");
      setSelectedDataToUpdate(null);
      setSeargentCode("");
    } catch (error) {
      return toast.error(
        error?.response?.data || "Error updating email. Please try again later"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEmail = async () => {
    handleReturnInvalidAuthUserErr();
    if (emailToDelete !== selectedDataToUpdate?.email)
      return toast.error("Invalid Email provided!");
    try {
      setActionLoading(true);
      await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/admin/verify?seargentcode=${seargentCode.toUpperCase()}`
      );
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/users?email=${emailToDelete}`
      );
      const emails = allEmails.filter(
        (el) => el.email.toLowerCase() !== emailToDelete.toLowerCase()
      );
      setAllEmails([...emails]);
      if (searchEmailResults.length) {
        setSearchEmailResults([
          ...searchEmailResults.filter(
            (el) => el.email.toLowerCase() !== emailToDelete.toLowerCase()
          ),
        ]);
      }
      toast.success("Email deleted successfully!");
      setSelectedDataToUpdate(null);
      setSeargentCode("");
      document.getElementById("delete-email-close-modal").click();
    } catch (error) {
      toast.error(error?.response?.data || "Error deleting user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnInvalidAuthUserErr = () => {
    if (!authUser)
      return toast.error("You are unauthorized to make this request! 🙂");
  };

  return (
    <PageLoader loading={pageLoading}>
      <div className='repository'>
        <div className='header'>
          <div className=''>
            <h3>CCW Members</h3>
            {selectedDate ? (
              <p>
                Here's a list of people that marked attendance on{" "}
                {moment(selectedDate).format("Do, MMM YYYY")}
              </p>
            ) : (
              <p>Here's a list of everyone you registered as CCW Members</p>
            )}
          </div>
          <div className='filters'>
            <button data-bs-toggle='modal' data-bs-target='#addNewEmailModal'>
              Add New Member
            </button>
            <button data-bs-toggle='modal' data-bs-target='#createBarCodeModal'>
              Create BarCode
            </button>
            <button data-bs-toggle='modal' data-bs-target='#tagLinesModal'>
              Change Taglines
            </button>
            <button
              disabled={downloading}
              onClick={
                selectedDate ? handleDownloadAttendees : handleDownloadCCWEmails
              }
            >
              {downloading ? (
                <Loader />
              ) : (
                <>
                  Export to Excel{" "}
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M3.9585 12.292V13.542C3.9585 14.9227 5.07778 16.042 6.4585 16.042H13.5418C14.9225 16.042 16.0418 14.9227 16.0418 13.542V12.292'
                      stroke='#6B797C'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      d='M10 11.8747L10 3.95801'
                      stroke='#6B797C'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                    <path
                      d='M7.2915 8.95801L9.99984 11.8747L12.7082 8.95801'
                      stroke='#6B797C'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </>
              )}
            </button>
            <div className='date-picker-container'>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat='MMM d'
                placeholderText='Filter attendance'
                showIcon
                toggleCalendarOnIconClick
                icon={<CalendarIcon />}
                popperPlacement='bottom'
                maxDate={new Date()}
              />
            </div>
            {!selectedDate ? (
              <input
                className=''
                placeholder='Search Email'
                onChange={({ target: { value } }) => setSearchEmailText(value)}
                value={searchEmailText}
              />
            ) : null}
          </div>
        </div>
        {selectedDate ? (
          <div className='filters-info'>
            <p>Now Showing(Attendance)</p>
            <p onClick={() => setSelectedDate(null)}>Clear Filters</p>
          </div>
        ) : null}
        {selectedDate ? (
          <div className='_custom-table'>
            <table>
              <thead>
                <th colSpan={5}>Name</th>
                <th colSpan={5}>Email</th>
              </thead>
              <tbody>
                {!attendants.length && !loading ? (
                  <tr>
                    <td>No attendees on this day</td>
                  </tr>
                ) : loading && !attendants.length ? (
                  <tr>
                    <td>Loading... Please wait</td>
                  </tr>
                ) : (
                  attendants.map((el, key) => (
                    <tr key={key}>
                      <td colSpan={5}>{el.name || "-"}</td>
                      <td colSpan={5}>{el.email.toLowerCase()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='_custom-table'>
            <table>
              <thead>
                <th colSpan={3}>Email Address</th>
                <th colSpan={3}></th>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td>Loading... Please wait</td>
                  </tr>
                ) : !allEmails.length && !loading ? (
                  <tr>
                    <td>No CCW Emails</td>
                  </tr>
                ) : searchEmailText.length ? (
                  searchEmailResults.length ? (
                    searchEmailResults.map((el, key) => (
                      <EmailTable
                        el={el}
                        key={key}
                        setSelectedDataToUpdate={setSelectedDataToUpdate}
                      />
                    ))
                  ) : (
                    <tr>
                      <td>No Emails matching your search term</td>
                    </tr>
                  )
                ) : (
                  allEmails.map((el, key) => (
                    <EmailTable
                      el={el}
                      key={key}
                      setSelectedDataToUpdate={setSelectedDataToUpdate}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Static Modal Button Trigger */}
        <button
          type='button'
          class='btn btn-primary'
          data-bs-toggle='modal'
          data-bs-target='#staticBackdrop'
          id='access-auth-modal'
          style={{ display: "none" }}
        >
          Launch static backdrop modal
        </button>
        {/* Static Modal Button Trigger  -- ends */}
        {/* Update User Modal Begins */}
        <div
          class='modal fade'
          id='updateEmailModal'
          tabindex='-1'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
        >
          <div class='modal-dialog'>
            <div class='modal-content'>
              <div class='modal-header'>
                <h1 class='modal-title fs-5' id='exampleModalLabel'>
                  Update User Email
                </h1>
                <button
                  type='button'
                  class='btn-close'
                  data-bs-dismiss='modal'
                  id='update-email-close-modal'
                  aria-label='Close'
                ></button>
              </div>
              <div class='modal-body'>
                <label>Email Address</label>
                <input
                  value={selectedDataToUpdate?.newEmail}
                  onChange={({ target: { value } }) =>
                    setSelectedDataToUpdate({
                      ...selectedDataToUpdate,
                      newEmail: value,
                    })
                  }
                />
                <br />
                <label>
                  <i>
                    To complete this action, you need to provide your seargent
                    code below
                  </i>
                </label>
                <PasswordInput
                  seargentCode={seargentCode}
                  setSeargentCode={setSeargentCode}
                />
              </div>
              <div class='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary close'
                  data-bs-dismiss='modal'
                >
                  Close
                </button>
                <button
                  type='button'
                  className='btn btn-primary save'
                  disabled={seargentCode.length !== 4 || actionLoading}
                  onClick={handleUpdateEmail}
                >
                  {actionLoading ? <Loader /> : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Update User Modal Ends */}
        {/* Delete User Modal Begins */}
        <div
          class='modal fade'
          id='deleteEmailModal'
          tabindex='-1'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
        >
          <div class='modal-dialog'>
            <div class='modal-content'>
              <div class='modal-header'>
                <h1 class='modal-title fs-5' id='exampleModalLabel'>
                  Delete User Email
                </h1>
                <button
                  type='button'
                  class='btn-close'
                  data-bs-dismiss='modal'
                  id='delete-email-close-modal'
                  aria-label='Close'
                  onClick={() => {
                    setSeargentCode("");
                    setSelectedDataToUpdate(null);
                    setEmailToDelete("");
                  }}
                ></button>
              </div>
              <div class='modal-body'>
                <label>
                  To confirm this action, input the email{" "}
                  <b>{selectedDataToUpdate?.email}</b> in the box
                </label>
                <input
                  value={emailToDelete}
                  onChange={({ target: { value } }) => setEmailToDelete(value)}
                  placeholder='Email to delete'
                />
                <br />
                <label>
                  <i>Put your unique code below, Seargent 🫡</i>
                </label>
                <PasswordInput
                  seargentCode={seargentCode}
                  setSeargentCode={setSeargentCode}
                />
              </div>
              <div class='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary close'
                  data-bs-dismiss='modal'
                >
                  Close
                </button>
                <button
                  type='button'
                  className='btn btn-primary save'
                  disabled={seargentCode.length !== 4 || actionLoading}
                  onClick={handleDeleteEmail}
                >
                  {actionLoading ? <Loader /> : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Delete User Modal Ends */}
        {/* Access Auth Modal Starts */}
        <AuthModal
          setAuthUser={setAuthUser}
          closeAccessAuthModal={closeAccessAuthModal}
          handleGetAllCCWMails={handleGetAllCCWMails}
          setPageLoading={setPageLoading}
        />
        {/* Access Auth Modal Ends */}

        {/* Add New email modal starts */}
        <AddNewEmailModal
          handleReturnInvalidAuthUserErr={handleReturnInvalidAuthUserErr}
          authUser={authUser}
        />
        {/* Add New email modal ends */}

        {/* Create Barcode Modal starts */}
        <CreateBarCodeModal
          handleReturnInvalidAuthUserErr={handleReturnInvalidAuthUserErr}
        />
        {/* Create Barcode Modal ends */}

        {/* Create Barcode Modal starts */}
        <TagLinesModal
          handleReturnInvalidAuthUserErr={handleReturnInvalidAuthUserErr}
          authUser={authUser}
        />
        {/* Create Barcode Modal ends */}
      </div>
    </PageLoader>
  );
}
