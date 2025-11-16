import React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form/FormFiled";
import { useAppDispatch } from "../../hooks/redux";
import CustomLink from "@/components/form/CustomLink";
import FormHeader from "@/components/form/FormHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "@/utils/apis/authApi";
import { HomeIcon, LoaderCircle, User } from "lucide-react";
import PasswordStrength from "@/components/form/PasswordStrength";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getPasswordStrength } from "@/utils/helpers/passwordStrength";
import { updatePasswordSchema, type UpdatePasswordForm } from "@/utils/zod/authZod";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const UpdatePasswordPage: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch
  } = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const passwordStrength = getPasswordStrength(password || "");

  const onSubmit = async (data: UpdatePasswordForm) => {
    const { password } = data;
    if(!user || !user.email || !user?.verificationToken || !user.role) {
      toast.error("Please try again.");
      return;
    }
    await dispatch(updatePassword({ 
      password, 
      email: user.email, 
      verificationToken: user.verificationToken, 
      role: user.role
    }))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "Logged In Successfully");
          navigate('/login');
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
            title="Update Password"
            description="Enter new password"
          />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <FormField<UpdatePasswordForm>
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
                <PasswordStrength
                  password={password}
                  passwordStrength={passwordStrength}
                />
              )}

              <FormField<UpdatePasswordForm>
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                register={register}
                showTogglePassword
              />

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting || !isValid}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Confirm"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 w-full">
            <CustomLink
              href="/login"
              text="Sign in to existing account"
              icon={User}
            />
            <CustomLink href="/" text="Bck to home" icon={HomeIcon} />
          </CardFooter>
        </Card>
      </BackgroundBeamsWithCollision>
    </div>
  )
}

export default UpdatePasswordPage;