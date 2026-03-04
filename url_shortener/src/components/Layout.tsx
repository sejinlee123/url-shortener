import {type ReactNode} from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({children}: LayoutProps) {
  return (
    /* min-h-screen: Takes up full browser height
      flex: Enables flexbox
      items-center: Centers children vertically
      justify-center: Centers children horizontally
    */
    <div className="min-h-screen w-full flex items-center justify-center bg-[#ffe6a7] p-6">
      {/* max-w-xl: Keeps the content from getting too wide on desktop 
        w-full: Ensures it remains responsive on mobile
      */}
      <div className="w-full max-w-xl animate-in fade-in zoom-in duration-500">
        {children}
      </div>
    </div>
  );
}
