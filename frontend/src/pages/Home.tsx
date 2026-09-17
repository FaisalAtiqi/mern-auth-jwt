import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { useCurrentUser } from "@/providers/AuthProvider";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useCurrentUser();

  return (
    <main className="relative mx-auto min-h-screen max-w-5xl p-8">
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

      {!user && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/register">Create an account</Link>
          </Button>

          <Button asChild variant="secondary" size="lg">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      )}

      {user && (
        <div className="fixed bottom-4 left-4 z-50">
          <UserMenu user={user} />
        </div>
      )}

      <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-gray-200 pt-6 text-sm md:flex-row">
        <div className="space-x-3">
          <Link
            to="https://github.com/FaisalAtiqi/mern-auth-jwt"
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
