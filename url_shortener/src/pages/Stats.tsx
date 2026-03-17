import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {Copy, Check, BarChart3, ArrowLeft, ExternalLink} from "lucide-react";
import Layout from "../components/Layout";
import {fetchStats, type StatsResponse} from "../api/client";
import {copyToClipboard} from "../utils/clipboard";

export default function Stats() {
  const {code} = useParams();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shortUrl = `${window.location.origin}/r/${code}`;

  useEffect(() => {
    if (!code) return;

    setStatus("loading");
    setErrorMessage(null);

    fetchStats(code)
      .then((data) => {
        setStats(data);
        setStatus("success");
      })
      .catch((err) => {
        console.error(err);
        setStats(null);
        setStatus("error");
        const message =
          err instanceof Error ? err.message : "Failed to load stats";
        setErrorMessage(message);
      });
  }, [code]);

  const handleCopy = () => {
    copyToClipboard(shortUrl).finally(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (status === "loading" || status === "idle") {
    return (
      <Layout>
        <div className="text-center animate-pulse text-[#99582a]">
          Loading metrics...
        </div>
      </Layout>
    );
  }

  if (status === "error" || !stats) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-extrabold text-[#432818]">
            Unable to load stats
          </h1>
          <p className="text-sm text-[#99582a]">
            {errorMessage ??
              "The stats for this link are not available. It may have expired or never existed."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/"
              className="bg-[#6f1d1b] hover:bg-[#432818] text-[#ffe6a7] font-semibold px-4 py-2 rounded-xl transition-all text-sm"
            >
              Go Home
            </Link>
            <Link
              to="/dashboard"
              className="text-[#6f1d1b] hover:text-[#432818] font-semibold text-sm"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link
        to="/dashboard"
        className="inline-flex items-center text-sm font-medium text-[#99582a] hover:text-[#6f1d1b] transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Dashboard
      </Link>

      <div className="bg-white rounded-3xl border border-[#bb9457] shadow-2xl overflow-hidden">
        <div className="bg-[#432818] p-8 text-[#ffe6a7]">
          <label className="text-xs font-bold uppercase tracking-widest text-[#ffe6a7]/80">
            Your shortened link
          </label>
          <div className="flex items-center justify-between mt-2 gap-4">
            <h2 className="text-2xl font-mono font-bold truncate text-[#ffe6a7]">
              {shortUrl}
            </h2>
            <button
              onClick={handleCopy}
              className={`p-3 rounded-xl transition-all ${
                copied ? "bg-[#bb9457]" : "bg-[#6f1d1b] hover:bg-[#432818]"
              }`}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-[#ffe6a7] rounded-2xl border border-[#bb9457]">
            <div className="flex items-center text-[#6f1d1b] mb-2">
              <BarChart3 size={20} className="mr-2" />
              <span className="text-sm font-bold uppercase">Total Clicks</span>
            </div>
            <p className="text-5xl font-black text-[#432818]">
              {stats.visit_count}
            </p>
          </div>

          <div className="p-6 bg-[#ffe6a7] rounded-2xl border border-[#bb9457] flex flex-col justify-center">
            <span className="text-xs font-bold uppercase mb-1 text-[#99582a]">
              Destination
            </span>
            <a
              href={stats.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#432818] font-semibold break-all flex items-center hover:text-[#6f1d1b] transition-colors"
            >
              Link <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
