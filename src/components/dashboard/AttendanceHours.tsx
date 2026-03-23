"use client";

import { useEffect, useState } from "react";
import { useCountUp, useSpotlight } from "@/lib/hooks";
import { HourDistributionItem } from "@/types";

interface AttendanceHoursProps {
  data: HourDistributionItem[];
  total: number;
}

export function AttendanceHours({ data, total }: AttendanceHoursProps) {
  const maxCount = Math.max(...data.map((d) => d.count));
  const animatedTotal = useCountUp(total, 1200, 600);
  const [animate, setAnimate] = useState(false);
  const { ref, handleMouseMove } = useSpotlight();

  const businessTotal = data.reduce((acc, d) => acc + d.count, 0);
  const percentage = total > 0 ? Math.round((businessTotal / total) * 100) : 0;

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animate ? (percentage / 100) * circumference : circumference);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className="spotlight-card glass-card p-5">
      <div className="relative z-[2]">
        <h3 className="text-base font-serif font-semibold text-v-text-primary">
          Horário de <em className="italic">Atendimento</em>
        </h3>
        <p className="text-xs text-v-text-muted mt-0.5 mb-5">Distribuição por horário comercial</p>

        <div className="flex items-center gap-8">
          {/* Donut */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle
                cx="70" cy="70" r={radius}
                fill="none" stroke="#F59E0B" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-v-text-primary font-mono">
                {animatedTotal}
              </span>
              <span className="label-meta mt-0.5">total</span>
            </div>
          </div>

          {/* Bars */}
          <div className="flex-1 space-y-2.5">
            {data.map((item, i) => (
              <div key={item.hour} className="flex items-center gap-3">
                <span className="label-meta w-14 flex-shrink-0 !text-[11px] !tracking-normal">
                  {item.hour}
                </span>
                <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-v-amber"
                    style={{
                      width: animate ? `${(item.count / maxCount) * 100}%` : "0%",
                      transition: `width 700ms cubic-bezier(0.4, 0, 0.2, 1) ${i * 60 + 600}ms`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-mono font-semibold text-v-text-secondary w-6 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
