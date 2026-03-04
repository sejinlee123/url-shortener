import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Loader2} from "lucide-react";

export default function RedirectHandler() {
  const {code} = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL ?? "";
    if (!code || !API_BASE) {
      setError(true);
      return;
    }
    window.location.replace(`${API_BASE}/api/${code}`);
  }, [code]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">
          Link Expired or Invalid
        </h1>
        <p className="text-slate-500">
          We couldn't find the destination for this link.
        </p>
        <a href="/" className="mt-4 text-blue-600 underline">
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-slate-800">
        Redirecting you...
      </h2>
      <p className="text-slate-500">
        Hold tight, we're taking you to your destination.
      </p>
    </div>
  );
}
