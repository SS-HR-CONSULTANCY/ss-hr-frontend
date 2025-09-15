import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Role } from '@/types/entities/user';
import React, { useEffect, useState } from 'react';
import FormField from '@/components/form/FormFiled';
import { yupResolver } from '@hookform/resolvers/yup';
import FormHeader from '@/components/form/FormHeader';
import { otpSchema } from '../../utils/validationSchema';
import { resendOtp, verifyOtp } from '@/utils/apis/authApi';
import { formatTime } from '@/utils/helpers/timerFormatterForOtp';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { VerifyOtpRequest } from '@/types/apiTypes/authApiTypes';
import { clearError, stopTimer, updateTimer } from '../../store/slices/authSlice';
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';

const Otp: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, user, otpTimerIsRunning, otpRemainingTime } = useAppSelector((state) => state.auth);
    const [resentLoading, setResendLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<VerifyOtpRequest>({
        resolver: yupResolver(otpSchema),
        defaultValues: {
            otp: "",
            verificationToken: user?.verificationToken,
            role: user?.role as Role
        },
    });

    const watchedValues = watch();


    useEffect(() => {
        if (otpTimerIsRunning) {
            const interval = setInterval(() => {
                dispatch(updateTimer());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpTimerIsRunning, dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [dispatch, error]);

    const onSubmit = async (data: VerifyOtpRequest) => {
        await dispatch(verifyOtp(data)).unwrap()
            .then((res) => {
                if (res.success) {
                    toast.success(res.message || "Otp verified");
                    navigate('/login');
                    dispatch(stopTimer());
                } else {
                    toast.error(res.message || "Invalid otp");
                }
            })
            .catch((error) => {
                toast.error(error.message || "An error occurred during signup.");
            });
    };

    const handleResendOtp = (): void => {
        console.log("user : ",user);
        if (user?.verificationToken && user?.role) {
            const { verificationToken, role } = user;
            setResendLoading(true);
            dispatch(resendOtp({ verificationToken, role }))
                .unwrap()
                .then((res) => {
                    if (res.success) {
                        setResendLoading(false);
                        toast.success(res.message);
                    } else {
                        dispatch(stopTimer());
                        toast.error(res.message);
                    }
                })
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center">
            <BackgroundBeamsWithCollision>
                <Card className="w-full max-w-md border border-slate-700/50 shadow-xl z-20 mx-4 md:mx-0">
                    <FormHeader title='Verify OTP' description='We have sent an OTP to your email address' />
                    <CardContent>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            <FormField<VerifyOtpRequest>
                                id="otp"
                                label="Enter Otp"
                                type="text"
                                autoComplete="otp"
                                placeholder="Enter Otp"
                                error={errors.otp?.message}
                                register={register}
                            />

                            <input type="hidden" value={user?.verificationToken || ""} {...register("verificationToken")} />
                            <input type="hidden" value={user?.role || ""} {...register("role")} />

                            <Button type="submit"
                                className="w-full"
                                disabled={
                                    isLoading || !watchedValues.otp || !watchedValues.role || !watchedValues.verificationToken
                                }>
                                {isLoading && !resentLoading ? (
                                    <span className="flex items-center gap-2">
                                        <LoaderCircle className="animate-spin" />
                                        Verifying...
                                    </span>
                                ) : (
                                    "Verify"
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className='flex flex-col space-y-4 w-full'>
                        {resentLoading ?
                            <span className="font-semibold text-[var(--mainColor)] hover:text-[var(--mainColorHover)] cursor-pointer">Sending</span>
                            :
                            otpTimerIsRunning ?
                                <span className="text-center text-xs md:text-sm/6 text-[var(--textTwo)]">{formatTime(otpRemainingTime)}</span>
                                :
                                <span className="font-semibold text-[var(--mainColor)] hover:text-[var(--mainColorHover)] cursor-pointer" onClick={handleResendOtp}>Resend OTP</span>
                        }
                    </CardFooter>
                </Card>
            </BackgroundBeamsWithCollision>
        </div>
    );
};

export default Otp;