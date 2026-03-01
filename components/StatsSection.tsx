"use client";

import { useEffect, useRef, useState } from "react";

interface CounterStat {
  value: number;
  suffix: string;
  label: string;
  colorClass: string;
}

const STATS: CounterStat[] = [
  { value: 10000, suffix: "+", label: "Customer questions answered", colorClass: "from-[#00d4ff] to-[#bf5fff]" },
  { value: 3, suffix: " min", label: "Average deployment time per business", colorClass: "from-[#bf5fff] to-[#fbbf24]" },
  { value: 24, suffix: "/7", label: "Uptime guarantee", colorClass: "from-[#00d4ff] to-[#fbbf24]" },
  { value: 2, suffix: " weeks", label: "Average time to go live", colorClass: "from-[#bf5fff] to-[#00d4ff]" },
];

function useCountUp(target: number, start: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

function StatCard({ stat, active }: { stat: CounterStat; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-6 py-8 text-center">
      <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.colorClass} bg-clip-text text-transparent mb-2`}>
        {count.toLocaleString()}
        {stat.suffix}
      </div>
      <p className="text-sm text-gray-300">{stat.label}</p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}
