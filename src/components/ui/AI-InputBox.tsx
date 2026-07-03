import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import aiSubmitIconUrl from "../../icons/AI-submit.svg";

const SINGLE_LINE_HEIGHT = 24;
const MAX_TEXTAREA_HEIGHT = 140;

export interface AIInputBoxProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  onValueChange?: (text: string) => void;
  focusTrigger?: number;
}

export function AIInputBox({
  onSubmit,
  placeholder = "Ask me anything\u2026",
  disabled = false,
  className = "",
  value: controlledValue,
  onValueChange,
  focusTrigger = 0,
}: AIInputBoxProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const setValue = (v: string) => {
    if (isControlled) {
      onValueChange?.(v);
    } else {
      setInternalValue(v);
    }
  };
  const [isFocused, setIsFocused] = useState(false);
  const [isMaxHeight, setIsMaxHeight] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    el.style.height = `${Math.min(scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    setIsMaxHeight(scrollHeight > SINGLE_LINE_HEIGHT);
  }, [value]);

  useEffect(() => {
    if (disabled) {
      textareaRef.current?.blur();
    }
  }, [disabled]);

  useEffect(() => {
    if (focusTrigger > 0 && !disabled) {
      textareaRef.current?.focus();
    }
  }, [focusTrigger]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (disabled || !value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const borderClasses =
    isFocused && !disabled
      ? "border border-brand-1 shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)]"
      : "border border-graphite-10";

  const layoutClasses = isMaxHeight
    ? "px-[10px] py-[9px] rounded-[6px]"
    : "px-[10px] py-[8px] rounded-[8px] h-[40px]";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ai-inputbox-textarea::-webkit-scrollbar {
          width: 4px;
        }
        .ai-inputbox-textarea::-webkit-scrollbar-track {
          background: transparent;
          border: none;
        }
        .ai-inputbox-textarea::-webkit-scrollbar-thumb {
          background-color: rgba(216, 218, 218, 0.75);
          border-radius: 8px;
        }
        .ai-inputbox-textarea::-webkit-scrollbar-thumb:hover {
          background-color: #B2B4B4;
        }
        .ai-inputbox-textarea {
          scrollbar-width: thin;
          scrollbar-color: rgba(216, 218, 218, 0.75) transparent;
        }
      `}} />

      <form
        onSubmit={handleSubmit}
        className={[
          "bg-white flex flex-col justify-center",
          borderClasses,
          layoutClasses,
          "transition-all duration-200",
          className,
        ].join(" ")}
      >
        <div
          className={[
            "flex w-full",
            isMaxHeight ? "items-end gap-[10px]" : "items-center gap-[16px]",
          ].join(" ")}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={[
              "t-input",
              "flex-1 w-full bg-transparent border-none outline-none resize-none",
              "text-text-primary",
              disabled
                ? "placeholder:text-graphite-20"
                : "placeholder:text-graphite-40",
              isMaxHeight
                ? "max-h-[140px] overflow-y-auto ai-inputbox-textarea"
                : "",
              disabled ? "cursor-not-allowed" : "",
            ].join(" ")}
          />

          <button
            type="submit"
            disabled={disabled}
            className={[
              "relative w-[24px] h-[24px] rounded-[4px] flex items-center justify-center shrink-0 after:content-[''] after:absolute after:-inset-[8px]",
              "transition-colors",
              disabled
                ? "bg-brand-1-disabled cursor-not-allowed"
                : "bg-brand-1 hover:bg-brand-1-hover cursor-pointer active:scale-95",
            ].join(" ")}
            aria-label="Send"
          >
            <img
              src={aiSubmitIconUrl}
              alt=""
              aria-hidden="true"
              className="w-[11px] h-[12px] block shrink-0"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </button>
        </div>
      </form>
    </>
  );
}

export default AIInputBox;
