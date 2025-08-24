import { toast } from 'react-toastify';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { LoaderCircle } from 'lucide-react';
import { signup } from '@/utils/apis/authApi';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import FormField from '@/components/form/FormFiled';
import CustomLink from '@/components/form/CustomLink';
import FormHeader from '@/components/form/FormHeader';
import { yupResolver } from '@hookform/resolvers/yup';
import GoogleButton from '@/components/form/GoogleButton';
import { clearError } from '../../store/slices/authSlice';
import { registerSchema } from '../../utils/validationSchema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PasswordStrength from '@/components/form/PasswordStrength';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import type { RegisterRequest } from '@/types/slice/authSliceTypes';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import LoginRegisterDarkThemeBg from '../../assets/pagesImages/LoginRegisterDarkThemeBg.jpg';
import LoginRegisterLightThemeBg from '../../assets/pagesImages/LoginRegisterLightThemeBg.png';


const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest>({
    resolver: yupResolver(registerSchema),
  });

  const watchedValues = watch();
  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const res = await dispatch(signup(data)).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Otp has been send to your email");
        navigate('/verifyOtp')
      } else {
        toast.error(res?.message || "Otp sending failed, please try again");
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

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;

    if (strength <= 25) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 50) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 75) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password || '');

  const handleGoogleLogin = () => {

  }

  const theme = useSelector((store: RootState) => store.app.theme);

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${theme === "light" ? LoginRegisterLightThemeBg : LoginRegisterDarkThemeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md border border-slate-700/50 shadow-xl mx-4 md:mx-0">
        <FormHeader title='Sign In' description='Enter your credentials to access your account' />
        <CardContent>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{typeof error === "string" ? error : "Something went wrong"}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <FormField<RegisterRequest>
              id="fullName"
              label="Full Name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              error={errors.fullName?.message}
              register={register}
            />

            <FormField<RegisterRequest>
              id="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              register={register}
            />

            <FormField<RegisterRequest>
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password"
              error={errors.password?.message}
              register={register}
              showTogglePassword
            />

            {password && (
              <PasswordStrength password={password} passwordStrength={passwordStrength} />
            )}

            <FormField<RegisterRequest>
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              register={register}
              showTogglePassword
            />

            <input type="hidden" value="user" {...register("role")} />

            <Button type="submit"
              className="w-full"
              disabled={isLoading || !watchedValues.fullName || !watchedValues.email || !watchedValues.password || !watchedValues.confirmPassword}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4 w-full'>
          <CustomLink href='/login' text='Sign in to existing account' />
          <GoogleButton onClick={handleGoogleLogin} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;