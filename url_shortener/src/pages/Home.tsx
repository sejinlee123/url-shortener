import {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {Link2, Sparkles, Copy, Check} from "lucide-react";
import Layout from "../components/Layout";
import {shortenUrl} from "../api/client";

const HISTORY_KEY = "url_shortener_history";

type SavedLink = {
  code: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
};

function extractCode(shortUrl: string): string {
  try {
    const url = new URL(shortUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? shortUrl;
  } catch {
    const parts = shortUrl.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? shortUrl;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  // Detect existing history (but keep landing page visible)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setHasHistory(true);
      }
    } catch {
      // ignore parse issues
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await shortenUrl(url);

      setShortUrl(data.short_url);

      // Update local history (keep latest 10)
      const newEntry: SavedLink = {
        code: extractCode(data.short_url),
        shortUrl: data.short_url,
        longUrl: url,
        createdAt: new Date().toISOString(),
      };

      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        const existing: SavedLink[] = raw ? JSON.parse(raw) : [];
        const updated = [newEntry, ...(Array.isArray(existing) ? existing : [])].slice(0, 10);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }

      setUrl("");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6f1d1b] rounded-2xl shadow-lg shadow-[#bb9457]/60 mb-6 text-[#ffe6a7]">
          <Link2 size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-[#432818] tracking-tight">
          Shorten Your Links
        </h1>
        <p className="text-[#99582a] mt-2 text-lg">
          Fast, reliable, and trackable URL shortening.
        </p>

        {hasHistory && (
          <div className="mt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-[#6f1d1b] hover:bg-[#432818] text-[#ffe6a7] transition-colors"
            >
              View your recent links
            </Link>
          </div>
        )}
      </div>

      {!shortUrl ? (
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#bb9457] to-[#6f1d1b] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col sm:flex-row gap-3 bg-[#ffe6a7] p-2 rounded-2xl border border-[#bb9457] shadow-xl">
            <input
              type="url"
              required
              placeholder="https://very-long-destination.com/path"
              className="flex-1 px-4 py-3 text-[#432818] placeholder-[#99582a]/70 bg-transparent focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              disabled={loading}
              className="bg-[#6f1d1b] hover:bg-[#432818] text-[#ffe6a7] font-semibold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                "..."
              ) : (
                <>
                  <Sparkles size={18} /> Shorten
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#ffe6a7] border border-[#bb9457] rounded-2xl p-8 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6f1d1b] rounded-full text-[#ffe6a7] mb-4">
            <Check size={24} />
          </div>
          <h2 className="text-2xl font-bold text-[#432818] mb-2">Success!</h2>
          <p className="text-[#99582a] mb-6">Your URL has been shortened</p>

          <div className="bg-white border border-[#bb9457] rounded-lg p-4 mb-4">
            <p className="text-sm text-[#99582a] mb-2">Short URL:</p>
            <p className="text-lg font-mono font-semibold text-[#6f1d1b] break-all">
              {shortUrl}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="bg-[#6f1d1b] hover:bg-[#432818] text-[#ffe6a7] font-semibold px-6 py-2 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto mb-4"
          >
            {copied ? (
              <>
                <Check size={18} /> Copied!
              </>
            ) : (
              <>
                <Copy size={18} /> Copy URL
              </>
            )}
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
            <button
              onClick={() => setShortUrl("")}
              className="text-[#6f1d1b] hover:text-[#432818] font-semibold"
            >
              Shorten Another URL
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#bb9457] hover:bg-[#99582a] text-[#432818] font-semibold px-4 py-2 rounded-lg transition-all text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
