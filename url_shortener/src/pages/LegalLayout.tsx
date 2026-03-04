import {type ReactNode} from "react";
import {NavLink} from "react-router-dom";
import Layout from "../components/Layout";

interface LegalLayoutProps {
  title: string;
  children: ReactNode;
}

export default function LegalLayout({title, children}: LegalLayoutProps) {
  return (
    <Layout>
      <div className="bg-white border border-[#bb9457] rounded-3xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6">
        <aside className="border-r border-[#bb9457]/40 pr-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#99582a] mb-3">
            Legal
          </h2>
          <nav className="space-y-1 text-sm">
            <NavLink
              to="/app/terms"
              className={({isActive}) =>
                `block px-3 py-1.5 rounded-lg ${
                  isActive
                    ? "bg-[#6f1d1b] text-[#ffe6a7] font-semibold"
                    : "text-[#432818] hover:bg-[#ffe6a7]"
                }`
              }
            >
              Terms of Service
            </NavLink>
            <NavLink
              to="/app/privacy-policy"
              className={({isActive}) =>
                `block px-3 py-1.5 rounded-lg ${
                  isActive
                    ? "bg-[#6f1d1b] text-[#ffe6a7] font-semibold"
                    : "text-[#432818] hover:bg-[#ffe6a7]"
                }`
              }
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/app/cookies-policy"
              className={({isActive}) =>
                `block px-3 py-1.5 rounded-lg ${
                  isActive
                    ? "bg-[#6f1d1b] text-[#ffe6a7] font-semibold"
                    : "text-[#432818] hover:bg-[#ffe6a7]"
                }`
              }
            >
              Cookies Policy
            </NavLink>
          </nav>
        </aside>
        <section className="space-y-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#432818]">
            {title}
          </h1>
          <div className="prose prose-sm max-w-none text-[#432818]">
            {children}
          </div>
        </section>
      </div>
    </Layout>
  );
}

