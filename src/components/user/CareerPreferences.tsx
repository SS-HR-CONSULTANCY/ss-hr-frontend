import { toast } from "react-toastify";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import FormField from "../form/FormFiled";

type CareerPreferences = {
    currentSalary: string;
    expectedSalary: string;
    immediateJoiner: boolean;
    noticePeriod?: string;
    resume: string;
};

const CareerPreferences: React.FC = () => {

    const { userCareerPreference } = useSelector(
        (state: RootState) => state.user,
    );

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<CareerPreferences>();

    const isImmediateJoiner = watch("immediateJoiner");

    const [isEditing, setIsEditing] = useState(false);

    const onSubmit: SubmitHandler<CareerPreferences> = (data) => {
        toast.success("Career details submitted successfully!");
        reset();
    };

    return (
        <div className="p-4 md:p-6 rounded-md border mt-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-semibold my-2">
                    Career Preferences
                </h3>
                {(userCareerPreference || isEditing) && (
                    <Button
                        variant={isEditing ? "destructive" : "outline"}
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </Button>
                )}
            </div>

            {(!userCareerPreference && !isEditing) ? (
                <div className="rounded-md w-full p-4 flex flex-col justify-center items-center border shadow-md space-y-2">
                    <p>No data found</p>
                    <Button
                        variant={"outline"}
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                    >Add Career Preferences</Button>
                </div>
            ) : (

                <form onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <FormField<CareerPreferences>
                        id="currentSalary"
                        label="Current Salary"
                        placeholder={isEditing ? `Enter current salary` : "Not provided"}
                        type="text"
                        register={register}
                        error={errors["currentSalary"]?.message}
                        defaultValue={userCareerPreference?.["currentSalary"]}
                        readOnly={!isEditing}
                    />

                    <FormField<CareerPreferences>
                        id="expectedSalary"
                        label="Expected Salary"
                        placeholder={isEditing ? `Enter expected salary` : "Not provided"}
                        type="text"
                        register={register}
                        error={errors["expectedSalary"]?.message}
                        defaultValue={userCareerPreference?.["expectedSalary"]}
                        readOnly={!isEditing}
                    />

                    <FormField<CareerPreferences>
                        id="immediateJoiner"
                        label="Immediate Joiner"
                        placeholder={isEditing ? `Select` : "Not provided"}
                        type="select"
                        register={register}
                        error={errors["immediateJoiner"]?.message}
                        defaultValue={userCareerPreference?.["immediateJoiner"]}
                        readOnly={!isEditing}
                        children={
                            <>
                                <option value="">Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </>
                        }
                    />

                    {!isImmediateJoiner && (
                        <div className="space-y-1">
                            <Label htmlFor="noticePeriod">Notice Period</Label>
                            <Input
                                id="noticePeriod"
                                type="text"
                                placeholder="e.g. 1 Month"
                                {...register("noticePeriod", {
                                    required: !isImmediateJoiner ? "Notice period is required" : false,
                                })}
                            />
                            {errors.noticePeriod && (
                                <p className="text-sm text-red-500">{errors.noticePeriod.message}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-1 md:col-span-2">
                        <Label htmlFor="resume">Upload Resume / CV</Label>
                        <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            {...register("resume", { required: "Please upload your resume" })}
                        />
                        {errors.resume && (
                            <p className="text-sm text-red-500">{errors.resume.message}</p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <Button type="submit" variant="outline">
                            Save Preferences
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                reset()
                                setIsEditing((prev) => !prev)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CareerPreferences;
