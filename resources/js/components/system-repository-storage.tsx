import { useState } from "react";
import ManageArchiveModal from "@/components/modal/manage-archive-modal";

interface StorageData {
  used: number;
  total: number;
  legend1Used: number;
  legend2Used: number;
  archivedJournals: number;
  lastBackup: string;
}

interface SystemRepositoryStorageProps {
  className?: string;
  data?: StorageData;
}

interface TooltipData {
  label: string;
  value: string;
  color: string;
  position: number;
}

const defaultData: StorageData = {
  used: 45.01,
  total: 100,
  legend1Used: 40,
  legend2Used: 5.01,
  archivedJournals: 200005,
  lastBackup: "Today at 2:24 AM",
};

export function SystemRepositoryStorage({
  className = "",
  data = defaultData,
}: SystemRepositoryStorageProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const legend1Percentage = (data.legend1Used / data.total) * 100;
  const legend2Percentage = (data.legend2Used / data.total) * 100;
  const availablePercentage = 100 - legend1Percentage - legend2Percentage;
  const availableSpace = data.total - data.used;

  const handleBarHover = (
    label: string,
    value: number,
    color: string,
    percentage: number
  ) => {
    setTooltip({
      label,
      value: `${value.toFixed(2)} TB`,
      color,
      position: percentage,
    });
  };

  const handleBarLeave = () => {
    setTooltip(null);
  };

  return (
    <>
      <div className={`${className} w-full font-dm`}>
        <div
          style={{
            backgroundColor: "var(--accent)",
            borderRadius: "8px",
            border: "1px solid var(--primary)",
            padding: "24px",
            height: "164px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header with Stats */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            {/* Storage Info */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
              {/* Vertical separator BEFORE first stat */}
              <div
                style={{
                  width: "2px",
                  height: "48px",
                  backgroundColor: "#D1D5DB",
                }}
              />
              
              <div>
                <span
                  style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    lineHeight: 1,
                  }}
                >
                  {data.used.toFixed(2)} TB
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    color: "var(--muted-foreground)",
                    marginLeft: "8px",
                  }}
                >
                  of {data.total} TB used
                </span>
              </div>

              <div
                style={{
                  width: "2px",
                  height: "48px",
                  backgroundColor: "#D1D5DB",
                }}
              />

              <div>
                <span
                  style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    lineHeight: 1,
                  }}
                >
                  {data.archivedJournals.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    color: "var(--muted-foreground)",
                    marginLeft: "8px",
                  }}
                >
                  archived journals
                </span>
              </div>
            </div>

            {/* Backup Info - aligned to bottom */}
            <div style={{ paddingBottom: "2px" }}>
              <span
                style={{
                  fontSize: "16px",
                  color: "var(--muted-foreground)",
                }}
              >
                Last successful backup: {data.lastBackup}
              </span>
            </div>
          </div>

          {/* Storage Bar with Tooltip */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#9E9E9E",
                borderRadius: "9999px",
                overflow: "visible",
                display: "flex",
                position: "relative",
              }}
            >
              {/* Legend 1 (Yellow) */}
              <div
                onMouseEnter={() =>
                  handleBarHover("Insert Legend 1", data.legend1Used, "#FFBD00", legend1Percentage / 2)
                }
                onMouseLeave={handleBarLeave}
                style={{
                  width: `${legend1Percentage}%`,
                  height: "100%",
                  backgroundColor: "#FFBD00",
                  cursor: "pointer",
                  transition: "filter 0.2s ease",
                  borderRadius: "9999px 0 0 9999px",
                  position: "relative",
                  zIndex: 3,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              />

              {/* White separator */}
              <div
                style={{
                  width: "4px",
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "9999px",
                  position: "relative",
                  zIndex: 4,
                  marginLeft: "-2px",
                  marginRight: "-2px",
                  flexShrink: 0,
                }}
              />

              {/* Legend 2 (Maroon) */}
              <div
                onMouseEnter={() =>
                  handleBarHover("Insert Legend 2", data.legend2Used, "#730000", legend1Percentage + legend2Percentage / 2)
                }
                onMouseLeave={handleBarLeave}
                style={{
                  width: `${legend2Percentage}%`,
                  height: "100%",
                  backgroundColor: "#730000",
                  cursor: "pointer",
                  transition: "filter 0.2s ease",
                  borderRadius: "9999px",
                  position: "relative",
                  zIndex: 2,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.filter = "brightness(1.2)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              />

              {/* White separator */}
              <div
                style={{
                  width: "4px",
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "9999px",
                  position: "relative",
                  zIndex: 4,
                  marginLeft: "-2px",
                  marginRight: "-2px",
                  flexShrink: 0,
                }}
              />

              {/* Available (Gray) */}
              <div
                onMouseEnter={() =>
                  handleBarHover(
                    "Available storage remaining",
                    availableSpace,
                    "#9E9E9E",
                    legend1Percentage + legend2Percentage + availablePercentage / 2
                  )
                }
                onMouseLeave={handleBarLeave}
                style={{
                  width: `${availablePercentage}%`,
                  height: "100%",
                  backgroundColor: "#9E9E9E",
                  cursor: "pointer",
                  transition: "filter 0.2s ease",
                  borderRadius: "0 9999px 9999px 0",
                  position: "relative",
                  zIndex: 1,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.filter = "brightness(0.9)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              />
            </div>

            {/* Tooltip - Below bar, centered on segment */}
            {tooltip && (
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: `${tooltip.position}%`,
                  transform: "translateX(-50%)",
                  backgroundColor: tooltip.color === "#9E9E9E" ? "#6B6B6B" : tooltip.color,
                  color: "#FFFFFF",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "16px", marginBottom: "2px" }}>
                  {tooltip.value}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 400 }}>{tooltip.label}</div>
                {/* Arrow - attached to container */}
                <div
                  style={{
                    position: "absolute",
                    top: "-5px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderBottom: `6px solid ${tooltip.color === "#9E9E9E" ? "#6B6B6B" : tooltip.color}`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Legend and Link */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: "24px",
                fontSize: "14px",
                color: "var(--foreground)",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#FFBD00",
                  }}
                />
                <span>Insert Legend 1</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#730000",
                  }}
                />
                <span>Insert Legend 2</span>
              </div>
            </div>

            {/* Manage Link */}
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                fontSize: "16px",
                color: "#1447E6",
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#0D3BB8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#1447E6";
              }}
            >
              Manage archive restrictions
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ManageArchiveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}