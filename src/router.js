import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateBarCode } from "./pages/create-barcode";
import { MarkAttendance } from "./pages/attendance";
import App from "./App";
import { LoadEmails } from "./pages/emails";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/mark-attendance' element={<MarkAttendance />} />
        <Route path='/' element={<CreateBarCode />} />
        <Route path='/create-emails' element={<LoadEmails />} />
        <Route path='/test' element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
