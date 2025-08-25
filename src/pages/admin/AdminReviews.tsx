import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import type { AppDispatch } from '@/store/store';
import { reviewsDummyData } from '@/utils/dummyData';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllPReviews } from '@/utils/apis/adminApi';
import { toggleAddReviewForm } from '@/store/slices/adminSlice';
import type { AdminfetchAllReviewsResponse } from '@/types/apiTypes/admin';
import { AdminReviewsTableColumns } from '@/components/table/tableColumns/AdminTableColums';

const AdminReviews: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
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
      <div className='p-4'>
        <Button variant={"outline"} onClick={() => dispatch(toggleAddReviewForm())}> Add new review</Button>
      </div>
      </>
  )
}

export default AdminReviews