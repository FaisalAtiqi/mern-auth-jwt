import { useCurrentUser } from "@/providers/AuthProvider";
import { Link } from "react-router-dom";

function Profile() {
  const { user } = useCurrentUser();
  if (!user) return null;

  const { email, createdAt, isVerified } = user;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-semibold">Account summary</h1>

      <div className="mt-4 grid grid-cols-[150px_1fr] gap-y-2">
        <span className="font-medium text-gray-500">Email:</span>
        <span>{email}</span>

        <span className="font-medium text-gray-500">Created on:</span>
        <span>{formattedDate}</span>

        <span className="font-medium text-gray-500">Email status:</span>
        <span className={`${!isVerified ? "text-red-600" : "text-green-600"}`}>
          {!isVerified ? "Not verified" : "Verified"}
          <br />
          <span>
            {!isVerified && (
              <Link
                to="/email/verify/request"
                className="text-sm text-blue-400 hover:underline"
              >
                Request verification email?
              </Link>
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Profile;
