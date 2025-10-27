import { Button } from "../ui/button";
import { toast } from "react-toastify";
import FormField from "../form/FormFiled";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AboutSettingsFormValues } from "@/types/componentTypes/adminSettings";
import type { AdminGetAboutCurrentDataResponse } from "@/types/apiTypes/adminApiTypes";
import {
  adminGetWebsiteAboutCurrentData,
  adminUpdateWebsiteAboutData,
} from "@/utils/apis/adminSettingsApi";

const AdminWebsiteAboutDataForm: React.FC = () => {
  const [currentData, setCurrentData] =
    useState<AdminGetAboutCurrentDataResponse | null>(null);

  const {
    register: registerAbout,
    handleSubmit: handleSubmitAbout,
    formState: { errors: aboutErrors },
    reset,
  } = useForm<AboutSettingsFormValues>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminGetWebsiteAboutCurrentData();
        setCurrentData(data);
        reset(data);
      } catch {
        toast.error("Failed to fetch About data");
      }
    };
    fetchData();
  }, [reset]);

  const onSubmitAbout: SubmitHandler<AboutSettingsFormValues> = async (
    data,
  ) => {
    try {
      await adminUpdateWebsiteAboutData(data);
      toast.success("About settings updated successfully!");
      const updatedData = await adminGetWebsiteAboutCurrentData();
      setCurrentData(updatedData);
      reset(updatedData);
    } catch {
      toast.error("Failed to update About settings");
    }
  };

  return (
    <section className="shadow-md p-4 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black rounded-md">
      <h2 className="text-2xl font-bold mb-4">About</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Current Data */}
        <form
          onSubmit={handleSubmitAbout(onSubmitAbout)}
          className="md:w-1/2 space-y-4 p-4  rounded shadow"
        >
          <FormField
            id="aboutText"
            label="About Text"
            placeholder="Write about your company..."
            type="textarea"
            register={registerAbout}
            error={aboutErrors.aboutText?.message}
          />
          <Button variant="outline" type="submit">
            Save About Settings
          </Button>
        </form>

        {/* Right: Form */}
        <div className="md:w-1/2 space-y-4 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Current About Data</h3>
          {currentData ? (
            <p className="text-sm">{currentData.aboutText}</p>
          ) : (
            <p>Loading current data...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminWebsiteAboutDataForm;
