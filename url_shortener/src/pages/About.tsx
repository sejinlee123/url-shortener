import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="bg-white border border-[#bb9457] rounded-3xl shadow-2xl p-6 space-y-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#432818]">
          About FreeUrlShortener
        </h1>
        <p className="text-sm text-[#432818]">
          FreeUrlShortener is a small hobby project built for fun, learning and resume.
          It&apos;s designed to be a complicated way to create fast shareable short links.
        </p>
        <div className="space-y-2 text-sm text-[#432818]">
          <h2 className="font-bold text-[#6f1d1b]">Tech stack</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Frontend: React + TypeScript + Vite + Tailwind CSS</li>
            <li>Backend: Go (Gin), PostgreSQL, Redis</li>
            <li>Infrastructure: AWS Lambda, API Gateway, RDS, ElastiCache, S3, CloudFront, Terraform, Github Actions</li>
          </ul>
        </div>
        <p className="text-xs text-[#99582a]">
          Since this is a personal project, features and uptime may change
          without notice. Please don&apos;t rely on it for critical workloads.
        </p>
      </div>
    </Layout>
  );
}

