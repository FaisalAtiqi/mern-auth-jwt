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
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getErrorMessage } from "@/lib/error-utils";
import { registerSchema } from "@shared/auth/auth.schema";
import { useLocationState } from "@/hooks/useLocationState";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";

function Register() {
  const isDev = import.meta.env.DEV;
  const { from } = useLocationState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      queryClient.setQueryData(QUERY_KEYS.user, response.user);

      if (isDev && response.url) console.log(response.url);

      toast.success("Account created", {
        description:
          "Verification email sent. Click the link to activate your account.",
        duration: 8000,
      });

      navigate(from, {
        replace: true,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      email: isDev ? "test@test.com" : "",
      password: isDev ? "test@test.com" : "",
      confirmPassword: isDev ? "test@test.com" : "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center text-2xl">
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="bg-destructive/15 text-destructive mb-4 rounded-md p-3 text-center text-sm">
              {getErrorMessage(error)}
            </div>
          )}
          <form
            id="register-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
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

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
                name="confirmPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    form.getFieldMeta("password")?.isTouched &&
                    field.state.meta.errors.length > 0;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Confirm Password
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
            <Button type="submit" form="register-form" disabled={isPending}>
              {isPending ? (
                <div>
                  <Spinner />
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ from }}
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Register;
