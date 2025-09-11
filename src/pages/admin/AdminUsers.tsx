import React from 'react';
import { UserPlus } from 'lucide-react';
import type { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/entities/user';
import { useDispatch, useSelector } from 'react-redux';
import UserDetails from '@/components/admin/UserDetails';
import AddUserForm from '@/components/admin/AddUserForm';
import CommonTable from '@/components/common/CommonTable';
import EditUserForm from '@/components/admin/EditUserForm';
import { openAddUserModal } from '@/store/slices/userSlice';
import { UserTableColumns } from '@/components/table/tableColumns/UserTableColums';
import { adminFetchAllUsers } from '@/utils/apis/adminUserApi';

const AdminUsers: React.FC = () => {
  const dispatch = useDispatch();
  const { isAddUserModalOpen, isEditUserModalOpen, isUserDetailsModalOpen } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="">Manage application users and their permissions</p>
        </div>
        <Button
          onClick={() => dispatch(openAddUserModal())}
          variant={'outline'}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <CommonTable<User>
        fetchApiFunction={adminFetchAllUsers}
        queryKey="admin-users"
        heading="Users"
        description=""
        column={UserTableColumns}
        columnsCount={6}
        showDummyData={false}
      />


      {/* Modals */}
      {isAddUserModalOpen && <AddUserForm />}
      {isEditUserModalOpen && <EditUserForm />}
      {isUserDetailsModalOpen && <UserDetails />}
    </div>
  );
};

export default AdminUsers;