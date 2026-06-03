import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { isOfflineLocalSession } from "./offline/offlineLocal";

const ProtectedRoute = ({ children }) => {

    const token = sessionStorage.getItem("token");
    const sessionUser = sessionStorage.getItem("userSession");

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    if (isOfflineLocalSession()) {
        return sessionUser ? children : <Navigate to="/signin" replace />;
    }

    try {

        const decoded = jwtDecode(token);

        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {

            sessionStorage.clear();

            return <Navigate to="/signin" replace />;
        }

        return children;

    } catch (error) {

        sessionStorage.clear();

        return <Navigate to="/signin" replace />;
    }
};

export default ProtectedRoute;
