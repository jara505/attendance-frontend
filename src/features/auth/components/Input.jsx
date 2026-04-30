//Este componente manejará el estilo visual de todos los campos de texto.
import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-300 ml-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full p-3 rounded-xl bg-white/5 border transition-all outline-none text-white
          placeholder:text-slate-500
          ${
            error
              ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:bg-red-500/5"
              : "border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10"
          }
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
};

export default Input;
