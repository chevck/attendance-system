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
import { useNavigate } from "react-router-dom";

export function Repository() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [allEmails, setAllEmails] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendants, setAttendants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllCCWMails();
  }, []);

  useEffect(() => {
    if (selectedDate) handleGetAttendees();
  }, [selectedDate]);

  const handleGetAllCCWMails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users`
      );
      setAllEmails(data);
    } catch (error) {
      toast.error(error?.response?.data || "Error getting ccw emails");
    }
  };

  const handleGetAttendees = async () => {
    try {
      setLoading(true);
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
    }
  };

  const handleDownloadAttendees = async () => {
    try {
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
    }
  };

  const handleDownloadCCWEmails = async () => {
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

  return (
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
          <button onClick={() => navigate("/create-emails")}>
            Add New Member
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
              {allEmails.map((el, key) => (
                <tr key={key}>
                  <td colSpan={3}>{el.email.toLowerCase()}</td>
                  <td className='actions'>
                    <button>Update Email</button>
                    <button>
                      <CancelIcon />
                      Remove User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
