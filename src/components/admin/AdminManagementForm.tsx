import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import FormField from '../form/FormFiled';
import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { AdminFormValues } from '@/types/componentTypes/adminManagement';
import { fetchAdmins, createAdmin, blockAdmin, deleteAdmin } from '@/utils/apis/adminSettingsApi';
import type { CreateAdminRequest, CreateAdminResponse, BlockAdminRequest, BlockAdminResponse, DeleteAdminRequest } from '@/types/apiTypes/admin';

const AdminManagementForm: React.FC = () => {

  const [admins, setAdmins] = useState<CreateAdminResponse[]>([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AdminFormValues>();

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
  const onSubmit: SubmitHandler<AdminFormValues> = async (data) => {
    try {
      const payload: CreateAdminRequest = { ...data, profileImg: '' }; // empty string for now
      const newAdmin: CreateAdminResponse = await createAdmin(payload);
      setAdmins(prev => [...prev, newAdmin]);
      toast.success("Admin created successfully!");
      reset();
    } catch {
      toast.error("Failed to create admin");
    }
  };

  // Block/Unblock admin
  const handleBlock = async (id: string, isBlocked: boolean) => {
    try {
      const payload: BlockAdminRequest = { _id: id, isBlocked: !isBlocked };
      const updatedAdmin: BlockAdminResponse = await blockAdmin(payload);
      setAdmins(prev => prev.map(a => a._id === id ? updatedAdmin : a));
      toast.success(`${updatedAdmin.fullName} is now ${updatedAdmin.isBlocked ? 'blocked' : 'unblocked'}`);
    } catch {
      toast.error("Failed to update admin status");
    }
  };

  // Delete admin
  const handleDelete = async (id: string) => {
    try {
      const payload: DeleteAdminRequest = { _id: id };
      await deleteAdmin(payload);
      setAdmins(prev => prev.filter(a => a._id !== id));
      toast.success("Admin deleted successfully!");
    } catch {
      toast.error("Failed to delete admin");
    }
  };

  return (
    <section className="shadow-md p-4 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black">
      <h2 className="text-2xl font-bold mb-4">Admin Management</h2>
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left: Create Admin Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:w-1/2 space-y-4 p-4 rounded shadow">
          <FormField id="fullName" label="Full Name" placeholder="Enter full name" register={register} error={errors.fullName?.message} />
          <FormField id="email" label="Email" type="email" placeholder="Enter email" register={register} error={errors.email?.message} />
          <FormField id="password" label="Password" type="password" placeholder="Enter password" register={register} error={errors.password?.message} showTogglePassword />
          <FormField id="role" label="Role" type="select" register={register} error={errors.role?.message}>
            <option value="subadmin" className='text-black'>Sub Admin</option>
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
                  <p><strong>Name:</strong> {a.fullName}</p>
                  <p><strong>Email:</strong> {a.email}</p>
                  <p><strong>Role:</strong> {a.role}</p>
                  <p><strong>Blocked :</strong> {a.isBlocked ? 'No' : 'Yes'}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => handleBlock(a._id, a.isBlocked || false)}>
                      {a.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
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
