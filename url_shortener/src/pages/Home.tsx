import {useState} from "react";
import {Link2, Sparkles, Copy, Check} from "lucide-react";
import Layout from "../components/Layout";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({long_url: url}),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (!data.short_url) {
        throw new Error("No short_url in response");
      }

      setShortUrl(data.short_url);
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-6 text-white">
          <Link2 size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Shorten Your Links
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Fast, reliable, and trackable URL shortening.
        </p>
      </div>

      {!shortUrl ? (
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xl">
            <input
              type="url"
              required
              placeholder="https://very-long-destination.com/path"
              className="flex-1 px-4 py-3 text-slate-700 bg-transparent focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
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
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full text-white mb-4">
            <Check size={24} />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Success!</h2>
          <p className="text-green-700 mb-6">Your URL has been shortened</p>

          <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-600 mb-2">Short URL:</p>
            <p className="text-lg font-mono font-semibold text-blue-600 break-all">
              {shortUrl}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all flex items-center justify-center gap-2 mx-auto mb-4"
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

          <button
            onClick={() => setShortUrl("")}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Shorten Another URL
          </button>
        </div>
      )}
    </Layout>
  );
}
