import { Alert, AlertTitle } from "@/components/ui/alert";
import { useCurrentUser } from "@/providers/AuthProvider";
import { AlertCircleIcon } from "lucide-react";

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
    <div className="mt-20 flex flex-col items-center justify-center space-y-3">
      <h1 className="text-3xl font-semibold">My Account</h1>
      {!isVerified && (
        <Alert variant="destructive" className="w-fit">
          <AlertCircleIcon />
          <AlertTitle>Please verify your email</AlertTitle>
        </Alert>
      )}

      <div className="space-y-2 text-center text-gray-200">
        <p>
          <span className="font-semibold">Email:</span> {email}
        </p>
        <p>
          <span className="font-semibold">Created on:</span> {formattedDate}
        </p>
      </div>
    </div>
  );
}

export default Profile;
