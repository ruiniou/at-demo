import React from "react";

interface SSOPlaceholderVisualProps {
  imageSrc?: string;
  className?: string;
}

export const SSOPlaceholderVisual: React.FC<SSOPlaceholderVisualProps> = ({
  imageSrc,
  className = "",
}) => {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-br from-[#F8F7F7] via-[#F3EEF1] to-[#EAE2E7] flex flex-col items-center justify-center p-8 select-none ${className}`}
    >
      {/* Background ambient lighting and pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#830051_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#830051]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#4D0030]/5 blur-3xl pointer-events-none" />

      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Molecular therapy illustration"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div className="relative z-10 flex flex-col items-center max-w-[420px] w-full text-center">
          {/* Placeholder Graphic Card */}
          <div className="w-full aspect-[4/3] rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.01]">
            {/* Header mock bar */}
            <div className="flex items-center justify-between border-b border-graphite-10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="h-2 w-20 rounded-full bg-graphite-15" />
            </div>

            {/* Central illustration placeholder */}
            <div className="my-auto flex flex-col items-center justify-center py-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#830051]/10 to-[#4D0030]/15 flex items-center justify-center text-[#830051] mb-4 shadow-inner">
                {/* Modern placeholder icon */}
                <svg
                  className="w-10 h-10 opacity-75"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <span className="text-sm font-medium text-text-primary tracking-wide">
                Image Placeholder
              </span>
              <span className="text-xs text-text-secondary mt-1">
                Aspect ratio 1:1 or 4:3 hero visual
              </span>
            </div>

            {/* Bottom skeleton bars */}
            <div className="space-y-2 pt-2 border-t border-graphite-10">
              <div className="h-2 w-3/4 rounded-full bg-graphite-15 mx-auto" />
              <div className="h-1.5 w-1/2 rounded-full bg-graphite-10 mx-auto" />
            </div>
          </div>

          <div className="mt-6 text-xs text-text-secondary/80 font-medium">
            Clinical Trial Intelligence &amp; Copilot Workspace
          </div>
        </div>
      )}
    </div>
  );
};

export default SSOPlaceholderVisual;
