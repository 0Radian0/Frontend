import { Routes, Route } from "react-router-dom";
import './App.css';

// Bootstrap + ikony
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Komponenty
import Menu from './components/Menu';
import UsersPanel from './pages/UsersPanel';
import AdminRoute from "./components/AdminRoute";
import LoggedUsersRoute from "./components/LoggedUsersRoute";
import NotLoggedUsersRoute from "./components/NotLoggedUsersRoute";
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
import Login from './pages/Login/Login';

// Komponenty globalne
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import NavMenu from "./components/NavMenu";
import Footer from "./components/Footer";

//Style

import './assets/styles/Style_main/style.css';

import './assets/styles/Style_sub/style_login.css';



function App() {
  return (
    <div className="App">
      <TopBar />
      <Header />
      <NavMenu />

      <Routes>

        <Route path="/" element={<Login/>} />
        {/* Logowanie */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rejestracja / auth */}
        <Route path="/register" element={<Login />} />
        <Route path="/auth" element={<Authentication />} />

        {/* Reset hasła */}
        <Route
          path="/forgot-password"
          element={
            <NotLoggedUsersRoute>
              <ForgotPassword />
            </NotLoggedUsersRoute>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Formularz */}
        <Route
          path="/appForm"
          element={
            <NotLoggedUsersRoute>
              <ApplicationForm />
            </NotLoggedUsersRoute>
          }
        />

        {/* Strefa zalogowana */}
        <Route
          path="/frontpage"
          element={
            <LoggedUsersRoute>
              <FrontPage />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/userspanel"
          element={
            <AdminRoute>
              <UsersPanel />
            </AdminRoute>
          }
        />

        <Route
          path="/changepassword"
          element={
            <LoggedUsersRoute>
              <ChangePassword />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/changedescription"
          element={
            <LoggedUsersRoute>
              <ChangeDescription />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/changedata"
          element={
            <LoggedUsersRoute>
              <ChangeUserData />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/trainingspanel"
          element={
            <LoggedUsersRoute>
              <TrainingsPanel />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <LoggedUsersRoute>
              <PaymentsPanel />
            </LoggedUsersRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
     
    </div>
  );
}

export default App;
