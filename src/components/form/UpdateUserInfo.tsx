import React from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form/FormFiled";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileInfo } from "@/utils/apis/authApi";
import type { AppDispatch, RootState } from "@/store/store";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { updateUserInfo, updateUserInfoResponse } from "@/types/apiTypes/authApiTypes";

const UpdateUserInfo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<updateUserInfo>({
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      phoneTwo: user?.phoneTwo || "",
    },
  });

  const onSubmitUserInfo: SubmitHandler<updateUserInfoResponse> = async (
    data,
  ) => {
    try {
      await dispatch(updateProfileInfo(data))
        .unwrap()
        .then((res) => {
          if (res.success) {
            toast.success(res.message || "User info updated successfully!");
          } else {
            toast.error(res.message || "User info updating failed!");
          }
        })
        .catch((error) => {
          toast.error(error.message || "User info updating error");
        });
    } catch {
      toast.error("Failed to update user info");
    }
  };

  return (
    <section className="w-full md:max-w-6xl lg:max-w-7xl mx-auto bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black rounded-md shadow-md mt-6">
      <div className="p-4 md:p-6 rounded mt-6 space-y-4">
        <h2 className="text-lg md:text-2xl font-bold mb-6">
          Update profile info
        </h2>
        <form onSubmit={handleSubmit(onSubmitUserInfo)} className="space-y-4">
          <FormField<updateUserInfo>
            id="fullName"
            label="Full Name"
            placeholder="Enter full name"
            type="text"
            register={register}
            error={errors.fullName?.message}
          />

          <FormField<updateUserInfo>
            id="phone"
            label="Phone 1"
            placeholder="Enter phone number"
            type="text"
            register={register}
            error={errors.phone?.message}
          />

          <FormField<updateUserInfo>
            id="phoneTwo"
            label="Phone 2"
            placeholder="Enter secondary phone number"
            type="text"
            register={register}
            error={errors.phoneTwo?.message}
          />

          <Button
            type="submit"
            variant="outline"
            className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-1"
          >
            Update Profile info
          </Button>
        </form>
      </div>
    </section>
  );
};

export default UpdateUserInfo;
