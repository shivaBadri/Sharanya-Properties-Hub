interface Point {
  label: string;
  value: number;
}

/** Server-rendered CSS bar chart — responsive, no client JS or dependency. */
export default function BarChart({ data, height = 150 }: { data: Point[]; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-2xl font-semibold text-ink">{total}</p>
        <p className="text-xs text-slate">across {data.length} months</p>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[10px] font-medium text-slate">{d.value > 0 ? d.value : ""}</span>
            <div
              className="w-full max-w-[40px] rounded-t bg-gradient-to-t from-gold-deep to-gold"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 0 }}
            />
            <span className="text-[10px] text-slate">{d.label}</span>
          </div>
        ))}
      </div>
      {total === 0 && <p className="mt-2 text-center text-xs text-slate">No enquiries yet</p>}
    </div>
  );
}
