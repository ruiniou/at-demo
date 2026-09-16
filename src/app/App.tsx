import React, { useState } from "react";
import Main from "../imports/Main/Main";
import AccessGuard from "../components/AccessGuard";
import LoginPage from "../components/auth/LoginPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AccessGuard>
      <div className="size-full overflow-hidden relative">
        {!isAuthenticated ? (
          <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          <div className="size-full relative">
            <Main onLogout={() => setIsAuthenticated(false)} />
          </div>
        )}
      </div>
    </AccessGuard>
  );
}