import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});
// export LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const {
    user,
    login: { mutate, isPending, isError },
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }) => {
    mutate({ email, password });
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="row justify-content-center align-content-center vh-100">
        <div className="col-5 mb-5">
          <h2 className="h3">Trail Race App Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                className={clsx("form-control", { "is-invalid": errors.email })}
                id="email"
                type="email"
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                className={clsx("form-control", {
                  "is-invalid": errors.password,
                })}
                id="password"
                type="password"
                disabled={isPending}
                {...register("password", {})}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
            {isError && (
              <div className="fs-7 text-danger mb-3">Invalid credentials.</div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
