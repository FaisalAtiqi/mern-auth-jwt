import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { verifyEmail } from "@/lib/api";
import { getErrorMessage } from "@/lib/error-utils";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function VerifyEmail() {
  const { code } = useParams();
  const isValidCode = !!code && code.trim().length > 0;

  const { isPending, isSuccess, isError, error, fetchStatus } = useQuery({
    queryKey: QUERY_KEYS.verifyEmail(code!),
    enabled: isValidCode,
    queryFn: () => verifyEmail(code!),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  /**
   * When `enabled` is false, the query never runs.
   * TanStack Query keeps the status as "pending",
   * so we also check fetchStatus to determine whether
   * a request is actually in progress.
   */
  const isLoading = isPending && fetchStatus !== "idle";

  if (!isValidCode) {
    return (
      <div className="container mx-auto mt-20 max-w-md px-4">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Missing Code</AlertTitle>
          <AlertDescription>
            No verification code was found. Please check your email link.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 max-w-md px-4">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        {isLoading && <Spinner className="size-8" />}

        {(isError || isSuccess) && (
          <div className="w-full space-y-2">
            <Alert
              variant={isError ? "destructive" : "default"}
              className="text-left"
            >
              {isError ? <AlertCircleIcon /> : <CheckCircle2Icon />}
              <AlertTitle>
                {isError ? "Verification Failed" : "Success"}
              </AlertTitle>
              <AlertDescription>
                {isError
                  ? getErrorMessage(error)
                  : "Your email has been verified."}
              </AlertDescription>
            </Alert>

            {isError && (
              <p className="text-muted-foreground text-sm hover:underline">
                <Link to="/email/verify/request">
                  Request a new email verification link?
                </Link>
              </p>
            )}

            <Button asChild>
              <Link to="/">Continue</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
