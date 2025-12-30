import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";

interface ResearchAreaChartProps {
  totalGroups?: number;
  className?: string;
}

const RAW_DATA = {
  "By Semester": {
    "Machine Learning/AI": 35,
    "IOT/ Embedded Systems": 25,
    "Web & Mobile Development": 25,
    Others: 15,
  },
};

const COLORS: Record<string, string> = {
  "Machine Learning/AI": "#9B000A",
  "IOT/ Embedded Systems": "#1C398E",
  "Web & Mobile Development": "#FFBD00",
  Others: "#717182",
};

export function ResearchAreaChart({ totalGroups, className = "" }: ResearchAreaChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const displayData = useMemo(
    () =>
      Object.entries(RAW_DATA["By Semester"]).map(([name, value]) => ({
        name,
        value,
        color: COLORS[name],
      })),
    [],
  );

  const total = totalGroups ?? displayData.reduce((sum, item) => sum + item.value, 0);
  const activeData = activeIndex !== null ? displayData[activeIndex] : null;

  return (
    <div
      className={className}
      style={{
        backgroundColor: "#FDFCF6",
        border: "1px solid #73000042",
        boxShadow: "0px 4px 12px #00000040",
        borderRadius: "0.5rem",
        width: "100%",
        maxWidth: 500,
        margin: "0 auto",
        padding: "24px",
        fontFamily: '"DM Sans", sans-serif',
      }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#730000" }}>
          Research Area Distribution
        </h3>
      </div>

      {/* Chart */}
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => {
          setActiveIndex(null);
          setMousePos(null);
        }}
      >
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
              onMouseEnter={(_, index: number) => setActiveIndex(index)}
              onMouseLeave={() => {
                setActiveIndex(null);
              }}
            >
              {displayData.map((entry) => (
                <Cell key={entry.name} fill={entry.color}/>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
            padding: "0 12px",
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: "#000000" }}>
            {activeData ? activeData.value : total}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#717182",
              lineHeight: 1.3,
              maxWidth: 120,
              whiteSpace: "normal",
              wordBreak: "break-word",
              marginTop: 4,
            }}
          >
            {activeData ? activeData.name : "Total Groups"}
          </div>
        </div>

        {/* Tooltip next to cursor */}
        {activeData && mousePos && (
          <div
            style={{
              position: "fixed",
              top: mousePos.y + 12,
              left: mousePos.x + 12,
              pointerEvents: "none",
              background: "#fff",
              border: `1px solid #730000`,
              borderRadius: 8,
              padding: "8px 12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontSize: 12,
              color: "#730000",
              zIndex: 10000,
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{activeData.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: activeData.color, fontSize: 14 }}>●</span>
              <span style={{color: "#4b5563"}}>Groups: {activeData.value}</span>
            </div>
            <div style={{ color: "#6b7280", marginTop: 2 }}>
              {((activeData.value / total) * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 8,
          fontSize: 12,
          width: "100%",
        }}
      >
        {displayData.map((item) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8, wordBreak: "break-word" }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#000000" }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}