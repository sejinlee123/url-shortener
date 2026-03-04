import {type ReactNode} from "react";
import {Link, NavLink} from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const navLinkBase =
  "text-sm font-semibold px-3 py-1.5 rounded-full transition-colors";

export default function Layout({children}: LayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#ffe6a7]">
      <header className="border-b border-[#bb9457]/40 bg-[#ffe6a7]/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/url-shortener-icon.jpg"
              alt="FreeUrlShortener"
              className="h-8 w-8 rounded-lg object-cover shadow-sm"
            />
            <span className="text-lg font-extrabold tracking-tight text-[#432818]">
              FreeUrlShortener
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-[#432818]">
            <NavLink
              to="/"
              className={({isActive}) =>
                `${navLinkBase} ${
                  isActive
                    ? "bg-[#6f1d1b] text-[#ffe6a7]"
                    : "hover:bg-[#bb9457]/30"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({isActive}) =>
                `${navLinkBase} ${
                  isActive
                    ? "bg-[#6f1d1b] text-[#ffe6a7]"
                    : "hover:bg-[#bb9457]/30"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/app/terms"
              className={({isActive}) =>
                `${navLinkBase} ${
                  isActive
                    ? "bg-[#6f1d1b] text-[#ffe6a7]"
                    : "hover:bg-[#bb9457]/30"
                }`
              }
            >
              Legal
            </NavLink>
            <NavLink
              to="/about"
              className={({isActive}) =>
                `${navLinkBase} ${
                  isActive
                    ? "bg-[#6f1d1b] text-[#ffe6a7]"
                    : "hover:bg-[#bb9457]/30"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({isActive}) =>
                `${navLinkBase} ${
                  isActive
                    ? "bg-[#6f1d1b] text-[#ffe6a7]"
                    : "hover:bg-[#bb9457]/30"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-500">
          {children}
        </div>
      </main>

      <footer className="border-t border-[#bb9457]/40 bg-[#ffe6a7]/90">
        <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#99582a]">
          <span>© {new Date().getFullYear()} FreeUrlShortener</span>
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="hover:text-[#6f1d1b] font-semibold transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/app/terms"
              className="hover:text-[#6f1d1b] font-semibold transition-colors"
            >
              Legal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

