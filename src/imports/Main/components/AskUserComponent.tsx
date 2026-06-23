import React, { useState } from "react";

function ArrowLeftIcon({ className = "w-[24px] h-[24px]", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" fill={color}/>
    </svg>
  );
}

function ArrowRightIcon({ className = "w-[24px] h-[24px]", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1715 12.0007L8.22168 7.05093L9.6359 5.63672L15.9999 12.0007L9.6359 18.3646L8.22168 16.9504L13.1715 12.0007Z" fill={color}/>
    </svg>
  );
}

function QuestionIcon({ className = "w-[24px] h-[24px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3C4242" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.08984 8.99984C9.32495 8.3315 9.789 7.76794 10.3998 7.40897C11.0106 7.05 11.7287 6.91878 12.427 7.03855C13.1253 7.15832 13.7587 7.52136 14.2149 8.06337C14.6712 8.60537 14.9209 9.29136 14.9198 9.99984C14.9198 11.9998 11.9198 12.9998 11.9198 12.9998M11.9998 16.9998H12.0098" stroke="#3C4242" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CTAPrimaryButton({ children, disabled = false, onClick }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-[8px] py-[4px] rounded-[4px] flex items-center gap-[4px] transition-colors h-[28px] ${
        disabled
          ? 'bg-[#E6CCDC] text-white cursor-not-allowed'
          : 'bg-[#830051] hover:bg-[#6a0042] text-white'
      }`}
    >
      <span className="t-small text-white">{children}</span>
    </button>
  );
}

function CTASecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white hover:bg-[#F8F7F7] border-[0.6px] border-[#D8DADA] text-[#3C4242] px-[8px] py-[4px] rounded-[4px] flex items-center gap-[4px] transition-colors h-[28px]"
    >
      <span className="t-small text-[#3C4242]">{children}</span>
    </button>
  );
}

export default function AskUserComponent({ onSubmit, onSkip, panelWidth }: { 
  onSubmit?: (answers: { q: string; a: string }[]) => void;
  onSkip?: () => void;
  panelWidth: number;
}) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<{ q: string; a: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState("");
  const [fadeClass, setFadeClass] = useState("q-fade-in");

  const questions = [
    {
      id: 1,
      title: "What type of assistance do you need?",
      options: ["Planning / Task Breakdown", "Implementation", "Review & Testing"]
    },
    {
      id: 2,
      title: "How familiar are you with the codebase?",
      options: ["Expert", "Intermediate", "Newcomer"]
    }
  ];

  const currentQ = questions.find(q => q.id === step) || questions[0];

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setCustomInput("");
    if (index < currentQ.options.length) {
      const newAnswers = [...answers];
      newAnswers[step - 1] = { q: currentQ.title, a: currentQ.options[index] };
      setAnswers(newAnswers);
      if (step < questions.length) {
        setTimeout(() => triggerNextStep(), 200);
      }
    }
  };

  const triggerNextStep = () => {
    setFadeClass("q-fade-out");
    setTimeout(() => {
      setStep(prev => prev + 1);
      setSelectedOption(null);
      setCustomInput("");
      setFadeClass("q-fade-in");
    }, 250);
  };

  const handleContinue = () => {
    const val = selectedOption === currentQ.options.length ? customInput : currentQ.options[selectedOption!];
    const newAnswers = [...answers];
    newAnswers[step - 1] = { q: currentQ.title, a: val };
    setAnswers(newAnswers);
    if (step < questions.length) {
      triggerNextStep();
    } else {
      onSubmit?.(newAnswers);
    }
  };

  return (
    <div 
      className="absolute bottom-[52px] left-[10px] bg-white border-[0.6px] border-[#D8DADA] rounded-[8px] shadow-[1px_2px_8px_0px_rgba(0,0,0,0.08)] z-10 overflow-hidden"
      style={{ width: `calc(100% - 20px)` }}
    >
      <div className="flex items-center justify-between px-[10px] py-[8px] border-b-[0.6px] border-[#D8DADA]">
        <div className="flex items-center gap-[6px]">
          <QuestionIcon className="w-[16px] h-[16px]" />
          <p className="t-body-compact text-[#3C4242] font-normal">Questions</p>
        </div>
        <div className="flex items-center">
          <button onClick={() => step > 1 && setStep(step - 1)} className={`w-[24px] h-[24px] flex items-center justify-center hover:bg-[#EBECEC] rounded-[4px] ${step === 1 ? 'opacity-30' : ''}`}><ArrowLeftIcon className="w-[16px] h-[16px]" color="#888E8E" /></button>
          <div className="min-w-[40px] text-center"><span className="t-caption text-[#888E8E]">{step} / {questions.length}</span></div>
          <button onClick={() => step < questions.length && handleContinue()} className={`w-[24px] h-[24px] flex items-center justify-center hover:bg-[#EBECEC] rounded-[4px] ${step === questions.length ? 'opacity-30' : ''}`}><ArrowRightIcon className="w-[16px] h-[16px]" color="#888E8E" /></button>
        </div>
      </div>
      <div className={`px-[10px] pt-[12px] pb-[4px] q-fade ${fadeClass}`}>
        <p className="t-heading text-[#3C4242] mb-[8px] truncate">{currentQ.title}</p>
        <div className="flex flex-col">
          {currentQ.options.map((option, index) => (
            <div key={`${step}-${index}`} className={`flex items-center gap-[8px] p-[8px] rounded-[4px] cursor-pointer transition-colors ${selectedOption === index ? 'bg-[#F8F7F7]' : 'bg-transparent hover:bg-[#F8F7F7]'}`} onClick={() => handleSelectOption(index)}>
              <div className="w-[16px] h-[16px] shrink-0">
                {selectedOption === index ? <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="white" stroke="#830051" strokeWidth="2"/><circle cx="8" cy="8" r="3.2" fill="#830051"/></svg> : <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.2" fill="white" stroke="#D8DADA" strokeWidth="1.6"/></svg>}
              </div>
              <p className="t-body text-[#3C4242] truncate">{option}</p>
            </div>
          ))}
          <div className={`flex items-center gap-[8px] p-[8px] rounded-[4px] ${selectedOption === currentQ.options.length ? 'bg-[#F8F7F7]' : ''}`}>
            <div className="w-[16px] h-[16px] shrink-0" onClick={() => {setSelectedOption(currentQ.options.length); setCustomInput("")}}>
              {selectedOption === currentQ.options.length ? <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="white" stroke="#830051" strokeWidth="2"/><circle cx="8" cy="8" r="3.2" fill="#830051"/></svg> : <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.2" fill="white" stroke="#D8DADA" strokeWidth="1.6"/></svg>}
            </div>
            <input type="text" placeholder="Or, describe your needs..." value={customInput} onChange={(e) => { setCustomInput(e.target.value); setSelectedOption(currentQ.options.length); }} className="flex-1 t-body text-[#3C4242] placeholder:text-[#B2B4B4] bg-transparent border-none outline-none" />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-[8px] px-[10px] py-[8px]">
        <CTASecondaryButton onClick={onSkip}>Skip</CTASecondaryButton>
        <CTAPrimaryButton disabled={selectedOption === null && !customInput} onClick={handleContinue}>{step < questions.length ? "Continue" : "Submit"}</CTAPrimaryButton>
      </div>
    </div>
  );
}
