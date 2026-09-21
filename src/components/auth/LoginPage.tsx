import React, { useState } from "react";
import { Button } from "../ui/Button";
import SSOPlaceholderVisual from "./SSOPlaceholderVisual";
import atlasLogoUrl from "../../icons/Atlas-Logo-Full.svg";
import loginThumbnailUrl from "../../img/Thumbnail-login.png";

const DEFAULT_EMAIL = "user@company.com";

export interface LoginPageProps {
  onLoginSuccess?: (email: string) => void;
  initialEmail?: string;
  className?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  initialEmail = DEFAULT_EMAIL,
  className = "",
}) => {
  const loginEmail = initialEmail.trim() || DEFAULT_EMAIL;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStateTester, setShowStateTester] = useState(true);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess?.(loginEmail);
    }, 900);
  };

  // State tester presets for design walk-through
  const handleSetState = (state: "default" | "error" | "loading") => {
    if (state === "default") {
      setErrorMessage(null);
      setIsLoading(false);
    } else if (state === "error") {
      setErrorMessage("We couldn’t connect to your organization’s SSO. Try again or contact your administrator.");
      setIsLoading(false);
    } else if (state === "loading") {
      setErrorMessage(null);
      setIsLoading(true);
    }
  };

  return (
    <div className={`relative flex h-screen w-screen overflow-hidden bg-[#FBFBFC] ${className}`}>
      {/* State Switcher floating toolbar for designers/developers */}
      {showStateTester && (
        <aside 
          aria-label="Design Review & State Switcher"
          className="absolute top-4 left-4 z-50 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-lg border border-graphite-20/80 backdrop-blur-md text-xs text-text-primary transition-all"
        >
          <span className="font-semibold text-text-secondary flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-1"></span>
            Review States:
          </span>
          <button
            type="button"
            onClick={() => handleSetState("default")}
            className={`px-2 py-0.5 rounded transition ${!errorMessage && !isLoading ? "bg-graphite-10 font-medium text-brand-1" : "hover:bg-graphite-10/60"}`}
          >
            Default
          </button>
          <button
            type="button"
            onClick={() => handleSetState("error")}
            className={`px-2 py-0.5 rounded transition ${errorMessage ? "bg-status-error-bg font-medium text-status-error" : "hover:bg-graphite-10/60"}`}
          >
            Error Banner
          </button>
          <button
            type="button"
            onClick={() => handleSetState("loading")}
            className={`px-2 py-0.5 rounded transition ${isLoading ? "bg-graphite-10 font-medium text-brand-1" : "hover:bg-graphite-10/60"}`}
          >
            Loading (Redirecting…)
          </button>
          <div className="h-3 w-px bg-graphite-20 mx-0.5" />
          <button
            type="button"
            onClick={() => onLoginSuccess?.(loginEmail)}
            className="px-2 py-0.5 rounded font-medium text-brand-1 hover:bg-brand-1/10 transition flex items-center gap-1"
            title="Quickly skip login to enter Home"
          >
            <span>Enter Home</span>
            <span>→</span>
          </button>
          <button
            type="button"
            onClick={() => setShowStateTester(false)}
            className="ml-1 text-text-secondary hover:text-text-primary px-1"
            title="Hide toolbar"
          >
            ✕
          </button>
        </aside>
      )}

      {/* LEFT HALF (50% on desktop, 100% on mobile): Form Area */}
      <main className="flex h-full w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Brand Logo */}
          <header className="mb-10 flex items-center">
            <img
              src={atlasLogoUrl}
              alt="Logo"
              className="h-7 w-auto object-contain"
              onError={(e) => {
                // Fallback if logo svg is unavailable
                e.currentTarget.style.display = "none";
              }}
            />
          </header>

          {/* Heading and Subtitle */}
          <div className="mb-7">
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1D2129] leading-[1.2]">
              Log in with SSO
            </h1>
            <p className="mt-2 text-[14px] text-[#86909C]">
              Continue securely with your organization’s single sign-on.
            </p>
          </div>

          {/* Error Banner (exact match with user's screenshot) */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 rounded-[8px] border border-[#F5A9B4] bg-[#FAD4D8] px-4 py-3 text-[14px] leading-snug text-[#CC2C3C] transition-all animate-in fade-in duration-200"
            >
              {errorMessage}
            </div>
          )}

          {/* SSO Form */}
          <form onSubmit={handleSubmit}>
            {/* Primary Action Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="xl"
                loading={isLoading}
                className="w-full h-[44px] rounded-[8px]"
              >
                {isLoading ? "Redirecting to SSO…" : errorMessage ? "Try again" : "Log in with SSO"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* RIGHT HALF (50%): Placeholder Visual */}
      <section 
        aria-label="Platform preview" 
        className="hidden h-full lg:flex lg:w-1/2"
      >
        <SSOPlaceholderVisual imageSrc={loginThumbnailUrl} />
      </section>
    </div>
  );
};

export default LoginPage;
