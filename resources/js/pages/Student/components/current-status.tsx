import { CheckCircle2Icon, Clock, Circle } from "lucide-react";

interface StatusItem {
  title: string;
  status: "completed" | "in-progress" | "not-started";
  completedDate?: string;
  dueDate?: string;
  progress: number;
}

interface CurrentStatusProps {
  className?: string;
  items?: StatusItem[];
}

const defaultItems: StatusItem[] = [
  {
    title: "Title Proposal",
    status: "completed",
    completedDate: "Jan. 1 2026",
    progress: 100,
  },
  {
    title: "Manuscript Preparation",
    status: "completed",
    completedDate: "Jan. 1 2026",
    progress: 100,
  },
  {
    title: "Proposal Defense",
    status: "in-progress",
    dueDate: "Jan. 30, 2026",
    progress: 100,
  },
  {
    title: "Final Manuscript",
    status: "not-started",
    progress: 0,
  },
  {
    title: "Final Defense",
    status: "not-started",
    progress: 0,
  },
];

export default function CurrentStatus({
  className = "",
  items = defaultItems,
}: CurrentStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--alert-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2Icon size={20} color="white" strokeWidth={2.5}/>
          </div>
        );
      case "in-progress":
        return (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-foreground-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={20} color="white" strokeWidth={2.5} />
          </div>
        );
      default:
        return (
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--muted)",
              border: "3px solid var(--muted-foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Circle size={8} fill="var(--muted-foreground)" color="var(--muted-foreground)" />
          </div>
        );
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "completed":
        return "var(--alert-success)";
      case "in-progress":
        return "var(--primary-foreground-2)";
      default:
        return "var(--muted)";
    }
  };

  const getStatusText = (item: StatusItem) => {
    if (item.status === "completed" && item.completedDate) {
      return 'Completed: ${item.completedDate}';
    }
    if (item.status === "in-progress" && item.dueDate) {
      return 'In Progress - Due: ${item.dueDate}';
    }
    return "Not Started";
  };

  return (
    <div
      className={className}
      style={{
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--accent)",
          borderRadius: "8px",
          border: "1px solid var(--border-primary-muted)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
          padding: "24px",
        }}
      >
        {/* Header */}
        <h3
          style={{
            margin: "0 0 24px 0",
            fontSize: "24px",
            fontWeight: 600,
            color: "var(--accent-foreground)",
          }}
        >
          Current Status
        </h3>

        {/* Status Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* Icon */}
              {getStatusIcon(item.status)}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--accent-foreground)",
                    }}
                  >
                    {item.title}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {getStatusText(item)}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--accent-foreground)",
                      }}
                    >
                      {item.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    backgroundColor: "var(--border)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: '${item.progress}%',
                      height: "100%",
                      backgroundColor: getProgressBarColor(item.status),
                      borderRadius: "6px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}