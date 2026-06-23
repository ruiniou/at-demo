import React from "react";

function shouldNoWrap(text: any): boolean {
  if (typeof text !== "string") return false;
  const trimmed = text.trim();
  if (/^\d+(\.\d+)?%?$/.test(trimmed)) return true;
  if (/\d{1,2}[-\/]\w+[-\/]\d{2,4}/.test(trimmed) || /\d{4}[-\/]\d{2}[-\/]\d{2}/.test(trimmed)) return true;
  if (/[✓✗]/.test(trimmed) || /^(Failed|Pending|Complete|In Progress)$/i.test(trimmed)) return true;
  if (/^[A-Z0-9_-]+-\d+$/.test(trimmed) || trimmed.startsWith("/") || /^(proc|sql|quit|run|select|create|table)\b/i.test(trimmed)) return true;
  return false;
}

export default function MarkdownTable() {
  const data = [
    { param: "Age, mean (SD)", value: "62.3 ± 8.5 years", id: "AZ-98712", status: "✓ Complete" },
    { param: "Baseline BMI (kg/m²), median (range)", value: "26.4 (18.2, 42.1)", id: "AZ-98713", status: "✓ Complete" },
    { param: "Prior therapy line >= 3, n (%)", value: "245 (100%)", id: "AZ-98714", status: "✓ Complete" },
    { param: "Median Overall Survival (OS) at 12 months follow-up", value: "18.2 months", id: "ITT-001", status: "Pending" }
  ];

  return (
    <div className="overflow-x-auto mb-[10px] border-[0.6px] border-[#D8DADA] rounded-[4px]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-[0.5px] border-[#D8DADA] bg-[#F8F7F7]">
            <th className="text-left t-table font-semibold py-[8px] px-[12px] whitespace-nowrap">Parameter Detail with Long Header Name</th>
            <th className="text-left t-table font-semibold py-[8px] px-[12px] whitespace-nowrap">Value</th>
            <th className="text-left t-table font-semibold py-[8px] px-[12px] whitespace-nowrap">ID</th>
            <th className="text-left t-table font-semibold py-[8px] px-[12px] whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b-[0.5px] border-[#D8DADA] last:border-0">
              <td className={`t-table py-[8px] px-[12px] ${shouldNoWrap(row.param) ? 'whitespace-nowrap' : 'whitespace-normal'}`}>{row.param}</td>
              <td className={`t-table py-[8px] px-[12px] ${shouldNoWrap(row.value) ? 'whitespace-nowrap' : 'whitespace-normal'}`}>{row.value}</td>
              <td className={`t-table py-[8px] px-[12px] ${shouldNoWrap(row.id) ? 'whitespace-nowrap' : 'whitespace-normal'}`}>{row.id}</td>
              <td className={`t-table py-[8px] px-[12px] ${shouldNoWrap(row.status) ? 'whitespace-nowrap' : 'whitespace-normal'}`}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
