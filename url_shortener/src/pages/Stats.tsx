import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {Copy, Check, BarChart3, ArrowLeft, ExternalLink} from "lucide-react";
import Layout from "../components/Layout";

export default function Stats() {
  const {code} = useParams();
  const [stats, setStats] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const shortUrl = `${window.location.origin}/r/${code}`;

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL ?? "";
    if (!apiBase) return;
    fetch(`${apiBase}/api/stats/${code}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Not found"))))
      .then(setStats)
      .catch(console.error);
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!stats)
    return (
      <Layout>
        <div className="text-center animate-pulse text-[#99582a]">
          Loading metrics...
        </div>
      </Layout>
    );

  return (
    <Layout>
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-[#99582a] hover:text-[#6f1d1b] transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> New Link
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
