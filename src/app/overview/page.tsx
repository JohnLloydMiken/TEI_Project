import * as React from 'react';
import OverviewWidgets from '@/components/dashboard/eligibility-checker/widgets/overview-widgets';
import HistoricalChart from '@/components/dashboard/analytics/historical-barChart';
import PieChart from '@/components/dashboard/analytics/pie-chart';

export default function OverviewPage() {
  return (
    <div className='flex flex-col space-y-2'>
      <span></span>
    <OverviewWidgets/>

    <div className='w-full flex flex-row items-center space-x-2 '>
      <HistoricalChart/>
      <PieChart/>
    </div>
    
    </div>
  );
}
