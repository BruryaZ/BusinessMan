import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import UploadFiles from './components/UploadFiles';
import DataViweing from './components/DataViweing';
import Home from './components/Home';
import BusinessTable from './components/BusinessTable';
import { BusinessImpl } from './models/Business';
import ProductionReports from './components/ProductionReports';
import UserManagemet from './components/UserManagemet';
import AuthContext from './context/AuthContext';
import AdminRegister from './components/AdminRegister';
import RegisterBusinessData from './components/RegisterBusinessData';
import RegisterUser from './components/RegisterUser';

function App() {
  return (
    <AuthContext>
    <Router>
      <nav dir="rtl">
        <Link to="/register-user">רישום משתמש</Link>
        <span>   |   </span>
        <Link to="/admin-login">כניסת מנהל</Link>
        <span>   |   </span>
        <Link to="/upload-file">העלאת קבצים</Link>
        <span>   |   </span>
        <Link to="/data-viweing">צפייה בנתונים</Link>
        <span>   |   </span>
        <Link to="/">בית</Link>
        <span>   |   </span>
        <Link to='/user-management'>ניהול משתמשים</Link>
        <span>   |   </span>
        <Link to="/production-reports">דו"ח ייצור</Link>
        <span>   |   </span>
        <Link to="/business-table">טבלת עסקים</Link>
        <span>   |   </span>
        <Link to="/admin-register">רישום מנהל</Link>
        <span>   |   </span>
        <Link to="/register-business-data">רישום נתוני העסק</Link>
      </nav>

      <Routes>
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/upload-file' element={<UploadFiles />} />
        <Route path='/data-viweing' element={<DataViweing />} />
        <Route path='/business-table' element={<BusinessTable business={new BusinessImpl(0, 0, '', '', '', '', 2 , 0, 0, 0, 0, 0, 0)}/>}/>
        <Route path='/production-reports' element={<ProductionReports/>}/>
        <Route path='/user-management' element={<UserManagemet/>}/>
        <Route path='/' element={<Home />} />
        <Route path='/admin-register' element={<AdminRegister />} />
        <Route path='/register-business-data' element={<RegisterBusinessData/>} />
      </Routes>
    </Router>
    </AuthContext>
  );
}

export default App;