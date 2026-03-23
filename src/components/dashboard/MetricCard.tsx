"use client";

import { Users, TrendingUp, Calendar, Clock } from "lucide-react";
import { useCountUp, useAnimatedValue, useSpotlight } from "@/lib/hooks";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  Calendar: <Calendar size={20} />,
  Clock: <Clock size={20} />,
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  index: number;
}

export function MetricCard({ title, value, subtitle, icon, index }: MetricCardProps) {
  const isPercentage = typeof value === "string" && value.includes("%");
  const numericValue = typeof value === "number" ? value : parseFloat(value);
  const animatedInt = useCountUp(isPercentage ? 0 : numericValue, 1200, index * 100);
  const animatedFloat = useAnimatedValue(isPercentage ? numericValue : 0, 1200, index * 100, 1);
  const { ref, handleMouseMove } = useSpotlight();

  const displayValue = isPercentage ? `${animatedFloat.toFixed(1)}%` : animatedInt;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="spotlight-card shimmer-border glass-card p-6"
    >
      <div className="relative z-[2]">
        <div className="flex items-start justify-between mb-4">
          <span className="label-meta">{title}</span>
          <div className="p-2 rounded-card-sm bg-[rgba(255,255,255,0.04)] text-v-text-muted">
            {iconMap[icon] || <Users size={20} />}
          </div>
        </div>
        <p className="text-[2.5rem] leading-none font-bold text-v-text-primary font-mono tracking-tight">
          {displayValue}
        </p>
        <p className="text-xs text-v-text-muted mt-2 font-sans">{subtitle}</p>
      </div>
    </div>
  );
}
