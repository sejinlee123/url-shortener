import Layout from "../components/Layout";

export default function Contact() {
  return (
    <Layout>
      <div className="bg-white border border-[#bb9457] rounded-3xl shadow-2xl p-6 space-y-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#432818]">
          Contact
        </h1>
        <p className="text-sm text-[#432818]">
          This is a hobby project, but if you&apos;d like to reach out with
          feedback, ideas, questions concerns or issues, you can use the links below.
        </p>
        <ul className="space-y-2 text-sm text-[#432818]">
          <li>
            Email:{" "}
            <a
              href="mailto:lshredder45@gmail.com"
              className="text-[#6f1d1b] hover:text-[#432818] underline"
            >
              lshredder45@gmail.com
            </a>
          </li>
        </ul>
        <p className="text-xs text-[#99582a]">
          I like turtles.
        </p>
      </div>
    </Layout>
  );
}

