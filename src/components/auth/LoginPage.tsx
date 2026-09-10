import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import SSOPlaceholderVisual from "./SSOPlaceholderVisual";
import atlasLogoUrl from "../../icons/Atlas-Logo-Full.svg";

export interface LoginPageProps {
  onLoginSuccess?: (email: string) => void;
  initialEmail?: string;
  className?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  initialEmail = "",
  className = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStateTester, setShowStateTester] = useState(true);

  // Email validation regex (standard work email)
  const isValidEmailFormat = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setErrorMessage("Please enter your work email to continue.");
      return;
    }

    if (!isValidEmailFormat(trimmed)) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    // Check for simulated unconfigured domain
    // If the domain is "unconfigured.com" or user tests unconfigured, trigger the exact error banner
    const domain = trimmed.split("@")[1]?.toLowerCase();
    const unconfiguredDomains = ["gmail.com", "qq.com", "163.com", "unconfigured.com", "example.com"];

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      if (domain && unconfiguredDomains.includes(domain)) {
        setErrorMessage("SSO is not configured for this email domain");
      } else {
        // Success login
        if (onLoginSuccess) {
          onLoginSuccess(trimmed);
        }
      }
    }, 900);
  };

  // State tester presets for design walk-through
  const handleSetState = (state: "empty" | "sample" | "error" | "loading") => {
    if (state === "empty") {
      setEmail("");
      setErrorMessage(null);
      setIsLoading(false);
    } else if (state === "sample") {
      setEmail("ruini.ou@taimei.com");
      setErrorMessage(null);
      setIsLoading(false);
    } else if (state === "error") {
      setEmail("ruini.ou@taimei.com");
      setErrorMessage("SSO is not configured for this email domain");
      setIsLoading(false);
    } else if (state === "loading") {
      setEmail("ruini.ou@taimei.com");
      setErrorMessage(null);
      setIsLoading(true);
    }
  };

  const isButtonDisabled = !email.trim() || isLoading;

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
            onClick={() => handleSetState("empty")}
            className={`px-2 py-0.5 rounded transition ${!email && !errorMessage && !isLoading ? "bg-graphite-10 font-medium text-brand-1" : "hover:bg-graphite-10/60"}`}
          >
            Empty (Disabled)
          </button>
          <button
            type="button"
            onClick={() => handleSetState("sample")}
            className={`px-2 py-0.5 rounded transition ${email && !errorMessage && !isLoading ? "bg-graphite-10 font-medium text-brand-1" : "hover:bg-graphite-10/60"}`}
          >
            Filled
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
            Loading (Opening...)
          </button>
          <div className="h-3 w-px bg-graphite-20 mx-0.5" />
          <button
            type="button"
            onClick={() => onLoginSuccess?.(email.trim() || "ruini.ou@taimei.com")}
            className="px-2 py-0.5 rounded font-medium text-brand-1 hover:bg-brand-1/10 transition flex items-center gap-1"
            title="快捷跳过登录直接进入系统"
          >
            <span>进入 Home</span>
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

      {/* Top right direct Home entry shortcut button */}
      <button
        type="button"
        onClick={() => onLoginSuccess?.(email.trim() || "ruini.ou@taimei.com")}
        className="absolute top-4 right-4 z-50 flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-medium text-text-primary shadow-sm border border-graphite-20 hover:border-brand-1 hover:text-brand-1 hover:shadow transition-all group backdrop-blur-sm"
        title="快捷直接进入主系统"
      >
        <svg className="w-3.5 h-3.5 text-text-secondary group-hover:text-brand-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>快捷进入 Home</span>
        <svg className="w-3 h-3 text-text-secondary group-hover:text-brand-1 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

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
              Enter your work email.
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Email Field */}
            <div>
              <Input
                type="email"
                name="email"
                inputSize="lg"
                placeholder="Email"
                value={email}
                hasError={!!errorMessage}
                disabled={isLoading}
                autoFocus
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
              />
            </div>

            {/* Primary Action Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="xl"
                loading={isLoading}
                disabled={isButtonDisabled}
                className="w-full h-[44px] rounded-[8px]"
              >
                {isLoading ? "Opening..." : "Continue"}
              </Button>
            </div>

            {/* Direct Bypass Shortcut */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onLoginSuccess?.(email.trim() || "ruini.ou@taimei.com")}
                className="text-[13px] text-text-secondary hover:text-brand-1 transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>直接进入 Home</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* RIGHT HALF (50%): Placeholder Visual */}
      <section 
        aria-label="Platform preview" 
        className="hidden h-full lg:flex lg:w-1/2"
      >
        <SSOPlaceholderVisual />
      </section>
    </div>
  );
};

export default LoginPage;
