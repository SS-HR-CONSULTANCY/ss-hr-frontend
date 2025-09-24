import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import FormField from '../form/FormFiled';
import type { Role } from '@/types/entities/user';
import { useQueryClient } from '@tanstack/react-query';
import { createAdmin } from '@/utils/apis/adminSettingsApi';
import { useForm, type SubmitHandler } from 'react-hook-form';
import noProfile from '../../assets/defaultImgaes/noProfile.png';
import type { CreateAdminRequest } from '@/types/apiTypes/adminApiTypes';

interface AdminManagementFormProps {
  role: Role;
  setAddAdmin: (data: boolean) => void;
}
const AdminManagementForm: React.FC<AdminManagementFormProps> = ({
  role,
  setAddAdmin
}) => {

  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAdminRequest>();

  // Create new admin
  const onSubmit: SubmitHandler<CreateAdminRequest> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('phone', data.phone);
      formData.append('role', data.role);
      formData.append('createrRole', role);

      if (data.profileImage && data.profileImage.length > 0) {
        formData.append('profileImage', data.profileImage[0]);
      }
      await createAdmin(formData);
      toast.success('Admin created successfully!');
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      reset();
      setSelectedImage(null);
      setAddAdmin(false);
    } catch {
      toast.error("Failed to create admin");
    }
  }; 

  return (
    <section className="shadow-md p-4 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black">
      <h2 className="text-2xl font-bold mb-4">Add new admin</h2>
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left: Create Admin Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField<CreateAdminRequest>
              id="fullName"
              label="Full Name"
              placeholder="Enter full name"
              register={register}
              error={errors.fullName?.message}
            />
            <FormField<CreateAdminRequest>
              id="email"
              label="Email"
              type="email"
              placeholder="Enter email"
              register={register}
              error={errors.email?.message}
            />
            <FormField<CreateAdminRequest>
              id="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              register={register} error={errors.password?.message}
              showTogglePassword
            />

            <FormField<CreateAdminRequest>
              id="phone"
              label="Phone number"
              type="text"
              placeholder="Enter phone number"
              register={register}
              error={errors.phone?.message}
            />
            <div>
              <img
                className={`h-32 w-32 rounded-lg transition-opacity`}
                src={selectedImage ? selectedImage : noProfile}
                alt="Profile"
              />
              <FormField<CreateAdminRequest>
                id="profileImage"
                label="Profile Image"
                type="file"
                register={register}
                error={errors.profileImage?.message}
                onFileSelect={(url) => setSelectedImage(url)} // 👈 update preview state
              />
            </div>
            <FormField<CreateAdminRequest>
              id="role"
              label="Role"
              type="select"
              register={register}
              error={errors.role?.message}
            >
              <option value="admin" className='text-black'>Admin</option>
              <option value="superAdmin" className='text-black'>Super Admin</option>
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setAddAdmin(false)}
            >
              Cancel
            </Button>
            <Button variant="outline" type="submit">Create Admin</Button>
          </div>
        </form>

      </div>
    </section>
  );
};

export default AdminManagementForm;
