import { Routes, Route } from "react-router-dom";
import './App.css';

//Instalacja boostrap i ikony
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

import About from './pages/About';
import Trainings from './pages/Trainings';
import Location from './pages/Location';

import Menu from './components/Menu';
import HemaReko from './components/HemaReko';
import UsersPanel from './pages/UsersPanel';
import AdminRoute from "./components/AdminRoute";
import LoggedUsersRoute from "./components/LoggedUsersRoute";
import NotLoggedUsersRoute from "./components/NotLoggedUsersRoute"
import TrainingsPanel from "./pages/TrainingsPanel";
import ChangePassword from "./components/ChangePassword";
import PaymentsPanel from "./pages/PaymentsPanel";
import ChangeDescription from "./components/ChangeDescription";
import FrontPage from "./pages/FrontPage";
import NotFound from "./components/NotFound";
import ChangeUserData from "./components/ChangeUserData";
import Authentication from "./pages/Authentication";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ApplicationForm from "./components/ApplicationForm";

//Style
//import './assets/styles/Style_main/style_responsive_480.css';
//import './assets/styles/Style_main/style_responsive_1024.css';
//import './assets/styles/Style_main/style_responsive_884.css';
import './assets/styles/Style_main/style.css';
//import './assets/styles/Style_sub/style_g.css';
import './assets/styles/Style_sub/style_login.css';
//import './assets/styles/Style_sub/style_register.css';

//komponenty globalne
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import NavMenu from "./components/NavMenu";
import Footer from "./components/Footer";

import Login from './pages/Login/Login';


function App() {
  return (
    <div className="App">

  <TopBar/>
  <Header/>
  <NavMenu/>



      
      <Routes>
        <Route path="/" element={<Login/>} />

        {/* Zaimportowane moduły */}
        <Route path="/Login" element={<Login />} />
        <Route path ="/Register" element = {<Login/>}/>


        <Route path="/appForm" element={<NotLoggedUsersRoute><ApplicationForm /></NotLoggedUsersRoute>} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/forgotPass" element={<NotLoggedUsersRoute><ForgotPassword /></NotLoggedUsersRoute>} />
        <Route path="/resetPass/:token" element={<ResetPassword />} />

        <Route path="/UsersPanel" element={<AdminRoute><UsersPanel /></AdminRoute>} />
        <Route path="/frontPage" element={<LoggedUsersRoute><FrontPage /></LoggedUsersRoute>} />
        <Route path="/changePassword" element={<LoggedUsersRoute><ChangePassword /></LoggedUsersRoute>} />
        <Route path="/changeDescription" element={<LoggedUsersRoute><ChangeDescription /></LoggedUsersRoute>} />
        <Route path="/trainingsPanel" element={<LoggedUsersRoute><TrainingsPanel /></LoggedUsersRoute>} />
        <Route path="/payments" element={<LoggedUsersRoute><PaymentsPanel /></LoggedUsersRoute>} />
        <Route path="/changeData" element={<LoggedUsersRoute><ChangeUserData /></LoggedUsersRoute>} />

        {/* Nieistniejące strony */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Menu />
      <Footer/>
    </div>
  );
}


export default App;
