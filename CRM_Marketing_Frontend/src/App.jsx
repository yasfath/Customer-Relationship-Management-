import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import MainLayout from "./common/MainLayout";
import DashBoard from "./DashBoardMain/DashBoard";
import Campaigns from "./Campaigns/Campaigns";
import Leads from "./Leads/Leads";
import Activity from "./Activity/Activity";
import Events from "./Events/Events";
import Deals from "./Deals/Deals";
import Contacts from "./Contacts/Contacts";
import EmailResponse from "./EmailResponse/EmailResponse";
import Staff from "./Staff/Staff";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import ChangePassword from "./Auth/ChangePassword";
import Profile from "./Profile/Profile";
import Notifications from "./Notifications/Notifications";
import ProtectedRoute from "./ProtectedRoute";
import Main from "./CrmMarketing_LandingPage/Main";
import ChatModule from "./ChatModule/ChatModule";

function App() {
  return (
    <>
      <Routes>
        {/* Landing Page as Root */}
        <Route path="/" element={<Main />} />

        {/* Auth Routes - No Sidebar/Navbar */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Forgotpassword" element={<ForgotPassword />} />
        <Route path="/Change-password" element={<ChangePassword />} />

        {/* Dashboard Routes - With Sidebar/Navbar */}
        <Route
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
          <Route path="/DashBoard" element={<DashBoard />} />
          <Route path="/Campaigns" element={<Campaigns />} />
          <Route path="/Leads" element={<Leads />} />
          <Route path="/Activity" element={<Activity />} />
          <Route path="/Events" element={<Events />} />
          <Route path="/Deals" element={<Deals />} />
          <Route path="/Contacts" element={<Contacts />} />
          <Route path="/EmailResponse" element={<EmailResponse />} />
          <Route path="/Staff" element={<Staff />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/ChatModule" element={<ChatModule />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
