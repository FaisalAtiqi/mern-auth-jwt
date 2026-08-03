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
import { login } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { getErrorMessage } from "@/lib/error-utils";
import { loginSchema } from "@shared/auth/auth.schema";
import { useLocationState } from "@/hooks/useLocationState";

import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";

function Login() {
  const isDev = import.meta.env.DEV;
  const navigate = useNavigate();
  const { from } = useLocationState(); // Get the SAVED path
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: login,
    retry: false,
    onSuccess: async (response, variables) => {
      // 'response' is what the server returns.
      // 'variables' is what you sent to the server.

      await queryClient.refetchQueries({
        queryKey: QUERY_KEYS.user,
      });

      if (isDev && response) console.log(response);

      toast.success("Welcome back!", {
        description: `Logged in as ${variables.email}`,
      });

      navigate(from, { replace: true }); // Go back to that saved path
    },
  });

  const form = useForm({
    defaultValues: {
      email: isDev ? "test@test.com" : "",
      password: isDev ? "test@test.com" : "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        userAgent: navigator.userAgent,
      };
      mutate(payload);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center text-2xl">
          <CardTitle>Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="bg-destructive/15 text-destructive mb-4 rounded-md p-3 text-center text-sm">
              {getErrorMessage(error)}
            </div>
          )}
          <form
            id="login-form"
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
                    field.state.meta.isTouched && !field.state.meta.isValid;
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
                          autoComplete="current-password"
                        />
                        <div
                          className="absolute top-0 right-0 flex h-full cursor-pointer items-center pr-3"
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

                      <div className="sm:rig flex justify-end">
                        <Link
                          to="/password/forgot"
                          className="text-muted-foreground hover:text-foreground text-sm"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="responsive">
            <Button type="submit" form="login-form" disabled={isPending}>
              {isPending ? (
                <div>
                  <Spinner />
                </div>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-muted-foreground text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                state={{ from }}
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
