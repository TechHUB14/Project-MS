import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { DeptLog } from './components/DeptLog';
import { DeptDash } from './components/DeptDash';
import { Specifications } from './components/Specifications';
import { TenderApplication } from './components/TenderApplication';
import { TenderLog } from './components/TenderLog';
import { TenderDash } from './components/TenderDash';
import { ApplyTender } from './components/ApplyTender';
import { Spect } from './components/Spect';
import { Tenders } from './components/Tenders';
import { Adminlog } from './admin/Adminlog';
import { Admindash } from './admin/Admindash';
import { User } from './admin/User';
import { Schedule } from './admin/Schedule';
import { Projects } from './components/Projects';
import { DeptUser } from './admin/DeptUser';
import { TenderUser } from './admin/TenderUser';
import { Updates } from './components/Updates';
import{Complaint} from './components/Complaint';
import { ViewCom } from './admin/ViewCom';
import{ViewN} from './components/ViewN';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<Adminlog />} />
        <Route path="/admindash" element={<Admindash />} />
        <Route path="/users" element={<User />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/departmentusers" element={<DeptUser />} />
        <Route path="/tenderers" element={<TenderUser />} />
        <Route path="/viewcom" element={<ViewCom />} />
        

        {/* Department Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/deptlogin" element={<DeptLog />} />
        <Route path="/deptdash" element={<DeptDash />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/viewnotice" element={<ViewN />} />

        {/* Tender Routes */}
        <Route path="/specifications" element={<Specifications />} />
        <Route path="/tenderapplications" element={<TenderApplication />} />
        <Route path="/tenderlogin" element={<TenderLog />} />
        <Route path="/tenderdash" element={<TenderDash />} />
        <Route path="/applytender" element={<ApplyTender />} />
        <Route path="/spect" element={<Spect />} />
        <Route path="/tenders" element={<Tenders />} />
        <Route path="/complaint" element={<Complaint />} />

        {/* Projects */}
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
