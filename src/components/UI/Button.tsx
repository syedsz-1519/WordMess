import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button = ({ variant = 'primary', fullWidth, children, className = '', ...props }: ButtonProps) => {
  const base = "py-2.5 px-5 rounded-2xl font-black uppercase tracking-wider transition-all duration-100 flex items-center justify-center gap-2 select-none";
  const variants = {
    primary: "bubble-button-green",
    secondary: "bubble-button",
    danger: "bubble-button-rose",
    outline: "border-2 border-slate-300 text-slate-700 hover:bg-slate-100/50 active:translate-y-[2px]"
  };
  
  const width = fullWidth ? "w-full" : "";

  return (
    <button className={`${base} ${variants[variant]} ${width} ${className}`} {...props}>
      {children}
    </button>
  );
};

