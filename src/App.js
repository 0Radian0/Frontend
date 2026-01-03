import { Routes, Route } from "react-router-dom";
import './App.css';

// Bootstrap + ikony
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Komponenty
=
import UsersPanel from './pages/UsersPanel';
import AdminRoute from "./components/AdminRoute";
import LoggedUsersRoute from "./components/LoggedUsersRoute";
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

// Style
import './assets/styles/Style_main/style.css';
import './assets/styles/Style_sub/style_login.css';

function App() {
  return (
    <div className="App">
      <TopBar />
      <Header />
      <NavMenu />

      <Routes>
        {/* ✅ Strona główna i logowanie */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Rejestracja */}
        <Route path="/register" element={<Login />} />

        {/* ✅ Publiczne (dostępne dla wszystkich) */}
        <Route path="/appForm" element={<ApplicationForm />} />
        <Route path="/forgotPass" element={<ForgotPassword />} />
        <Route path="/resetPass/:token" element={<ResetPassword />} />

        {/* ✅ Tylko dla niezalogowanych */}
        <Route path="/auth" element={<Authentication />} />

        {/* ✅ Strefa zalogowana (poprawione wielkości liter) */}
        <Route
          path="/frontPage"
          element={
            <LoggedUsersRoute>
              <FrontPage />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/changePassword"
          element={
            <LoggedUsersRoute>
              <ChangePassword />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/changeDescription"
          element={
            <LoggedUsersRoute>
              <ChangeDescription />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/changeData"
          element={
            <LoggedUsersRoute>
              <ChangeUserData />
            </LoggedUsersRoute>
          }
        />

        <Route
          path="/trainingsPanel"
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

        {/* ✅ Strefa admina */}
        <Route
          path="/UsersPanel"
          element={
            <AdminRoute>
              <UsersPanel />
            </AdminRoute>
          }
        />

        {/* ✅ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;