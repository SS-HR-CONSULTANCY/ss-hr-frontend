import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import type { AppDispatch } from '@/store/store';
import { companiesDummyData } from '@/utils/dummyData';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllCompanies } from '@/utils/apis/adminApi';
import { toggleAddCompanyForm } from '@/store/slices/adminSlice';
import type { AdminfetchAllComapniesResponse } from '@/types/apiTypes/admin';
import { AdminCompaniesTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

const AdminCompanies: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <CommonTable<AdminfetchAllComapniesResponse>
        fetchApiFunction={adminFetchAllCompanies}
        queryKey="companies"
        heading="Companies"
        description='List of companies listed in application'
        column={AdminCompaniesTableColumns}
        columnsCount={5}
        dummyData={companiesDummyData}
        showDummyData={true}
      />
      <div className='p-4'>
        <Button variant={"outline"} onClick={() => dispatch(toggleAddCompanyForm())}> Add new company</Button>
      </div>
    </>
  )
}

export default AdminCompanies