import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import UploadFiles from './components/UploadFiles';
import DataViweing from './components/ViewData';
import Home from './components/Home';
import BusinessTable from './components/BusinessTable';
import ProductionReports from './components/ProductionReports';
import UserManagemet from './components/UserManagemet';
// import AuthContext from './context/AuthContext';
import RegisterUser from './components/UserRegister';
import BusinessAndAdmin from './components/BusinessAndAdmin';
import GlobalContext from './context/GlobalContext';
import { BusinessImpl } from './models/Business';
import axios from 'axios';
import RegisterBusinessData from './components/RegisterBusinessData';
import AdminRoute from './components/AdminRoute';
import IncomAndExpennses from './components/Incom&Expennses';

function App() {
  axios.defaults.withCredentials = true;// הטוקן יישלח בכל קריאת אקסיוס

  return (
    <GlobalContext>
      <Router>
        <nav dir="rtl">
          <Link to="/register-user">רישום משתמש</Link>
          <span>   |   </span>
          <Link to="/user-login">כניסת משתמש</Link>
          <span>   |   </span>
          <Link to="/admin-login">כניסת מנהל</Link>
          <span>   |   </span>
          <Link to="/upload-file">העלאת קבצים</Link>
          <span>   |   </span>
          <Link to="/">בית</Link>
          <span>   |   </span>
          <Link to="/view-data">צפייה בנתונים</Link>
          <span>   |   </span>
          <Link to='/user-management'>ניהול משתמשים</Link>
          <span>   |   </span>
          <Link to="/production-reports">דו"ח ייצור</Link>
          <span>   |   </span>
          <Link to="/business-table">טבלת עסקים</Link>
          <span>   |   </span>
          <Link to="/incom&Expennses">ניהול הוצאות והכנסות</Link>
          <span>   |   </span>
          <Link to='/business-register'>רישום עסק חדש</Link>
          <span>   |   </span>
          <Link to='/register-admin&business'>רישום עסק ומנהל חדש</Link>
        </nav>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/upload-file' element={<UploadFiles />} />
          <Route path='/register-admin&business' element={<BusinessAndAdmin />} />

          <Route
            path='/production-reports'
            element={
              <AdminRoute>
                <ProductionReports />
              </AdminRoute>
            }
          />
          <Route
            path='/business-table'
            element={
              <AdminRoute>
                <BusinessTable business={new BusinessImpl(0, 0, '', '', '', '', 2, 0, 0, 0, 0, 0, 0)} />
              </AdminRoute>
            }
          />
          <Route
            path='/view-data'
            element={
              <AdminRoute>
                <DataViweing />
              </AdminRoute>
            }
          />
          <Route
            path='/user-management'
            element={
              <AdminRoute>
                <UserManagemet />
              </AdminRoute>
            }
          />
          <Route
            path='/business-register'
            element={
              <AdminRoute>
                <RegisterBusinessData />
              </AdminRoute>
            }
          />
            <Route
            path='/incom&Expennses'
            element={
              <AdminRoute>
                <IncomAndExpennses />
              </AdminRoute>
            }
          />
        </Routes>

      </Router >
    </GlobalContext >
  );
}

export default App;