import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="mx-auto max-w-5xl border border-gray-200 px-8">
      <header className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl leading-tight font-extrabold md:text-4xl">
            MERN Auth with JWT
          </h1>
          <p className="mt-4">
            Welcome to my MERN + TypeScript journey! I built this project with{" "}
            <strong>MongoDB, Express, React, and Node.js</strong>, applying{" "}
            <strong>TypeScript</strong> end‑to‑end to strengthen type safety and
            scalability. The focus is on learning and implementing secure
            authentication using <strong>JWT</strong>.
          </p>
        </div>
      </header>

      <h2 className="mt-6 text-xl font-bold">✨ Features</h2>
      <ul className="mt-2 list-inside list-disc space-y-1">
        <li>User registration & login</li>
        <li>Email verification with secure links</li>
        <li>Password hashing for account safety</li>
        <li>Password reset if forgotten</li>
        <li>Manage active & previous sessions</li>
        <li>End sessions anytime for extra security</li>
      </ul>

      <p className="mt-4">
        This project is my hands-on journey into full‑stack development,
        authentication flows, and secure user management with the MERN stack.
      </p>

      <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-gray-200 pt-6 text-sm md:flex-row">
        <div className="space-x-3">
          <Link
            to=""
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            GitHub repository
          </Link>
        </div>
        <div>Built with Node, Express, React, MongoDB, and TypeScript.</div>
      </footer>
    </main>
  );
}

export default Home;
