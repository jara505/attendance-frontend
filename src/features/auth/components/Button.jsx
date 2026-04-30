import React from "react";

const Button = ({
  children,
  onClick,
  loading,
  type = "button",
  variant = "primary",
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20",
    secondary:
      "bg-white/10 hover:bg-white/20 border border-white/10 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`
        w-full py-3 rounded-xl font-semibold transition-all shadow-lg 
        flex items-center justify-center gap-2 text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
