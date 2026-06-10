import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button = ({ variant = 'primary', fullWidth, children, className = '', ...props }: ButtonProps) => {
  const base = "py-3 px-4 rounded font-bold uppercase tracking-wider transition-opacity";
  const variants = {
    primary: "bg-[var(--wm-correct)] text-[var(--wm-bg)] hover:opacity-90",
    secondary: "bg-[var(--wm-border)] text-white hover:opacity-90",
    outline: "border border-[var(--wm-border)] text-white hover:bg-[var(--wm-border)]"
  };
  
  const width = fullWidth ? "w-full" : "";

  return (
    <button className={`${base} ${variants[variant]} ${width} ${className}`} {...props}>
      {children}
    </button>
  );
};
