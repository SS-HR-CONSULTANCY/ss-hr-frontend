import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import type { AppDispatch } from '@/store/store';
import { packageDummyData } from '@/utils/dummyData';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllPackages } from '@/utils/apis/adminApi';
import { toggleAddPackageForm } from '@/store/slices/adminSlice';
import type { AdminfetchAllPackagesResponse } from '@/types/apiTypes/admin';
import { AdminPackagesTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

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