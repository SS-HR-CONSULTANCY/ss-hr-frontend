import { toast } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FormField from "../form/FormFiled";
import { Button } from "@/components/ui/button";
import { addressArray } from "@/utils/constants";
import { updateUserAddress } from "@/utils/apis/userApi";
import type { AppDispatch, RootState } from "@/store/store";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { updateAddressResponse, userAddress } from "@/types/apiTypes/userApiTypes";

const UserAddress: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { userAddress } = useSelector(
        (state: RootState) => state.user,
    );

    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<userAddress>({
        defaultValues: {
            addressLine1: userAddress?.addressLine1 || "",
            addressLine2: userAddress?.addressLine2 || "",
            city: userAddress?.city || "",
            state: userAddress?.state || "",
            district: userAddress?.district || "",
            country: userAddress?.country || "",
            postalCode: userAddress?.postalCode || "",
            poBox: userAddress?.poBox || "",
            landmark: userAddress?.landmark || "",
        },
    });

    const onSubmit: SubmitHandler<updateAddressResponse> = async (
        data,
    ) => {
        try {
            await dispatch(updateUserAddress(data))
                .unwrap()
                .then((res) => {
                    if (res.success) {
                        toast.success(res.message || "Address updated successfully!");
                    } else {
                        toast.error(res.message || "Address updating failed!");
                    }
                })
                .catch((error) => {
                    toast.error(error.message || "Address updating error");
                });
        } catch {
            toast.error("Failed to update address");
        }
    };

    return (
        <div className="p-4 md:p-6 rounded-md border mt-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-semibold my-2">
                    Address
                </h3>
                {(userAddress || isEditing) && (
                    <Button
                        variant={isEditing ? "destructive" : "outline"}
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                    >
                        {isEditing ? "Cancel" : "Edit Info"}
                    </Button>
                )}
            </div>

            {(!userAddress && !isEditing) ? (
                <div className="rounded-md w-full p-4 flex flex-col justify-center items-center border shadow-md space-y-2">
                    <p>No data found</p>
                    <Button
                        variant={"outline"}
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                    >Add Address</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addressArray.map((item) => (
                            <div key={item.key}>
                                <FormField<userAddress>
                                    id={item.key}
                                    label={item.label}
                                    placeholder={isEditing ? `Enter ${item.label.toLowerCase()}` : "Not provided"}
                                    type={item.type || "text"}
                                    register={register}
                                    error={errors[item.key]?.message}
                                    defaultValue={userAddress?.[item.key]}
                                    readOnly={!isEditing}
                                />
                            </div>
                        ))}
                    </div>

                    {isEditing && (
                        <div className="mt-4">
                            <Button
                                type="submit"
                                variant="outline"
                                className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                            >
                                {!userAddress ? "Save Address" : "Save Changes"}
                            </Button>
                        </div>
                    )}
                </form>
            )}
        </div>
    )
}

export default UserAddress