import React from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { packageDummyData } from '@/utils/constants';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllPackages } from '@/utils/apis/adminApi';
import type { AdminfetchAllPackagesResponse } from '@/types/apiTypes/admin';
import { AdminPackagesTableColumns } from '@/components/table/tableColumns/AdminUsersTable';
import { toggleAddPackageForm } from '@/store/slices/adminSlice';
import { Button } from '@/components/ui/button';

const AdminPackages: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();

  return (
    <>
    <CommonTable<AdminfetchAllPackagesResponse>
      fetchApiFunction={adminFetchAllPackages}
      queryKey="packages"
      heading="Travel Packages"
      description='List of Travel packages'
      column={AdminPackagesTableColumns}
      columnsCount={5}
      dummyData={packageDummyData}
      showDummyData={true}
      />
      <div className='p-4'>
        <Button variant={"outline"} onClick={() => dispatch(toggleAddPackageForm())}> Add new company</Button>
      </div>
      </>
  )
}

export default AdminPackages