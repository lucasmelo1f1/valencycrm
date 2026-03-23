"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { ConversionRateCircle } from "@/components/dashboard/ConversionRateCircle";
import { TemporalChart } from "@/components/dashboard/TemporalChart";
import { StatusDistribution } from "@/components/dashboard/StatusDistribution";
import { AttendanceHours } from "@/components/dashboard/AttendanceHours";
import {
  metricCards,
  conversionData,
  temporalData,
  statusDistribution,
  hourDistribution,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Metric Cards — 4 columns with staggered reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal-stagger">
        {metricCards.map((card, i) => (
          <MetricCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* Temporal Chart (70%) + Conversion Rate (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 reveal-stagger">
        <TemporalChart data={temporalData} />
        <ConversionRateCircle {...conversionData} />
      </div>

      {/* Status Distribution + Attendance Hours (50/50) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 reveal-stagger">
        <StatusDistribution data={statusDistribution} />
        <AttendanceHours data={hourDistribution} total={247} />
      </div>
    </div>
  );
}
