import React from 'react';
import { UserPlus } from 'lucide-react';
import type { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import UserDetails from '@/components/admin/UserDetails';
import AddUserForm from '@/components/admin/AddUserForm';
import CommonTable from '@/components/common/CommonTable';
import EditUserForm from '@/components/admin/EditUserForm';
import { openAddUserModal } from '@/store/slices/userSlice';
import { adminFetchAllUsers } from '@/utils/apis/adminUserApi';
import { AdminUserHelper } from '@/utils/helpers/adminUserHelper';
import type { AdminfetchAllUsersResponse } from '@/types/apiTypes/adminApiTypes';
import { AdminUserTableColumns } from '@/components/table/tableColumns/AdminUserTableColumn';

const AdminUsers: React.FC = () => {

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { handleDelete, handleEdit, handleViewDetails } = AdminUserHelper(dispatch, queryClient)
  const { isAddUserModalOpen, isEditUserModalOpen, isUserDetailsModalOpen } = useSelector(
    (state: RootState) => state.user
  );

  const columns = AdminUserTableColumns( handleDelete, handleEdit, handleViewDetails)

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

      <CommonTable<AdminfetchAllUsersResponse>
        fetchApiFunction={adminFetchAllUsers}
        queryKey="admin-users"
        heading="Users"
        description=""
        column={columns}
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