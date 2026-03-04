import {type ReactNode} from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#ffe6a7] p-6">
      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-500">
        {children}
      </div>
    </div>
  );
}
