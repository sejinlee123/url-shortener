import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ArrowLeft, ExternalLink, BarChart3} from "lucide-react";
import Layout from "../components/Layout";

const HISTORY_KEY = "url_shortener_history";

type SavedLink = {
  code: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
};

export default function Dashboard() {
  const [links, setLinks] = useState<SavedLink[]>([]);
  const navigate = useNavigate();

  const syncAndSet = (next: SavedLink[]) => {
    setLinks(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  const handleDelete = (code: string, createdAt: string) => {
    const next = links.filter(
      (l) => !(l.code === code && l.createdAt === createdAt),
    );
    syncAndSet(next);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setLinks(parsed.slice(0, 10));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  if (links.length === 0) {
    return (
      <Layout>
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-extrabold text-[#432818] tracking-tight">
            No links yet
          </h1>
          <p className="text-[#99582a]">
            Start by creating your first shortened URL.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#6f1d1b] hover:bg-[#432818] text-[#ffe6a7] font-semibold px-6 py-3 rounded-xl transition-all inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Shortener
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white border border-[#bb9457] rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#432818] tracking-tight">
              Your recent links
            </h1>
            <p className="text-sm text-[#99582a] mt-1">
              Showing up to your last 10 shortened URLs.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-[#6f1d1b] hover:bg-[#432818] text-[#ffe6a7] font-semibold px-4 py-2 rounded-xl transition-all text-sm"
          >
            New shortened URL
          </button>
        </div>

        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.code + link.createdAt}
              className="bg-[#ffe6a7] border border-[#bb9457] rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#99582a] mb-1">
                    Short URL
                  </p>
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    className="text-sm font-mono font-semibold text-[#6f1d1b] break-all flex items-center hover:text-[#432818] transition-colors"
                  >
                    {link.shortUrl}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                  <p className="text-xs text-[#99582a] mt-2 break-all">
                    Destination: {link.longUrl}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Link
                    to={`/stats/${link.code}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#6f1d1b] hover:text-[#432818] transition-colors"
                  >
                    <BarChart3 size={14} />
                    View stats
                  </Link>
                  <button
                    onClick={() => handleDelete(link.code, link.createdAt)}
                    className="text-[11px] font-semibold text-[#6f1d1b] hover:text-[#432818] underline"
                  >
                    Delete
                  </button>
                  <span className="text-[10px] text-[#99582a]">
                    {new Date(link.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

