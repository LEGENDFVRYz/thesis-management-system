import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SwitchButton } from "./ui/switch-button";
import { useState } from "react";

interface SubmissionStatusChartProps {
  className?: string;
  onViewChange?: (view: "By Semester" | "By Year") => void;
}

const COLORS = {
  submitted: "#0D542B",
  inProgress: "#FFBD00",
  overdue: "#730000",
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
          border: "1px solid #730000",
          borderRadius: "8px",
          padding: "8px 10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            margin: "0 0 6px 0",
            fontWeight: 700,
            color: "#111827",
            fontSize: "14px",
          }}
        >
          {payload[0].payload.name}
        </p>
        {payload.map((entry, index: number) => (
          <p
            key={index}
            style={{
              margin: "2px 0",
              fontSize: "13px",
              color: "#4b5563",
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
      gap: "16px",
      marginTop: "16px",
      fontSize: "13px",
      color: "#374151",
      alignItems: "center",
    }}
  >
    {[
      { label: "Submitted", color: COLORS.submitted },
      { label: "In Progress", color: COLORS.inProgress },
      { label: "Overdue", color: COLORS.overdue },
    ].map((item) => (
      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "9999px",
            backgroundColor: item.color,
          }}
        />
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);

export function SubmissionStatusChart({
  className = "",
  onViewChange,
}: SubmissionStatusChartProps) {
  const [view, setView] = useState<"By Semester" | "By Year">("By Semester");

  const chartData =
    view === "By Semester"
      ? [
          { name: "MOR", Submitted: 145, "In Progress": 20, Overdue: 5 },
          { name: "DP1", Submitted: 135, "In Progress": 18, Overdue: 7 },
          { name: "DP2", Submitted: 130, "In Progress": 25, Overdue: 5 },
        ]
      : [
          { name: "3rd Year", Submitted: 145, "In Progress": 20, Overdue: 5 },
          { name: "4th Year", Submitted: 265, "In Progress": 43, Overdue: 12 },
        ];

  const handleViewChange = (newView: string) => {
    const v = newView as "By Semester" | "By Year";
    setView(v);
    onViewChange?.(v);
  };

  return (
    <div className={className} style={{ width: "100%", fontFamily: '"DM Sans", sans-serif' }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#730000" }}>
            Submission Status
          </h3>

          <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", maxWidth: "240px" }}>
            <SwitchButton option1="By Semester" option2="By Year" value={view} onChange={handleViewChange} />
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="25%"
            barGap={4}
          >
            <XAxis type="number" tick={{ fill: "#00000099", fontSize: 12 }} axisLine={{ stroke: "#0000001F" }} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#00000099", fontSize: 13 }} axisLine={{ stroke: "#0000001F" }} tickLine={false} />
            <Bar dataKey="Submitted" fill={COLORS.submitted} radius={[0, 4, 4, 0]} style={{ cursor: "pointer" }} barSize={15} />
            <Bar dataKey="In Progress" fill={COLORS.inProgress} radius={[0, 4, 4, 0]} style={{ cursor: "pointer" }} barSize={15} />
            <Bar dataKey="Overdue" fill={COLORS.overdue} radius={[0, 4, 4, 0]} style={{ cursor: "pointer" }} barSize={15} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <CustomLegend />
      </div>
    </div>
  );
}