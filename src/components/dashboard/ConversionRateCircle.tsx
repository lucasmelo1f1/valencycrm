"use client";

import { useAnimatedValue, useCountUp, useSpotlight } from "@/lib/hooks";

interface ConversionRateCircleProps {
  rate: number;
  contracts: number;
  qualified: number;
}

export function ConversionRateCircle({ rate, contracts, qualified }: ConversionRateCircleProps) {
  const radius = 58;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const animatedRate = useAnimatedValue(rate, 1400, 400, 1);
  const animatedContracts = useCountUp(contracts, 1000, 600);
  const animatedQualified = useCountUp(qualified, 1000, 700);
  const { ref, handleMouseMove } = useSpotlight();

  const offset = circumference - (animatedRate / 100) * circumference;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="spotlight-card shimmer-border glass-card p-5"
    >
      <div className="relative z-[2]">
        <h3 className="text-base font-serif font-semibold text-v-text-primary">
          Taxa de <em className="italic">Conversão</em>
        </h3>
        <p className="text-xs text-v-text-muted mt-0.5 mb-4">Performance atual</p>

        <div className="flex flex-col items-center">
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r={radius}
                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
              />
              <circle
                cx="70" cy="70" r={radius}
                fill="none" stroke="#10B981" strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-v-accent font-mono">
                {animatedRate.toFixed(1)}%
              </span>
              <span className="label-meta mt-1">conversão</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-v-accent" />
              <span className="text-xs text-v-text-secondary">
                <span className="font-mono font-bold text-v-text-primary">{animatedContracts}</span> contratos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-v-amber" />
              <span className="text-xs text-v-text-secondary">
                <span className="font-mono font-bold text-v-text-primary">{animatedQualified}</span> qualificados
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
