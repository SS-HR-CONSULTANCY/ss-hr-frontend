import { toast } from "react-toastify";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "../../hooks/redux";
import FormField from "@/components/form/FormFiled";
import CustomLink from "@/components/form/CustomLink";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHeader from "@/components/form/FormHeader";
import { loginSchema } from "../../utils/validationSchema";
import { HomeIcon, LoaderCircle, UserPlus } from "lucide-react";
import RememberMeWithFP from "@/components/form/RememberMeWithFP";
import { signin, type SigninRequest } from "@/utils/apis/authApi";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const Login: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SigninRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user"
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'user') {
        navigate('/', { replace: true });
      } else if (user.role === 'admin' || user.role === 'superAdmin' || user.role === "systemAdmin") {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: SigninRequest) => {
    await dispatch(signin(data))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "Logged In Successfully");
        } else {
          toast.error(res?.message || "Login failed");
        }
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred during login.");
      });
  };

  const handleGoogleLogin = () => {
    try {
      const apiUrl = import.meta.env.VITE_ENVIRONMENT === "development"
        ? import.meta.env.VITE_APP_API_BASE_URL
        : import.meta.env.VITE_BACKEND_PRODUCTION_URL;
      window.location.href = `${apiUrl}/auth/google`;
    } catch (error) {
      toast.error("Failed to initiate Google login");
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <BackgroundBeamsWithCollision>
        <Card className="w-full max-w-md border border-slate-700/50 shadow-xl z-20 mx-4 md:mx-0">
          <FormHeader
            title="Sign In With your credentials"
            description="Enter your credentials to access your account"
          />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField<SigninRequest>
                id="email"
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                register={register}
              />

              <FormField<SigninRequest>
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                error={errors.password?.message}
                register={register}
                showTogglePassword
              />

              <RememberMeWithFP />

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading || !watchedValues.email || !watchedValues.password
                }
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 border-slate-500 hover:bg-slate-600 hover:text-white"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EB4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 w-full">
            <CustomLink
              href="/register"
              text="Create your account"
              icon={UserPlus}
            />
            <CustomLink href="/" text="Back to home" icon={HomeIcon} />
          </CardFooter>
        </Card>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default Login;
