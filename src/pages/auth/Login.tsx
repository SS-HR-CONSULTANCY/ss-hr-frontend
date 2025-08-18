import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormField from '@/components/form/FormFiled';
import CustomLink from '@/components/form/CustomLink';
import { yupResolver } from '@hookform/resolvers/yup';
import FormHeader from '@/components/form/FormHeader';
import GoogleButton from '@/components/form/GoogleButton';
import { loginSchema } from '../../utils/validationSchema';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RememberMeWithFP from '@/components/form/RememberMeWithFP';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const from = (location.state)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = () => {

  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <BackgroundBeamsWithCollision>
        <div className="w-full z-20">
          <Card className="w-full max-w-md mx-auto border border-slate-700/50 shadow-xl">
            <FormHeader title='Sign In' description='Enter your credentials to access your account' />
            <CardContent>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <FormField<LoginFormData>
                  id="email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  register={register}
                />

                <FormField<LoginFormData>
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
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default Login;