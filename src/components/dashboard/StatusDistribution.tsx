"use client";

import { useEffect, useState } from "react";
import { useSpotlight } from "@/lib/hooks";
import { StatusDistributionItem } from "@/types";

interface StatusDistributionProps {
  data: StatusDistributionItem[];
}

export function StatusDistribution({ data }: StatusDistributionProps) {
  const maxCount = Math.max(...data.map((d) => d.count));
  const [animate, setAnimate] = useState(false);
  const { ref, handleMouseMove } = useSpotlight();

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className="spotlight-card glass-card p-5">
      <div className="relative z-[2]">
        <h3 className="text-base font-serif font-semibold text-v-text-primary">
          Distribuição por <em className="italic">Status</em>
        </h3>
        <p className="text-xs text-v-text-muted mt-0.5 mb-5">Leads em cada estágio do funil</p>

        <div className="space-y-3.5">
          {data.map((item, i) => (
            <div key={item.status} className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 w-40 flex-shrink-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-v-text-secondary truncate">{item.status}</span>
              </div>
              <div className="flex-1 h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: animate ? `${(item.count / maxCount) * 100}%` : "0%",
                    backgroundColor: item.color,
                    transition: `width 800ms cubic-bezier(0.4, 0, 0.2, 1) ${i * 80}ms`,
                  }}
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-mono font-bold text-v-text-primary w-6 text-right">
                  {item.count}
                </span>
                <span className="text-xs text-v-text-muted w-12 text-right font-mono">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
