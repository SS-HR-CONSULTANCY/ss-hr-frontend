import React from 'react';
import { reviewsDummyData } from '@/utils/constants';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllPReviews } from '@/utils/apis/adminApi';
import type { AdminfetchAllReviewsResponse } from '@/types/apiTypes/admin';
import { AdminReviewsTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

const AdminReviews: React.FC = () => {
  return (
     <CommonTable<AdminfetchAllReviewsResponse>
      fetchApiFunction={adminFetchAllPReviews}
      queryKey="reviews"
      heading="Reviews"
      description='List of reviews by satified clients'
      column={AdminReviewsTableColumns}
      columnsCount={5}
      dummyData={reviewsDummyData}
      showDummyData={true}
    />
  )
}

export default AdminReviews