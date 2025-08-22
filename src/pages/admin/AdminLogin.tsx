import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FormField from '@/components/form/FormFiled';
import { yupResolver } from '@hookform/resolvers/yup';
import FormHeader from '@/components/form/FormHeader';
import GoogleButton from '@/components/form/GoogleButton';
import { loginSchema } from '../../utils/validationSchema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RememberMeWithFP from '@/components/form/RememberMeWithFP';
import type { LoginFormData } from '../../utils/validationSchema';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';

const AdminLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

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
  console.log("isAuthenticated : ",isAuthenticated);
  console.log("user : ",user);
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if(user.role === "user") {
      navigate('/user', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }
}, [isAuthenticated, user, navigate]);


  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (error) {
      console.error('Admin login error:', error);
    }
  };

  const handleGoogleLogin = () => {

  }



  return (
    <div className="min-h-screen flex items-center justify-center">
      <BackgroundBeamsWithCollision>
        <Card className="w-full max-w-md border border-slate-700/50 shadow-xl z-20 mx-4 md:mx-auto">
          <FormHeader title='Admin Sign In' description='Enter your credentials to access your account' />
          <CardContent>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                disabled={isLoading || !watchedValues.email || !watchedValues.password}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  'Access Admin Portal'
                )}
              </Button>
            </form>

          </CardContent>
          <CardFooter className='flex flex-col space-y-4 w-full'>
            <GoogleButton onClick={handleGoogleLogin} />
          </CardFooter>
        </Card>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default AdminLogin;