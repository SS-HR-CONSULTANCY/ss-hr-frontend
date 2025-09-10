import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import FormField from '../form/FormFiled';
import type { Role } from '@/types/entities/user';
import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import noProfile from '../../assets/defaultImgaes/noProfile.png';
import { fetchAdmins, createAdmin, deleteAdmin } from '@/utils/apis/adminSettingsApi';
import type { CreateAdminRequest, CreateAdminResponse, DeleteAdminRequest } from '@/types/apiTypes/adminApiTypes';

interface AdminManagementFormProps {
  role: Role
}
const AdminManagementForm: React.FC<AdminManagementFormProps> = ({
  role
}) => {

  const [admins, setAdmins] = useState<CreateAdminResponse[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAdminRequest>();

  // Fetch admins
  useEffect(() => {
    const getAdmins = async () => {
      try {
        const data = await fetchAdmins();
        setAdmins(data);
      } catch {
        toast.error("Failed to fetch admins");
      }
    };
    getAdmins();
  }, []);

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
      const newAdmin: CreateAdminResponse = await createAdmin(formData);
      setAdmins((prev) => [...prev, newAdmin]);
      toast.success('Admin created successfully!');
      reset();
      setSelectedImage(null);
    } catch {
      toast.error("Failed to create admin");
    }
  };

  // Delete admin
  const handleDelete = async (id: string) => {
    try {
      const payload: DeleteAdminRequest = { _id: id };
      await deleteAdmin(payload);
      setAdmins((prev) => prev.filter((a) => a._id !== id));
      toast.success('Admin deleted successfully!');
    } catch {
      toast.error('Failed to delete admin');
    }
  };

  return (
    <section className="shadow-md p-4 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black">
      <h2 className="text-2xl font-bold mb-4">Admin Management</h2>
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left: Create Admin Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:w-1/2 space-y-4 p-4 rounded shadow">
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
          <Button variant="outline" type="submit">Create Admin</Button>
        </form>

        {/* Right: Admin List */}
        <div className="md:w-1/2 p-4 rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">Admins</h3>
          {admins?.length > 0 ? (
            <div className="space-y-2">
              {admins?.map(a => (
                <div key={a._id} className="border p-2 rounded flex flex-col gap-1">
                  <img
                    className={`h-32 w-32 rounded-lg transition-opacity`}
                    src={a.profileImage || noProfile}
                    alt="Profile"
                  />
                  <p><strong>Name:</strong> {a.fullName}</p>
                  <p><strong>Email:</strong> {a.email}</p>
                  <p><strong>Role:</strong> {a.role}</p>
                  <p><strong>Blocked :</strong> {a.isBlocked ? 'No' : 'Yes'}</p>
                  <p><strong>Phone :</strong> {a.phone}</p>
                  <p><strong>CreatedAt :</strong> {a.createdAt ? 'No' : 'Yes'}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(a._id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p>No admins found.</p>}
        </div>

      </div>
    </section>
  );
};

export default AdminManagementForm;
