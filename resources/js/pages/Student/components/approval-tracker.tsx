import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface ApprovalItem {
  name: string;
  initials: string;
  role: string;
  status: "approved" | "pending" | "rejected";
  date: string;
}

interface ApprovalTrackerProps {
  className?: string;
  items?: ApprovalItem[];
}

const defaultItems: ApprovalItem[] = [
  {
    name: "Dr. Robert Chen",
    initials: "RC",
    role: "Committee Member",
    status: "approved",
    date: "January 1, 2026",
  },
  {
    name: "Dr. Robert Chen",
    initials: "RC",
    role: "Committee Member",
    status: "approved",
    date: "January 1, 2026",
  },
  {
    name: "Dr. Robert Chen",
    initials: "RC",
    role: "Committee Member",
    status: "approved",
    date: "January 1, 2026",
  },
  {
    name: "Dr. Robert Chen",
    initials: "RC",
    role: "Committee Member",
    status: "approved",
    date: "January 1, 2026",
  },
  {
    name: "Dr. Robert Chen",
    initials: "RC",
    role: "Committee Member",
    status: "approved",
    date: "January 1, 2026",
  },
  {
    name: "Dr. Robert Chen",
    initials: "RC",
    role: "Committee Member",
    status: "approved",
    date: "January 1, 2026",
  },
];

export default function ApprovalTracker({
  className = "",
  items = defaultItems,
}: ApprovalTrackerProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div
            style={{
              backgroundColor: "var(--alert-success)",
              color: "white",
              padding: "1px 70px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Approved
          </div>
        );
      case "pending":
        return (
          <div
            style={{
              backgroundColor: "var(--primary-foreground-2)",
              color: "var(--primary)",
              padding: "1px 70px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Pending
          </div>
        );
      case "rejected":
        return (
          <div
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "1px 70px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: "660px",
      }}
    >
      {/* Outer Card Container */}
      <Card
        className="border"
        style={{
          backgroundColor: "var(--accent)",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <h3
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "var(--primary)",
          }}
        >
          Approval Tracker Queue
        </h3>

        {/* Scrollable List Container */}
        <div
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingRight: "8px",
          }}
        >
          {items.map((item, index) => (
            <Card
              key={index}
              style={{
                backgroundColor: "white",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Top row - Avatar, Name, and Role */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Avatar>
                      <div
                        className="rounded-full flex items-center justify-center font-semibold"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "var(--evaluated-font-color)",
                          opacity: 0.5,
                          color: "white",
                          fontSize: "16px",
                        }}
                      >
                        {item.initials}
                      </div>
                    </Avatar>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--alert-success)",
                      fontWeight: 500,
                    }}
                  >
                    {item.role}
                  </div>
                </div>

                {/* Bottom row - Status Badge and Date */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>{getStatusBadge(item.status)}</div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--foreground)",
                    }}
                  >
                    {item.date}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}