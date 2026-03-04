import {Link} from "react-router-dom";

export default function CookiesPolicyContent() {
  return (
    <>
      <p className="mb-4">
        This Cookies Policy explains how FreeUrlShortener uses cookies and
        similar technologies. We keep usage minimal and do not use cookies for
        advertising or cross‑site tracking.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        1. Local storage (your device)
      </h2>
      <p>
        FreeUrlShortener uses your browser&apos;s <strong>local storage</strong> to
        keep a small history of your recently created short links and your
        consent preferences (e.g. that you accepted the Terms, Privacy Policy,
        and this Cookies Policy before creating a link). This data stays on your
        device and is not sent to our servers or shared with third parties. You
        can clear it at any time via your browser settings.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        2. Cookies we may use
      </h2>
      <p>
        The site may set minimal, essential cookies or similar identifiers used
        by the hosting platform, reverse proxies, or security mechanisms (e.g.
        load balancers, anti‑abuse tools). These are typically necessary for
        the service to function correctly and for security and session handling.
        They are not used for advertising, profiling, or cross‑site tracking.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        3. Third‑party cookies
      </h2>
      <p>
        We do not intentionally embed third‑party advertising or tracking
        scripts. If we link to external sites (e.g. GitHub, email), those sites
        have their own cookie and privacy policies.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        4. Your choices
      </h2>
      <p>
        You can disable or delete cookies via your browser settings. Note that
        disabling essential cookies may affect how the site or redirects work.
        By using the service and accepting the legal notices when creating a
        link, you consent to the limited use of local storage and essential
        cookies as described here.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        5. Changes to this policy
      </h2>
      <p>
        We may update this Cookies Policy from time to time. The current version
        will be available on this page. Continued use of the service after
        changes constitutes acceptance of the updated policy.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        6. Contact
      </h2>
      <p>
        For questions about cookies or local storage, please see the{" "}
        <Link to="/contact" className="text-[#6f1d1b] underline hover:text-[#432818]">
          Contact
        </Link>{" "}
        page.
      </p>
    </>
  );
}
