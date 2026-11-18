interface IntensityMeterProps {
  score: number;
  maxScore: number;
  accentTone: 'sage' | 'lavender';
  cutoffValue?: number;
}

export function IntensityMeter({
  score,
  maxScore,
  accentTone,
  cutoffValue = 10,
}: IntensityMeterProps) {
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const cutoffPct = Math.min(100, Math.max(0, (cutoffValue / maxScore) * 100));

  const fillColor =
    accentTone === 'sage' ? 'bg-[#8FAE9B]' : 'bg-[#9E92B8]';
  const trackColor =
    accentTone === 'sage' ? 'bg-[#DCE8DF]/60' : 'bg-[#EAE5F2]/80';

  return (
    <div className="mt-4">
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#F1EDE5]">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${trackColor}`}
          style={{ width: '100%' }}
        />
        <div
          className={`relative h-full rounded-full transition-[width] duration-500 ease-out ${fillColor}`}
          style={{ width: `${pct}%` }}
        />
        <div
          aria-hidden="true"
          title={`Referência clínica de rastreamento (${cutoffValue} pontos)`}
          className="absolute inset-y-0 w-px bg-[#393833]/35"
          style={{ left: `${cutoffPct}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-[#77746D] tabular-nums">
        <span>0</span>
        <span>Referência: {cutoffValue}</span>
        <span>{maxScore}</span>
      </div>
    </div>
  );
}
