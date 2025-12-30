import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface JournalData {
  year: number;
  journals: number;
}

interface ArchivedJournalsChartProps {
  data?: JournalData[];
}

const DEFAULT_DATA = [
  { year: 2017, journals: 100 },
  { year: 2018, journals: 125 },
  { year: 2019, journals: 180 },
  { year: 2020, journals: 150 },
  { year: 2021, journals: 200 },
  { year: 2022, journals: 250 },
  { year: 2023, journals: 300 },
  { year: 2024, journals: 320 },
  { year: 2025, journals: 360 },
];

const CustomLegend = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginBottom: "16px" }}>
    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#730000" }} />
    <span style={{ fontSize: "12px", color: "#00000099" }}>Journals</span>
  </div>
);

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { year: string } }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          border: "1px solid #730000",
        }}
      >
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#730000", marginBottom: "4px" }}>
          Year {payload[0].payload.year}
        </p>
        <p style={{ fontSize: "12px", color: "#444444" }}>
          <span style={{ color: "#730000" }}>■</span> Journals: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function ArchivedJournalsChart({
  data = DEFAULT_DATA,
}: ArchivedJournalsChartProps) {
  const chartData = data.map((item) => ({
    year: item.year.toString(),
    Journals: item.journals,
  }));

  return (
    <div
      style={{
        backgroundColor: "#FDFCF6",
        borderRadius: "12px",
        border: "1px solid #73000042",
        boxShadow: "0px 4px 12px #00000040",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#730000" }}>
          Archived Journals Trend
        </h3>
      </div>

      <CustomLegend />

      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="0" stroke="#0000001F" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#00000099", fontSize: 12 }}
            axisLine={{ stroke: "#0000001F" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#00000099", fontSize: 12 }}
            axisLine={{ stroke: "#0000001F" }}
            tickLine={false}
            domain={[0, 400]}
            ticks={[0, 100, 200, 300, 400]}
          />
          <Line type="linear" dataKey="Journals" stroke="#730000" strokeWidth={2} dot={false} />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
