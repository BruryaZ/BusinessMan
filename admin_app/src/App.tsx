import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserRegistration from './components/UserRegistration';
import AdminLogin from './components/AdminLogin';
import UploadFiles from './components/UploadFiles';
import DataViweing from './components/DataViweing';
import Home from './components/Home';
import BusinessTable from './components/BusinessTable';
import { BusinessImpl } from './models/Business';
import ProductionReports from './components/ProductionReports';
import UserManagemet from './components/UserManagemet';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/user-registration">User Registration</Link>
        <span>   |   </span>
        <Link to="/admin-login">Admin Login</Link>
        <span>   |   </span>
        <Link to="/upload-file">Upload Files</Link>
        <span>   |   </span>
        <Link to="/data-viweing">Data Viewing</Link>
        <span>   |   </span>
        <Link to="/">Home</Link>
        <span>   |   </span>
        <Link to='/user-management'>User Management</Link>
        <span>   |   </span>
        <Link to="/production-reports">Production Report</Link>
        <span>   |   </span>
        <Link to="/business-table">Business Table</Link>
      </nav>

      <Routes>
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/upload-file' element={<UploadFiles />} />
        <Route path='/data-viweing' element={<DataViweing />} />
        <Route path='/business-table' element={<BusinessTable business={new BusinessImpl(0, 0, '', '', '', '', 2 , 0, 0, 0, 0, 0, 0)}/>}/>
        <Route path='/production-reports' element={<ProductionReports/>}/>
        <Route path='/user-management' element={<UserManagemet/>}/>
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;