import React from "react";

type FormWrapperProps = {
  children: React.ReactNode;
};

export default function FormWrapper({ children }: FormWrapperProps) {
  return (
    <div className="relative z-10 max-w-md w-full border border-white/20 p-8 rounded shadow bg-transparent">
      {children}
    </div>
  );
}
