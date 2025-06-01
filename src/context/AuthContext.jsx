import { createContext, useContext, useState } from "react";
import { users } from "../data/mockData";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!foundUser) {
      throw new Error("Invalid credentials");
    }
    setUser(foundUser);
    // localStorage.setItem("user", user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
