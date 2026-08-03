import { Link, useSearchParams } from "react-router-dom";
import { verificationCodeSchema } from "@shared/auth/auth.schema";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { getErrorMessage } from "@/lib/error-utils";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const codeFromURL = searchParams.get("code");
  const { error, data: verificationCode } =
    verificationCodeSchema.safeParse(codeFromURL);

  return error ? (
    <div className="mt-20 flex flex-col items-center space-y-2 px-4">
      <Alert variant="destructive" className="w-fit text-left">
        <AlertCircleIcon />
        <AlertTitle>Invalid Link</AlertTitle>
        <AlertDescription>
          {getErrorMessage(error) || "The link is either invalid or expired."}
        </AlertDescription>
      </Alert>

      <Link
        to="/password/forgot"
        className="text-muted-foreground text-sm hover:underline"
      >
        Request a new password reset link?
      </Link>
    </div>
  ) : (
    <ResetPasswordForm code={verificationCode} />
  );
}

export default ResetPassword;
