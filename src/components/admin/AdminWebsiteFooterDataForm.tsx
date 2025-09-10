import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import FormField from '../form/FormFiled';
import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { FooterSettingsFormValues } from '@/types/componentTypes/adminSettings';
import type { AdminGetFooterCurrentDataResponse } from '@/types/apiTypes/adminApiTypes';
import { adminGetWebsiteFooterCurrentData, adminUpdateWebsiteFooterData } from '@/utils/apis/adminSettingsApi';

const AdminWebsiteFooterDataForm: React.FC = () => {

    const [currentData, setCurrentData] = useState<AdminGetFooterCurrentDataResponse | null>(null);

    const {
        register: registerFooter,
        handleSubmit: handleSubmitFooter,
        formState: { errors: footerErrors },
        reset
    } = useForm<FooterSettingsFormValues>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await adminGetWebsiteFooterCurrentData();
                setCurrentData(data);
                reset(data);
            } catch {
                toast.error("Failed to fetch current footer data");
            }
        };
        fetchData();
    }, [reset]);

    const onSubmitFooter: SubmitHandler<FooterSettingsFormValues> = async (data) => {
        try {
            await adminUpdateWebsiteFooterData(data);
            toast.success("Footer settings updated successfully!");
            const updatedData = await adminGetWebsiteFooterCurrentData();
            setCurrentData(updatedData);
            reset(updatedData);
        } catch {
            toast.error("Failed to update footer settings");
        }
    };

    return (
        <section className="shadow-md p-4 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black rounded-md">
            <h2 className="text-2xl font-bold mb-4">Footer</h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Current Data */}
                <form onSubmit={handleSubmitFooter(onSubmitFooter)} className="md:w-1/2 space-y-4 p-4 rounded shadow">
                    <FormField id="address" label="Address" placeholder="Enter address" register={registerFooter} error={footerErrors.address?.message} />
                    <FormField id="location" label="Location" placeholder="Enter location" register={registerFooter} error={footerErrors.location?.message} />
                    <FormField id="phoneIndia" label="Phone India" placeholder="Enter India phone number" register={registerFooter} error={footerErrors.phoneIndia?.message} />
                    <FormField id="phoneUAE" label="Phone UAE" placeholder="Enter UAE phone number" register={registerFooter} error={footerErrors.phoneUAE?.message} />
                    <FormField id="facebookUrl" label="Facebook URL" placeholder="Enter Facebook URL" register={registerFooter} error={footerErrors.facebookUrl?.message} />
                    <FormField id="xUrl" label="X URL" placeholder="Enter X (Twitter) URL" register={registerFooter} error={footerErrors.xUrl?.message} />
                    <FormField id="instagramUrl" label="Instagram URL" placeholder="Enter Instagram URL" register={registerFooter} error={footerErrors.instagramUrl?.message} />
                    <FormField id="companyEmail" label="Company Email" type="email" placeholder="Enter company email" register={registerFooter} error={footerErrors.companyEmail?.message} />
                    <FormField id="timingInida" label="Indian office timing" placeholder="Enter Indian office timing" register={registerFooter} error={footerErrors.timingInida?.message} />
                    <FormField id="timingUae" label="UAE office timing" placeholder="Enter UAE office timing" register={registerFooter} error={footerErrors.timingUae?.message} />
                    <Button variant="outline" type="submit">Save Footer Settings</Button>
                </form>

                {/* Right: Form */}
                <div className="md:w-1/2 space-y-4 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Current Footer Data</h3>
                    {currentData ? (
                        <div className="space-y-2 text-sm">
                            <p><strong>Address:</strong> {currentData.address}</p>
                            <p><strong>Location:</strong> {currentData.location}</p>
                            <p><strong>Phone (India):</strong> {currentData.phoneIndia}</p>
                            <p><strong>Phone (UAE):</strong> {currentData.phoneUAE}</p>
                            <p><strong>Email:</strong> {currentData.companyEmail}</p>
                            <p><strong>Facebook URL:</strong> {currentData.facebookUrl}</p>
                            <p><strong>X URL:</strong> {currentData.xUrl}</p>
                            <p><strong>Instagram URL:</strong> {currentData.instagramUrl}</p>
                            <p><strong>Indian Timing:</strong> {currentData.timingInida}</p>
                            <p><strong>UAE Timing:</strong> {currentData.timingUae}</p>
                        </div>
                    ) : (
                        <p>Loading current data...</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminWebsiteFooterDataForm;
