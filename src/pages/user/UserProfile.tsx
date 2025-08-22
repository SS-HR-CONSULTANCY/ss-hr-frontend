import React from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form/FormFiled";
import { useForm, type SubmitHandler } from "react-hook-form";

interface UserProfileFormValues {
  fullName: string;
  email: string;
  profileImage: File;
}
interface UserPasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfile: React.FC = () => {

  const { user } = useSelector((store: RootState) => store.auth);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<UserProfileFormValues>();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    // reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<UserPasswordFormValues>();



  const onSubmitProfile: SubmitHandler<UserProfileFormValues> = async (data) => {
    // const file = data.profileImage?.[0];
    // if (file && !["image/jpeg", "image/png"].includes(file.type)) {
    //   toast.error("Only JPG or PNG images are allowed for profile image!");
    //   return;
    // }

    try {
      // const response = await updateUserProfile({
      //   fullname: data.fullname,
      //   email: data.email,
      //   profileImage: file,
      // });
      // if (response.success) toast.success(response.message);
      // const updatedUser = await getUserProfile();
      // setCurrentUser(updatedUser);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onSubmitPassword: SubmitHandler<UserPasswordFormValues> = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // const response = await updateUserPassword(data);
      // if (response.success) {
      //   toast.success(response.message);
      //   resetPasswordForm();
      // }
    } catch {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="space-y-10 p-5">
      <section className="p-4 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Current Profile Data */}
          <div className="md:w-1/2 space-y-4 p-4 rounded">
            <h3 className="text-lg font-semibold">Current Profile</h3>
            {user ? (
              <>
                <p><strong>Fullname:</strong> {user.fullname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {user.profileImage && (
                  <div>
                    <strong>Profile Image:</strong>
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="size-24 object-contain mt-2 border rounded-full"
                    />
                  </div>
                )}
              </>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>

          {/* Right: Profile Update Form */}
          <form
            onSubmit={handleSubmitProfile(onSubmitProfile)}
            className="md:w-1/2 space-y-4 p-4 rounded shadow"
          >
            <FormField
              id="fullName"
              label="Fullname"
              placeholder="Enter fullname"
              register={registerProfile}
              error={profileErrors.fullName?.message}
            />

            <FormField
              id="email"
              label="Email"
              placeholder="Enter email"
              register={registerProfile}
              error={profileErrors.email?.message}
            />

            <div className="space-y-2">
              <label htmlFor="profileImage" className="block font-medium">
                Profile Image (JPG or PNG)
              </label>
              <Input
                id="profileImage"
                type="file"
                accept=".jpg,.png"
                {...registerProfile("profileImage")}
              />
              {profileErrors.profileImage && (
                <p className="text-xs text-destructive">
                  {profileErrors.profileImage.message}
                </p>
              )}
            </div>

            <Button variant="outline" type="submit">
              Save Profile
            </Button>
          </form>
        </div>
      </section>

      <section className="p-4 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black rounded-md shadow-md mt-6">
        {/* Password Update Form */}
        <div className="p-4 rounded shadow-md mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Update Password</h3>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <FormField
              id="currentPassword"
              label="Current Password"
              placeholder="Enter current password"
              type="password"
              register={registerPassword}
              error={passwordErrors.currentPassword?.message}
            />

            <FormField
              id="newPassword"
              label="New Password"
              placeholder="Enter new password"
              type="password"
              register={registerPassword}
              error={passwordErrors.newPassword?.message}
            />

            <FormField
              id="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm new password"
              type="password"
              register={registerPassword}
              error={passwordErrors.confirmPassword?.message}
            />

            <Button variant="outline" type="submit">
              Update Password
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;