import React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/utils/apis/authApi";
import FormField from "@/components/form/FormFiled";
import CustomLink from "@/components/form/CustomLink";
import FormHeader from "@/components/form/FormHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomeIcon, LoaderCircle, UserPlus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { emailVerifySchema, type EmailVerifyForm } from "@/utils/zod/authZod";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const EmailVerifyPage: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EmailVerifyForm>({
    resolver: zodResolver(emailVerifySchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailVerifyForm) => {
    await dispatch(verifyEmail(data))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "Otp has been sent");
          navigate('/verify-otp');
        } else {
          toast.error(res?.message || "Failed to send otp");
        }
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred during sending otp.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <BackgroundBeamsWithCollision>
        <Card className="w-full max-w-md border border-slate-700/50 shadow-xl z-20 mx-4 md:mx-0">
          <FormHeader
            title="Verify Email"
            description="Enter your email"
          />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField<EmailVerifyForm>
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                register={register}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !isValid}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    Sending Otp
                  </span>
                ) : (
                  "Send otp"
                )}
              </Button>
            </form>
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
  )
}

export default EmailVerifyPage;