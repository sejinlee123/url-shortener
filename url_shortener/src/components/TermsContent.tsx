import {Link} from "react-router-dom";

export default function TermsContent() {
  return (
    <>
      <p className="mb-4">
        Welcome to FreeUrlShortener. By using this service you agree to these
        terms. If you do not agree, please do not use the service.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        1. Description of service
      </h2>
      <p>
        FreeUrlShortener is a personal hobby project that lets you create short
        links from long URLs. The service is provided on an{" "}
        <strong>&quot;as is&quot;</strong> and{" "}
        <strong>&quot;as available&quot;</strong> basis. There are no uptime
        guarantees, and links or data may be removed or changed at any time
        without notice.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        2. Acceptable use
      </h2>
      <p>
        By creating or using a short URL, you agree not to shorten or
        distribute any content that is illegal, abusive, infringing, harmful,
        or that violates any applicable law or third‑party rights. You must not
        use the service for spam, phishing, malware distribution, or to
        circumvent security measures. Links that violate these guidelines may be
        removed without notice, and we reserve the right to block access from
        specific IPs or users.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        3. No warranties
      </h2>
      <p>
        This service is provided without warranties of any kind, whether
        express or implied, including but not limited to implied warranties of
        merchantability, fitness for a particular purpose, or non‑infringement.
        We do not guarantee that the service will be uninterrupted, error‑free,
        or secure. You use it at your own risk.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        4. Limitation of liability
      </h2>
      <p>
        To the fullest extent permitted by law, FreeUrlShortener and its
        operator shall not be liable for any direct, indirect, incidental,
        special, consequential, or punitive damages arising from your use or
        inability to use the service, or from any links you create or follow.
        This includes loss of data, business, or profits.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        5. Link expiry and data
      </h2>
      <p>
        Short links may expire after a period of inactivity (e.g. one week
        without use). We may delete or alter stored data at any time. Do not
        rely on this service for critical or permanent links.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        6. Changes to these terms
      </h2>
      <p>
        We may update these terms from time to time. Continued use of the
        service after changes constitutes acceptance of the updated terms. We
        encourage you to review this page periodically.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        7. Contact
      </h2>
      <p>
        For questions about these terms, please see the{" "}
        <Link to="/contact" className="text-[#6f1d1b] underline hover:text-[#432818]">
          Contact
        </Link>{" "}
        page.
      </p>
    </>
  );
}
