import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import FormField from "../form/FormFiled";
import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AdminGetWebsiteSettingsResponse } from "@/types/apiTypes/adminApiTypes";
import type { WebsiteSettingsFormValues } from "@/types/componentTypes/adminSettings";
import {
  adminUpdateWebsiteLogoAndName,
  adminGetWebsiteCurrentCompanyNameAndLogo,
} from "@/utils/apis/adminSettingsApi";

const AdminWebsiteMainDataForm: React.FC = () => {
  const [currentData, setCurrentData] =
    useState<AdminGetWebsiteSettingsResponse | null>(null);

  const {
    register: registerWebsite,
    handleSubmit: handleSubmitWebsite,
    formState: { errors: websiteErrors },
  } = useForm<WebsiteSettingsFormValues>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminGetWebsiteCurrentCompanyNameAndLogo();
        setCurrentData(data);
      } catch {
        toast.error("Failed to fetch current website data");
      }
    };
    fetchData();
  }, []);

  const onSubmitWebsite: SubmitHandler<WebsiteSettingsFormValues> = async (
    data,
  ) => {
    const file = data.logo?.[0];
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only JPG or PNG images are allowed for logo!");
      return;
    }

    try {
      const response = await adminUpdateWebsiteLogoAndName({
        companyName: data.companyName,
        logo: file,
      });
      if (response.success) toast.success(response.message);
      const updatedData = await adminGetWebsiteCurrentCompanyNameAndLogo();
      setCurrentData(updatedData);
    } catch {
      toast.error("Failed to update website settings");
    }
  };

  return (
    <section className="shadow-md p-4 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black rounded-md">
      <h2 className="text-2xl font-bold mb-4">Website General Info</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <form
          onSubmit={handleSubmitWebsite(onSubmitWebsite)}
          className="md:w-1/2 space-y-4 p-4 rounded shadow"
        >
          <FormField
            id="companyName"
            label="Company Name"
            placeholder="Enter company name"
            register={registerWebsite}
            error={websiteErrors.companyName?.message}
          />

          <div className="space-y-2">
            <label htmlFor="logo" className="block font-medium">
              Logo (JPG or PNG)
            </label>
            <Input
              id="logo"
              type="file"
              accept=".jpg,.png"
              {...registerWebsite("logo")}
            />
            {websiteErrors.logo && (
              <p className="text-xs text-destructive">
                {websiteErrors.logo.message}
              </p>
            )}
          </div>

          <Button variant="outline" type="submit">
            Save Website Settings
          </Button>
        </form>

        <div className="md:w-1/2 space-y-4 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Current Data</h3>
          {currentData ? (
            <>
              <p>
                <strong>Company Name:</strong> {currentData.companyName}
              </p>
              {currentData.logo && (
                <div>
                  <strong>Logo:</strong>
                  <img
                    src={currentData.logo}
                    alt="Current Logo"
                    className="size-24 object-contain mt-2 border"
                  />
                </div>
              )}
            </>
          ) : (
            <p>Loading current data...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminWebsiteMainDataForm;
