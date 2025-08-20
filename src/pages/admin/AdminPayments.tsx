import React from 'react';
import { paymentsDummyData } from '@/utils/dummyData';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllPayments } from '@/utils/apis/adminApi';
import type { AdminfetchAllPaymentsResponse } from '@/types/apiTypes/admin';
import { AdminPaymentsTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

const AdminPayments:React.FC = () => {
  return (
     <CommonTable<AdminfetchAllPaymentsResponse>
      fetchApiFunction={adminFetchAllPayments}
      queryKey="payments"
      heading="Payments"
      description='List of payments'
      column={AdminPaymentsTableColumns}
      columnsCount={5}
      dummyData={paymentsDummyData}
      showDummyData={true}
    />
  )
}

export default AdminPayments