import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { AlertCircleIcon, CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import { getErrorMessage } from "@/lib/error-utils";
import { resetPasswordSchema } from "@shared/auth/auth.schema";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Link } from "react-router-dom";

type Props = {
  code: string;
};

export function ResetPasswordForm({ code }: Props) {
  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: resetPassword,
  });

  const form = useForm({
    defaultValues: {
      verificationCode: code,
      newPassword: "",
      confirmNewPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  if (isError || isSuccess) {
    return (
      <div className="mt-20 flex flex-col items-center space-y-2 px-4">
        <Alert
          className="mb-4 w-fit text-left"
          variant={isError ? "destructive" : "default"}
        >
          {isError ? <AlertCircleIcon /> : <CheckCircle2Icon />}
          <AlertTitle>{isError ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>
            {" "}
            {isError
              ? getErrorMessage(error)
              : "Password updated successfully!"}
          </AlertDescription>
        </Alert>
        <Link
          to={isError ? "/password/forgot" : "/login"}
          className="text-muted-foreground text-center text-sm hover:underline"
        >
          {isError ? "Request a new password reset link?" : "Sign in"}
        </Link>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center text-2xl">
          <CardTitle>Change your password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="reset-password-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="newPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>New Password</FieldLabel>

                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="new-password"
                        />
                        <div
                          className="absolute top-0 right-0 flex h-full cursor-pointer items-center pr-3"
                          role="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPassword((prev) => !prev);
                          }}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <Eye className="text-muted-foreground h-4 w-4" />
                          )}
                        </div>
                      </div>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="confirmNewPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    form.getFieldMeta("newPassword")?.isTouched &&
                    field.state.meta.errors.length > 0;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Confirm New Password
                      </FieldLabel>

                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="new-password"
                        />
                        <div
                          className="absolute top-0 right-0 flex h-full cursor-pointer items-center pr-3"
                          role="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPassword((prev) => !prev);
                          }}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <Eye className="text-muted-foreground h-4 w-4" />
                          )}
                        </div>
                      </div>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="responsive">
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
                "Reset Password"
              )}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
