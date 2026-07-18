interface Point {
  label: string;
  value: number;
}

/** Server-rendered SVG area/line chart. No client JS, no charting dependency. */
export default function AreaChart({ data, height = 150 }: { data: Point[]; height?: number }) {
  const w = 600;
  const h = height;
  const pad = 6;
  const n = data.length;
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);

  const x = (i: number) => (n <= 1 ? pad : pad + (i * (w - pad * 2)) / (n - 1));
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)},${h - pad} L${x(0).toFixed(1)},${h - pad} Z`;

  const midLabel = data[Math.floor(n / 2)]?.label.slice(5);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-2xl font-semibold text-ink">{total}</p>
        <p className="text-xs text-slate">peak {max}/day</p>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-2 w-full"
        style={{ height }}
        preserveAspectRatio="none"
        role="img"
        aria-label="Lead trend over the last 30 days"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C6A15B" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#C6A15B" stopOpacity="0" />
          </linearGradient>
        </defs>
        {total > 0 && <path d={area} fill="url(#areaFill)" />}
        <path
          d={line}
          fill="none"
          stroke="#A6813C"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate">
        <span>{data[0]?.label.slice(5)}</span>
        <span>{midLabel}</span>
        <span>{data[n - 1]?.label.slice(5)}</span>
      </div>
      {total === 0 && <p className="mt-1 text-center text-xs text-slate">No enquiries in this period yet</p>}
    </div>
  );
}
