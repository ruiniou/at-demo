import React, { useState, useEffect } from 'react';

interface AccessGuardProps {
  children: React.ReactNode;
  /** 可选：覆盖默认口令，默认读取环境变量 VITE_ACCESS_PASSCODE 或 '202688' */
  passcode?: string;
}

export const AccessGuard: React.FC<AccessGuardProps> = ({ 
  children, 
  passcode = (import.meta as any).env?.VITE_ACCESS_PASSCODE || '202688' 
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('demo_review_unlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() === passcode) {
      sessionStorage.setItem('demo_review_unlocked', 'true');
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('访问口令错误，请联系项目负责人获取');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 p-4 font-sans">
        <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl border border-slate-200 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-slate-800 mb-1">内部原型评审</h2>
          <p className="text-xs text-slate-500 mb-6">
            本系统仅供受邀方评审与体验，请输入访问口令
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="请输入访问口令"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium text-left">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white shadow transition hover:bg-blue-700 active:bg-blue-800"
            >
              进入体验
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
            仅包含 UI 交互流程，不涉及真实生产环境数据
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AccessGuard;
