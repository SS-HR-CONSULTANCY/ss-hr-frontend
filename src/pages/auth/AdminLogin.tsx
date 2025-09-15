import { toast } from "react-toastify";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { signin } from "@/utils/apis/authApi";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "../../hooks/redux";
import FormField from "@/components/form/FormFiled";
import CustomLink from "@/components/form/CustomLink";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHeader from "@/components/form/FormHeader";
import { HomeIcon, LoaderCircle } from "lucide-react";
import { loginSchema } from "../../utils/validationSchema";
import RememberMeWithFP from "@/components/form/RememberMeWithFP";
import type { SigninRequest } from "@/types/apiTypes/authApiTypes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const AdminLogin: React.FC = () => {

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
        },
    });

    const watchedValues = watch();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin' || user.role === 'superAdmin' || user.role === "systemAdmin") {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const onSubmit = async (data: SigninRequest) => {
        console.log("submitting")
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

    return (
        <div className="min-h-screen flex items-center justify-center">
            <BackgroundBeamsWithCollision>
                <Card className="w-full max-w-md border border-slate-700/50 shadow-xl z-20 mx-4 md:mx-0">
                    <FormHeader
                        title="Admin Sign In"
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

                            <FormField<SigninRequest>
                                id="role"
                                label="Role"
                                type="select"
                                register={register}
                                error={errors.role?.message}
                            >
                                <option value="admin" className='text-black'>Admin</option>
                                <option value="superAdmin" className='text-black'>Super Admin</option>
                                <option value="systemAdmin" className='text-black'>System Admin</option>
                            </FormField>

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

                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 w-full">
                        <CustomLink href="/" text="Back to home" icon={HomeIcon} />
                    </CardFooter>
                </Card>
            </BackgroundBeamsWithCollision>
        </div>
    );
};

export default AdminLogin;
