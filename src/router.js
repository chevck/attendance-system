import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateBarCode } from "./create-barcode";
import { MarkAttendance } from "./attendance";
import App from "./App";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/mark-attendance' element={<MarkAttendance />} />
        <Route path='/' element={<CreateBarCode />} />
        <Route path='/test' element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
