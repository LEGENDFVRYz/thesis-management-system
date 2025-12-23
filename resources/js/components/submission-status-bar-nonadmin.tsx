import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SubmissionStatusChartProps {
  className?: string;
}

const COLORS = {
  thirdYear: "#730000",
  fourthYear: "#FFBD00",
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
    payload: { name: string };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #730000", // inline from CSS block
          borderRadius: "8px",
          padding: "8px 10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            margin: "0 0 6px 0",
            fontWeight: 700,
            color: "#730000",
            fontSize: "13px",
          }}
        >
          {payload[0].payload.name}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              margin: "2px 0",
              fontSize: "12px",
              color: "#444444",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ color: entry.color, fontSize: "14px" }}>■</span>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = () => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "24px",
      marginTop: "16px",
      fontSize: "13px",
      color: "#000000",
      alignItems: "center",
      justifyContent: "flex-start",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "9999px",
          backgroundColor: COLORS.thirdYear,
        }}
      />
      <span>3rd Year</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "9999px",
          backgroundColor: COLORS.fourthYear,
        }}
      />
      <span>4th Year</span>
    </div>
  </div>
);

export function SubmissionStatusNonAdminChart({ className = "" }: SubmissionStatusChartProps) {
  const data = [
    { name: "Pending Review", "3rd Year": 180, "4th Year": 230 },
    { name: "For Revision", "3rd Year": 150, "4th Year": 130 },
    { name: "Approved", "3rd Year": 100, "4th Year": 85 },
  ];

  return (
    <div
      className={className}
      style={{
        width: "100%",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          padding: "24px",
        }}
      >
        <h3
          style={{
            margin: "0 0 24px 0",
            fontSize: "18px",
            fontWeight: 600,
            color: "#730000",
          }}
        >
          Submission Status
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="25%"
            barGap={4}
          >
            <XAxis
              type="number"
              tick={{ fill: "#00000099", fontSize: 12 }}
              axisLine={{ stroke: "#0000001F" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#00000099", fontSize: 13 }}
              axisLine={{ stroke: "#0000001F" }}
              tickLine={false}
              width={120}
            />
            <Bar dataKey="3rd Year" fill={COLORS.thirdYear} barSize={15} style={{ cursor: "pointer" }} />
            <Bar dataKey="4th Year" fill={COLORS.fourthYear} barSize={15} style={{ cursor: "pointer" }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
          </BarChart>
        </ResponsiveContainer>

        <CustomLegend />
      </div>
    </div>
  );
}