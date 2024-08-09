import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateBarCode } from "./pages/create-barcode";
import { MarkAttendance } from "./pages/attendance";
import App from "./App";
import { LoadEmails } from "./pages/add-ccw-emails";
import { Repository } from "./pages/repository";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/mark-attendance' element={<MarkAttendance />} />
        <Route path='/' element={<CreateBarCode />} />
        <Route path='/create-emails' element={<LoadEmails />} />
        <Route path='/repository' element={<Repository />} />
        <Route path='/test' element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
