import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { SwitchButton } from "./ui/switch-button";
import { useState } from "react";

interface PerformanceOverviewChartProps {
  onViewChange?: (view: "By Semester" | "By Year") => void;
}

const COLORS = {
  passed: "#0D542B",
  failed: "#9B000A",
};

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
  payload: { name: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #730000",
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, color: "#730000", margin: "0 0 4px 0" }}>
          {payload[0].payload.name}
        </p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <p key={index} style={{ fontSize: 12, color: "#444444", margin: "2px 0" }}>
            <span style={{ color: entry.color }}>■</span> {entry.name}: {entry.value}
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
      alignItems: "center",
      justifyContent: "flex-start",
      gap: "16px",
      marginTop: "16px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: 12, height: 12, borderRadius: "9999px", backgroundColor: COLORS.passed }} />
      <span style={{ fontSize: 13, color: "#000000" }}>Passed</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: 12, height: 12, borderRadius: "9999px", backgroundColor: COLORS.failed }} />
      <span style={{ fontSize: 13, color: "#000000" }}>Failed</span>
    </div>
  </div>
);

export function PerformanceOverviewChart({ onViewChange }: PerformanceOverviewChartProps) {
  const [view, setView] = useState<"By Semester" | "By Year">("By Semester");

  // Sample data (can be replaced with actual data)
  const chartData =
    view === "By Semester"
      ? [
          { name: "MOR", Passed: 170, Failed: 10 },
          { name: "DP1", Passed: 155, Failed: 5 },
          { name: "DP2", Passed: 155, Failed: 15 },
        ]
      : [
          { name: "3rd Year", Passed: 170, Failed: 10 },
          { name: "4th Year", Passed: 310, Failed: 20 },
        ];
        

  const handleViewChange = (newView: string) => {
    setView(newView as "By Semester" | "By Year");
    onViewChange?.(newView as "By Semester" | "By Year");
  };

  return (
    <div
      style={{
        backgroundColor: "#FDFCF6",
        borderRadius: "0.5rem",
        border: "1px solid #73000042",
        boxShadow: "0px 4px 12px #00000040",
        padding: "24px",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#730000", textAlign: "left" }}>
          Performance Overview
        </h3>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", maxWidth: "240px" }}>
          <SwitchButton option1="By Semester" option2="By Year" value={view} onChange={handleViewChange} />
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="0" stroke="#0000001F" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#00000099", fontSize: 12 }} axisLine={{ stroke: "#0000001F" }} tickLine={false} />
          <YAxis tick={{ fill: "#00000099", fontSize: 12 }} axisLine={{ stroke: "#0000001F" }} tickLine={false} />
          <Bar dataKey="Passed" stackId="a" fill={COLORS.passed} radius={[0, 0, 0, 0]} style={{ cursor: "pointer" }} />
          <Bar dataKey="Failed" stackId="a" fill={COLORS.failed} radius={[4, 4, 0, 0]} style={{ cursor: "pointer" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <CustomLegend />
    </div>
  );
}