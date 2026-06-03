import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

const AuthContext = createContext();

const normalizeRole = (role) => {
  const value = (role || "").toString().trim().toUpperCase().replace(/\s+/g, "_");

  if (value === "SALESMANAGER") return "SALES_MANAGER";
  if (value === "SALESEXECUTIVE") return "SALES_EXECUTIVE";

  return value;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    const source = currentUser || session;

    if (source) {
      setUser({
        ...source,
        role: normalizeRole(source.role),
      });
      return;
    }

    setUser(null);
  }, [currentUser]);

  const hasRole = (...roles) => {
    const normalizedUserRole = normalizeRole(user?.role);
    return roles.map(normalizeRole).includes(normalizedUserRole);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
