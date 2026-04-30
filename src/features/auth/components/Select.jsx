import React from "react";

const Select = ({ label, options, value, onChange, error }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-slate-300 text-sm font-medium ml-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`
          bg-slate-900/50 border rounded-xl px-4 py-3 text-white outline-none transition-all
          focus:ring-2 focus:ring-blue-500/50 
          ${error ? "border-red-500" : "border-slate-700 hover:border-slate-600"}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs ml-1">{error}</span>}
    </div>
  );
};

export default Select;
