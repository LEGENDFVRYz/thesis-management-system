import { Calendar, Clock, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

interface PanelMember {
  name: string;
  initials: string;
}   

interface DefenseScheduleProps {
  className?: string;
  date?: string;
  time?: string;
  room?: string;
  panelMembers?: PanelMember[];
}

export default function DefenseSchedule({
  className = "",
  date = "February 15, 2026",
  time = "2:00 PM - 4:00 PM",
  room = "CPE Lab 311",
  panelMembers = [
    { name: "Dr. Robert Chen", initials: "RC" },
    { name: "Dr. Robert Chen", initials: "RC" },
    { name: "Dr. Robert Chen", initials: "RC" },
  ],
}: DefenseScheduleProps) {
  return (
    <div className={className} style={{ width: "617px", maxWidth: "100%" }}>
      {/* Outer Card Container */}
      <Card 
        className="border" 
        style={{ 
          backgroundColor: "var(--accent)",
          borderColor: "var(--border-primary-muted)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px"
        }}
      >
        {/* Header */}
        <div style={{ padding: "1px 24px 1px 24px" }}>
          <h3 
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--primary)",
            }}
          >
            Defense Schedule
          </h3>
        </div>

        {/* Inner Card */}
        <div style={{ padding: "0 24px 24px 24px", display: "flex", flexDirection: "column" }}>
          <Card 
            className="border-none text-primary-foreground"
            style={{ 
              backgroundColor: "var(--sidebar-gradient-mid",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px"
            }}
          >
            <CardHeader style={{ paddingBottom: "12px" }}>
              <CardTitle className="text-white" style={{ fontSize: "18px", fontWeight: 600 }}>
                Time and Location
              </CardTitle>
            </CardHeader>
            
            <CardContent style={{ display: "flex", flexDirection: "column", paddingTop: 0 }}>
              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-3" style={{ marginBottom: "20px" }}>
                {/* Date */}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="rounded-full flex items-center justify-center" 
                    style={{ 
                      width: "48px",
                      height: "48px",
                      backgroundColor: "var(--primary-foreground-2)" 
                    }}
                  >
                    <Calendar size={24} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-sm">Date</span>
                  <span className="text-sm text-center">{date}</span>
                </div>

                {/* Time */}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="rounded-full flex items-center justify-center" 
                    style={{ 
                      width: "48px",
                      height: "48px",
                      backgroundColor: "var(--primary-foreground-2)" 
                    }}
                  >
                    <Clock size={24} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-sm">Time</span>
                  <span className="text-sm text-center">{time}</span>
                </div>

                {/* Room */}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="rounded-full flex items-center justify-center" 
                    style={{ 
                      width: "48px",
                      height: "48px",
                      backgroundColor: "var(--primary-foreground-2)" 
                    }}
                  >
                    <Home size={24} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-sm">Room</span>
                  <span className="text-sm text-center">{room}</span>
                </div>
              </div>

              {/* Panel Members */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold" style={{ fontSize: "20px", marginBottom: "12px" }}>
                  Panel Members
                </h4>
                <div className="space-y-3">
                  {panelMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        padding: "12px 16px"
                      }}
                    >
                      <Avatar>
                        <div 
                          className="rounded-full flex items-center justify-center font-semibold" 
                          style={{ 
                            width: "40px",
                            height: "40px",
                            backgroundColor: "var(--primary-foreground-2)",
                            color: "white",
                            fontSize: "14px"
                          }}
                        >
                          {member.initials}
                        </div>
                      </Avatar>
                      <span className="font-medium" style={{ fontSize: "16px" }}>
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>
  );
}