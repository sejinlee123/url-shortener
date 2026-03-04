import {Link} from "react-router-dom";

export default function PrivacyPolicyContent() {
  return (
    <>
      <p className="mb-4">
        This Privacy Policy describes how FreeUrlShortener handles information
        when you use the service. We do not sell your data. This is a hobby
        project and we keep things minimal.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        1. Information we collect and why
      </h2>
      <p>
        <strong>URLs and short codes.</strong> When you create a short link, we
        store the original URL and a generated short code, plus a visit count
        so you can view basic stats. This data is stored in our database and
        is necessary to provide the shortening and redirect service.
      </p>
      <p className="mt-2">
        <strong>Server logs.</strong> Our servers and hosting provider may
        log standard technical information such as IP addresses, user agents,
        request paths, and timestamps. This is used for debugging, abuse
        prevention, and operational security. We do not use these logs for
        advertising or cross‑site tracking.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        2. No accounts or authentication
      </h2>
      <p>
        This project does not require accounts or authentication. We do not
        collect names, email addresses, or passwords. Any history of links you
        have created is stored only in your browser (local storage), not on our
        servers, and is under your control.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        3. Third parties and advertising
      </h2>
      <p>
        We do not embed advertising, analytics, or third‑party tracking scripts
        by design. Our infrastructure is hosted on AWS; their processing of
        traffic is subject to their own privacy and compliance policies. We do
        not sell or share your data with advertisers or data brokers.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        4. Data retention and deletion
      </h2>
      <p>
        Short links and associated data may be automatically removed after a
        period of inactivity (e.g. one week without visits). We may also delete
        or alter data for operational, legal, or abuse‑prevention reasons. We
        do not guarantee indefinite retention of any data.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        5. Sensitive information
      </h2>
      <p>
        Do not use this service for sensitive or confidential information. Treat the service as
        non‑confidential and use it at your own risk.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        6. Changes to this policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. The current
        version will always be available on this page. Continued use of the
        service after changes constitutes acceptance of the updated policy.
      </p>

      <h2 className="text-lg font-bold text-[#432818] mt-6 mb-2">
        7. Contact
      </h2>
      <p>
        For privacy‑related questions, please see the{" "}
        <Link to="/contact" className="text-[#6f1d1b] underline hover:text-[#432818]">
          Contact
        </Link>{" "}
        page.
      </p>
    </>
  );
}
