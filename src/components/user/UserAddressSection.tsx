import { Toggle } from "../ui/toggle";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FormField from "../form/FormFiled";
import { Check, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAddress } from "@/utils/apis/userApi";
// import { poBoxCountries } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { CountryDropdown } from "../ui/country-dropdown";
import type { AppDispatch, RootState } from "@/store/store";
import type { UserAddress } from "@/types/apiTypes/userApiTypes";
import { addressSchema, type AddressForm } from "@/utils/validationSchema";
import { Controller, useForm, type SubmitHandler, type FieldErrors, type Path } from "react-hook-form";

const UserAddressSection: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { userAddress } = useSelector(
        (state: RootState) => state.user,
    );

    // const [showPoBox, setShowPoBox] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setFocus,
    } = useForm<AddressForm>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            addressLine1: userAddress?.addressLine1 || "",
            addressLine2: userAddress?.addressLine2 || "",
            landmark: userAddress?.landmark || "",
            country: userAddress?.country || "",
            state: userAddress?.state || "",
            district: userAddress?.district || "",
            city: userAddress?.city || "",
            postalCode: userAddress?.postalCode || "",
            primary: userAddress?.primary ?? !userAddress,
        },
    });

    const onError = (errors: FieldErrors<AddressForm>) => {
        const firstErrorField = Object.keys(errors)[0] as Path<AddressForm> | undefined;
        if (firstErrorField) {
            setFocus(firstErrorField);
        }
        toast.error("Please fix the highlighted fields.");
    };

    const onSubmit: SubmitHandler<AddressForm> = async (
        data,
    ) => {
        console.log("data : ",data);
        console.log("userAddress : ",userAddress);
        const update: boolean = userAddress ? true : false;
        try {
            await dispatch(createAddress({ id: update ? userAddress?._id : null, data: data as UserAddress, update}))
                .unwrap()
                .then((res) => {
                    if (res.success) {
                        toast.success(res.message || `Address ${update ? "updated" : "created"} successfully!`);
                        setIsEditing((prev) => !prev);
                    } else {
                        toast.error(res.message || `Address ${update ? "updating" : "creating"} failed!`);
                    }
                })
                .catch((error) => {
                    toast.error(error.message || `Address ${update ? "update" : "create"} error`);
                });
        } catch {
            toast.error(`Failed to ${update ? "update" : "create"} address`);
        }
    };

    return (
        <div className="p-4 md:p-6 rounded-md border mt-4 shadow-md">
            <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-semibold my-2">
                    Address
                </h3>
                {userAddress && (
                    <Button
                        variant={"outline"}
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                    >
                        <Edit /> {"Edit"}
                    </Button>
                )}
            </div>

            {(!userAddress && !isEditing) ? (
                <div className="rounded-md w-full p-4 flex flex-col justify-center items-center border space-y-2">
                    <p>No data found</p>
                    <Button
                        variant={"outline"}
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                    >Add Address</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <FormField<AddressForm>
                            id="addressLine1"
                            label="Address Line 1"
                            placeholder={isEditing ? `Enter Address Line 1` : "Not provided"}
                            type="text"
                            register={register}
                            error={errors["addressLine1"]?.message}
                            defaultValue={userAddress?.addressLine1}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                        <FormField<AddressForm>
                            id="addressLine2"
                            label="Address Line 2"
                            placeholder={isEditing ? `Enter Address Line 2` : "Not provided"}
                            type="text"
                            register={register}
                            error={errors["addressLine2"]?.message}
                            defaultValue={userAddress?.addressLine2}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                        <FormField<AddressForm>
                            id="landmark"
                            label="Landmark"
                            placeholder={isEditing ? `Enter Landmark` : "Not provided"}
                            type="text"
                            register={register}
                            error={errors["landmark"]?.message}
                            defaultValue={userAddress?.landmark}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                        <Controller
                            name="country"
                            control={control}
                            rules={{ required: "Country is required" }}
                            render={({ field }) => (
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium">Country{isEditing && (<span className="mx-2 text-red-500">*</span>)}</label>
                                    <CountryDropdown
                                        placeholder="Select Country"
                                        defaultValue={field.value}
                                        disabled={!isEditing}
                                        onChange={(country) => {
                                            field.onChange(country.alpha3);
                                        }}
                                    />
                                    {errors.country && (
                                        <span className="text-xs text-red-500">
                                            {errors.country.message}
                                        </span>
                                    )}
                                </div>
                            )}
                        />

                        <FormField<AddressForm>
                            id="state"
                            label="State"
                            placeholder={isEditing ? `Enter State` : "Not provided"}
                            type="text"
                            register={register}
                            error={errors["state"]?.message}
                            defaultValue={userAddress?.state}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                        <FormField<AddressForm>
                            id="district"
                            label="District"
                            placeholder={isEditing ? `Enter District` : "Not provided"}
                            type="text"
                            register={register}
                            error={errors["district"]?.message}
                            defaultValue={userAddress?.district}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                        <FormField<AddressForm>
                            id="city"
                            label="City"
                            placeholder={isEditing ? `Enter City` : "Not provided"}
                            type="text"
                            register={register}
                            error={errors["city"]?.message}
                            defaultValue={userAddress?.city}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                            <FormField<AddressForm>
                                id="postalCode"
                                label="Postal Code / po Box"
                                placeholder={isEditing ? `Enter Postal Code` : "Not provided"}
                                type="text"
                                register={register}
                                error={errors["postalCode"]?.message}
                                defaultValue={userAddress?.postalCode}
                                readOnly={!isEditing}
                                required={(isEditing)}
                            />

                            {/* <FormField<AddressForm>
                                id="poBox"
                                label="Po Box"
                                placeholder={isEditing ? `Enter Po Box` : "Not provided"}
                                type="text"
                                register={register}
                                error={errors["poBox"]?.message}
                                defaultValue={userAddress?.poBox}
                                readOnly={!isEditing}
                                required={false}
                            /> */}

                        <Controller
                            name="primary"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center space-x-3 mt-4">
                                    <Toggle
                                        pressed={field.value}
                                        disabled={!isEditing || !userAddress}
                                        onPressedChange={(pressed) => field.onChange(pressed)}
                                        className={`text-sm font-medium ${field.value ? "bg-primary text-white" : "bg-muted"
                                            }`}
                                    >
                                        <Check
                                            className={`w-4 h-4 mr-2 ${field.value ? "opacity-100" : "opacity-0"}`}
                                        />
                                        {field.value ? "Primary Address" : "Set as Primary"}
                                    </Toggle>
                                </div>
                            )}
                        />

                    </div>

                    {isEditing && (
                        <div className="mt-4 space-x-4">
                            <Button
                                type="submit"
                                variant="outline"
                                className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                            >
                                {!userAddress ? "Save Address" : "Save Changes"}
                            </Button>
                            <Button
                                variant={"destructive"}
                                onClick={() => setIsEditing((prev) => !prev)}
                                className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                            >
                                {"Cancel"}
                            </Button>
                        </div>
                    )}
                    
                </form>
            )}
        </div>
    )
}

export default UserAddressSection;