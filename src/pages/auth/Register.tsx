import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { registerSchema } from '../../utils/validationSchema';
import Button from '../../components/common/buttons/Button';
import Input from '../../components/common/inputs/Input';
import type { RegisterFormData } from '../../utils/validationSchema';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  // Watch password for real-time validation feedback
  const password = watch('password');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    await dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="prata-regular text-3xl text-primary-600 mb-2">
              SS HR Consultancy
            </h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName')}
              />

              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="john.doe@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              error={errors.password?.message}
              helperText="Must contain at least 6 characters with uppercase, lowercase, and number"
              {...register('password')}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Password Strength:</p>
                <div className="space-y-1">
                  <div className={`text-xs ${password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                    ✓ At least 6 characters
                  </div>
                  <div className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    ✓ One uppercase letter
                  </div>
                  <div className={`text-xs ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    ✓ One lowercase letter
                  </div>
                  <div className={`text-xs ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                    ✓ One number
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-4"
              size="lg"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;