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
            <Main />
            {/* Quick Switcher back to Login Page for demo evaluation */}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3 py-1.5 text-xs text-white shadow-xl backdrop-blur-md transition hover:bg-slate-900 hover:scale-105 active:scale-95"
              title="Return to SSO Login Page for review"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Back to SSO Login</span>
            </button>
          </div>
        )}
      </div>
    </AccessGuard>
  );
}