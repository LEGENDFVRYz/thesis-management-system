import { useState } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"

interface ManageArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccessLevel {
  role: string;
  view: boolean;
  update: boolean;
  delete: boolean;
  viewDisabled?: boolean;
  updateDisabled?: boolean;
  deleteDisabled?: boolean;
}

export default function ManageArchiveModal({ isOpen, onClose }: ManageArchiveModalProps) {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([
    { role: "Admin", view: true, update: true, delete: true, viewDisabled: true, updateDisabled: true, deleteDisabled: true },
    { role: "Thesis Adviser", view: true, update: true, delete: false },
    { role: "Coordinator", view: false, update: false, delete: false },
    { role: "Panel Member", view: false, update: false, delete: false },
    { role: "Committee", view: true, update: false, delete: false },
    { role: "Student", view: false, update: false, delete: false },
  ]);

  const handleCheckboxChange = (index: number, field: keyof Pick<AccessLevel, "view" | "update" | "delete">) => {
    const newAccessLevels = [...accessLevels];
    newAccessLevels[index][field] = !newAccessLevels[index][field];
    setAccessLevels(newAccessLevels);
  };

  const handleSave = () => {
    console.log("Saved access levels:", accessLevels);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--background)",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--primary)",
              margin: 0,
            }}
          >
            Manage Archive Restrictions
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "16px 20px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          <p
            style={{
              color: "var(--muted-foreground)",
              marginBottom: "16px",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            Configure access permissions for different user roles in the archive system.
          </p>

          {/* Table */}
          <div
            style={{
              overflowX: "auto",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  >
                    Access Level
                  </th>
                  <th
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  >
                    View
                  </th>
                  <th
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  >
                    Update
                  </th>
                  <th
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontWeight: 600,
                      textAlign: "center",
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {accessLevels.map((level, index) => (
                  <tr
                    key={level.role}
                    style={{
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <td
                      style={{
                        fontWeight: 500,
                        textAlign: "center",
                        padding: "10px 12px",
                        color: "var(--foreground)",
                        fontSize: "14px",
                      }}
                    >
                      {level.role}
                    </td>
                    <td style={{ textAlign: "center", padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Checkbox
                          checked={level.view}
                          locked={level.viewDisabled}
                          onCheckedChange={() =>
                            handleCheckboxChange(index, "view")
                          }
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "center", padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Checkbox
                          checked={level.update}
                          locked={level.updateDisabled}
                          onCheckedChange={() =>
                            handleCheckboxChange(index, "update")
                          }
                        />
                      </div>
                    </td>
                    <td style={{ textAlign: "center", padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Checkbox
                          checked={level.delete}
                          locked={level.deleteDisabled}
                          onCheckedChange={() =>
                            handleCheckboxChange(index, "delete")
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            className="secondary-btn"
            style={{
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "8px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="primary-btn"
            style={{
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "8px",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}