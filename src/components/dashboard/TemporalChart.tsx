"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useSpotlight } from "@/lib/hooks";
import { TemporalDataPoint } from "@/types";

interface TemporalChartProps {
  data: TemporalDataPoint[];
}

const periods = ["7d", "30d", "90d", "1a"] as const;
const groupBy = ["Dia", "Semana", "Mês"] as const;

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3.5 py-2.5 shadow-2xl !rounded-input">
      <p className="text-xs font-medium text-v-text-primary mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-v-text-secondary">{entry.name}:</span>
          <span className="font-mono font-semibold text-v-text-primary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function TemporalChart({ data }: TemporalChartProps) {
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("30d");
  const [activeGroup, setActiveGroup] = useState<(typeof groupBy)[number]>("Dia");
  const { ref, handleMouseMove } = useSpotlight();

  const formattedData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "dd 'de' MMM.", { locale: ptBR }),
  }));

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className="spotlight-card glass-card p-5">
      <div className="relative z-[2]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-serif font-semibold text-v-text-primary">
              Evolução <em className="italic">Temporal</em>
            </h3>
            <p className="text-xs text-v-text-muted mt-0.5">Leads e reuniões no período</p>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="label-meta mr-2">Período</span>
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePeriod(p)}
                  className={cn(
                    "px-2.5 py-1 rounded-pill text-xs font-medium transition-all duration-200",
                    activePeriod === p
                      ? "bg-[rgba(255,255,255,0.08)] text-v-text-primary"
                      : "text-v-text-muted hover:text-v-text-secondary"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="label-meta mr-2">Agrupar por</span>
              {groupBy.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  className={cn(
                    "px-2.5 py-1 rounded-pill text-xs font-medium transition-all duration-200",
                    activeGroup === g
                      ? "bg-[rgba(255,255,255,0.08)] text-v-text-primary"
                      : "text-v-text-muted hover:text-v-text-secondary"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="reuniaoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)" }} />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#leadGradient)"
                name="Leads"
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="reunioes"
                stroke="#F59E0B"
                strokeWidth={1.5}
                fill="url(#reuniaoGradient)"
                name="Reuniões"
                animationDuration={1800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
