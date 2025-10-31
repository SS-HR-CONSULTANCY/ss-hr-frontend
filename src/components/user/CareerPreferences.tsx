import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import FormField from "../form/FormFiled";

type CareerPreferences = {
    currentSalary: string;
    expectedSalary: string;
    immediateJoiner: boolean;
    noticePeriod?: string;
    resume: string;
};

const CareerPreferences: React.FC = () => {
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
        console.log("Career Preferences:", data);
        toast.success("Career details submitted successfully!");
        reset();
    };

    return (
        <div className="p-4 md:p-6 rounded-lg border">
            <h3 className="text-lg md:text-2xl font-semibold mb-4">
                Career Preferences
            </h3>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Current Salary */}
                <div className="space-y-1">
                    <Label htmlFor="currentSalary">Current Salary</Label>
                    <Input
                        id="currentSalary"
                        type="text"
                        placeholder="Enter your current salary"
                        {...register("currentSalary", { required: "Current salary is required" })}
                    />
                    {errors.currentSalary && (
                        <p className="text-sm text-red-500">{errors.currentSalary.message}</p>
                    )}
                </div>

                <FormField<CareerPreferences>
                    id={"currentSalary"}
                    label={"Current Salary"}
                    placeholder={isEditing ? `Enter current salary` : "Not provided"}
                    type={"text"}
                    register={register}
                    error={errors["currentSalary"]?.message}
                    defaultValue={""}
                    readOnly={!isEditing}
                />

                {/* Expected Salary */}
                <div className="space-y-1">
                    <Label htmlFor="expectedSalary">Expected Salary</Label>
                    <Input
                        id="expectedSalary"
                        type="text"
                        placeholder="Enter your expected salary"
                        {...register("expectedSalary", { required: "Expected salary is required" })}
                    />
                    {errors.expectedSalary && (
                        <p className="text-sm text-red-500">{errors.expectedSalary.message}</p>
                    )}
                </div>

                {/* Immediate Joiner */}
                <div className="space-y-1">
                    <Label htmlFor="immediateJoiner">Immediate Joiner</Label>
                    <select
                        id="immediateJoiner"
                        className="border rounded-md p-2 w-full"
                        {...register("immediateJoiner", { required: true })}
                    >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>

                {/* Notice Period (only show if not immediate joiner) */}
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

                {/* Resume Upload */}
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

                {/* Submit Button */}
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <Button type="submit" variant="outline">
                        Save Preferences
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => reset()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CareerPreferences;
