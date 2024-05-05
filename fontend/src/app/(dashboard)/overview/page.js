
"use client";

import ApexBarChart from "./(component)/barchart";
import StatisticalTables from "./(component)/statistical-tables";

export default function Page() {
  return <div>
    <div className="text-md font-bold mb-4">Biểu đồ thống kê</div>
    <ApexBarChart />
    <div className="text-md font-bold mb-4">Bảng thống kê</div>
    <StatisticalTables />
    </div>;
}
