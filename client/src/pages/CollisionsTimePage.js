import React from 'react';
import AllTimeInforPage from "./AllTimeInfor";
import LineChartComponent from "./Time_Statis_Graph";


export default function CollisionsTimePage() {
  return (
    <div>
      <AllTimeInforPage />
      <LineChartComponent />
    </div>
  );
}