import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ArrowLeft, Copy, BarChart3, Trash2, Check} from "lucide-react";
import Layout from "../components/Layout";
import {copyToClipboard} from "../utils/clipboard";

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const syncAndSet = (next: SavedLink[]) => {
    setLinks(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleDelete = (code: string, createdAt: string) => {
    const next = links.filter(
      (l) => !(l.code === code && l.createdAt === createdAt),
    );
    syncAndSet(next);
  };

  const handleCopy = (shortUrl: string) => {
    copyToClipboard(shortUrl).finally(() => {
      setCopiedKey(shortUrl);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setLinks(parsed.slice(0, 5));
      }
    } catch {
      // ignore
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
              Showing up to your last 5 shortened URLs.
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
              className="bg-[#ffe6a7] border border-[#bb9457] rounded-2xl p-4 shadow-sm space-y-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#99582a]">
                Shortened
              </p>
              <p className="text-sm font-mono font-semibold text-[#6f1d1b] break-all">
                {link.shortUrl}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(link.shortUrl)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6f1d1b] hover:text-[#432818] bg-white/80 hover:bg-white px-2.5 py-1.5 rounded-lg border border-[#bb9457] transition-colors"
                >
                  {copiedKey === link.shortUrl ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(link.code, link.createdAt)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6f1d1b] hover:text-[#432818] bg-white/80 hover:bg-white px-2.5 py-1.5 rounded-lg border border-[#bb9457] transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                <Link
                  to={`/stats/${link.code}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6f1d1b] hover:text-[#432818] bg-white/80 hover:bg-white px-2.5 py-1.5 rounded-lg border border-[#bb9457] transition-colors"
                >
                  <BarChart3 size={14} />
                  Stats
                </Link>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#99582a] mb-0.5">
                  Original
                </p>
                <p className="text-sm text-[#432818] break-all">
                  {link.longUrl}
                </p>
              </div>

              <span className="text-[10px] text-[#99582a] block">
                {new Date(link.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
