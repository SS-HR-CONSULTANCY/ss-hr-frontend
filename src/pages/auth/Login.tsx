import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Roles } from '@/types/entities/user';
import FormField from '@/components/form/FormFiled';
import CustomLink from '@/components/form/CustomLink';
import { yupResolver } from '@hookform/resolvers/yup';
import FormHeader from '@/components/form/FormHeader';
import { clearError } from '../../store/slices/authSlice';
import GoogleButton from '@/components/form/GoogleButton';
import { loginSchema } from '../../utils/validationSchema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RememberMeWithFP from '@/components/form/RememberMeWithFP';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signin, type SigninRequest } from '@/utils/apis/authApi';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import { toast } from 'react-toastify';

const Login: React.FC = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

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
      role: "user" as Roles
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
      if (isAuthenticated && user) {
        if (user.role === 'user') {
          navigate('/user', { replace: true });
        } else if(user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else{
          navigate('/', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: SigninRequest) => {
    try {
      const res = await dispatch(signin(data)).unwrap();
      if(res.success) {
        toast.success(res.message || "Logged In Successfully");
        navigate('/user');
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed internal error.");
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

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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