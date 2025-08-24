import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import type { Role } from '@/types/entities/user';
import { useAppDispatch } from '../../hooks/redux';
import FormField from '@/components/form/FormFiled';
import CustomLink from '@/components/form/CustomLink';
import { yupResolver } from '@hookform/resolvers/yup';
import FormHeader from '@/components/form/FormHeader';
import GoogleButton from '@/components/form/GoogleButton';
import { loginSchema } from '../../utils/validationSchema';
import RememberMeWithFP from '@/components/form/RememberMeWithFP';
import { signin, type SigninRequest } from '@/utils/apis/authApi';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';

interface Login {
  role: string
}
const Login: React.FC<Login> = ({
  role
}) => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SigninRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: role as Role
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'user') {
        navigate('/user', { replace: true });
      } else if (user.role === 'admin' || user.role === "superAdmin") {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: SigninRequest) => {
    try {
      const res = await dispatch(signin(data)).unwrap();
      console.log("role : ", role);
      console.log("user : ", user);
      console.log("user?.role : ", user?.role);
      if (res?.success) {
        toast.success(res?.message || "Logged In Successfully");
        if (role === "user" && res.user?.role === "user") {
          navigate("/user");
        } else if (
          (role === "admin" || role === "superAdmin") &&
          (res.user?.role === "admin" || res.user?.role === "superAdmin")
        ) {
          navigate("/admin");
        } else {
          toast.error("Something went wrong, please try again");
        }
      } else {
        toast.error(res?.message || "Login failed");
      }
    } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login failed:", error.message);
      toast.error(error.message || "Login failed.");
    } else {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error occurred.");
    }
  }
};

  const handleGoogleLogin = () => {

  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <BackgroundBeamsWithCollision>
        <Card className="w-full max-w-md border border-slate-700/50 shadow-xl z-20 mx-4 md:mx-0">
          <FormHeader title='Sign In' description='Enter your credentials to access your account' />
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

              <Button type="submit"
                className="w-full"
                disabled={
                  isLoading || !watchedValues.email || !watchedValues.password
                }>
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
          </CardContent>

          <CardFooter className='flex flex-col space-y-4 w-full'>
            <CustomLink href='/register' text='Create your account' />
            <GoogleButton onClick={handleGoogleLogin} />
          </CardFooter>
        </Card>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default Login;