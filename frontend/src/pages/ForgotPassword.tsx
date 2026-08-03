import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/error-utils";
import { emailSchema } from "@shared/auth/auth.schema";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

function ForgotPassword() {
  const { mutate, isPending, isSuccess, data, isError, error } = useMutation({
    mutationFn: sendPasswordResetEmail,
    onSuccess: (response) => {
      if (import.meta.env.DEV && response.url) console.log(response.url);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: z.object({ email: emailSchema }),
    },
    onSubmit: async ({ value }) => {
      const { email } = value;
      mutate(email);
    },
  });
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center text-2xl">
          <CardTitle>Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="bg-destructive/15 text-destructive mb-4 rounded-md p-3 text-center text-sm">
              {getErrorMessage(error)}
            </div>
          )}

          {isSuccess ? (
            <Alert className="text-left">
              <CheckCircle2Icon />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                {data.message ||
                  "Email sent! Check your inbox for further instructions."}
              </AlertDescription>
            </Alert>
          ) : (
            <form
              id="reset-password-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email Address
                      </FieldLabel>
                      <Input
                        type="email"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="email"
                        autoFocus
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </form>
          )}
        </CardContent>

        <CardFooter>
          <Field orientation="responsive">
            {!isSuccess && (
              <Button
                type="submit"
                form="reset-password-form"
                disabled={isPending}
              >
                {isPending ? (
                  <div>
                    <Spinner />
                  </div>
                ) : (
                  "Send reset link "
                )}
              </Button>
            )}
            <p className="text-muted-foreground text-center text-sm">
              Go back to{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>{" "}
              or{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ForgotPassword;
