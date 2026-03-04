import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Loader2} from "lucide-react";
import {buildRedirectUrl} from "../api/client";

export default function RedirectHandler() {
  const {code} = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code) {
      setError(true);
      return;
    }

    Promise.resolve(buildRedirectUrl(code))
      .then((url) => {
        if (!url) {
          setError(true);
        } else {
          window.location.replace(url);
        }
      })
      .catch(() => setError(true));
  }, [code]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffe6a7]">
        <h1 className="text-2xl font-bold text-[#6f1d1b]">
          Link Expired or Invalid
        </h1>
        <p className="text-[#99582a]">
          We couldn't find the destination for this link.
        </p>
        <a
          href="/"
          className="mt-4 text-[#6f1d1b] underline hover:text-[#432818]"
        >
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffe6a7]">
      <Loader2 className="w-12 h-12 text-[#6f1d1b] animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-[#432818]">
        Redirecting you...
      </h2>
      <p className="text-[#99582a]">
        Hold tight, we're taking you to your destination.
      </p>
    </div>
  );
}
