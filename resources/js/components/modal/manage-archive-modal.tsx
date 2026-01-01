import { useState } from "react";
import { X } from "lucide-react";

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
                        <label style={{ cursor: level.viewDisabled ? "not-allowed" : "pointer" }}>
                          <input
                            type="checkbox"
                            checked={level.view}
                            disabled={level.viewDisabled}
                            onChange={() => handleCheckboxChange(index, "view")}
                            style={{ display: "none" }}
                          />
                          <div
                            onMouseEnter={(e) => {
                              if (!level.view && !level.viewDisabled) {
                                e.currentTarget.style.border = "2px solid #9ca3af";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!level.view) {
                                e.currentTarget.style.border = "2px solid black";
                              }
                            }}
                            style={{
                              width: "19px",
                              height: "19px",
                              borderRadius: "5px",
                              border: level.view ? "2px solid var(--primary)" : "2px solid black",
                              backgroundColor: level.view ? "var(--primary)" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                              opacity: level.viewDisabled ? 0.5 : 1,
                              cursor: level.viewDisabled ? "not-allowed" : "pointer",
                            }}
                          >
                            {level.view && (
                              <svg
                                width="12"
                                height="9"
                                viewBox="0 0 12 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 4.5L4.5 8L11 1"
                                  stroke="#FFBD00"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </label>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <label style={{ cursor: level.updateDisabled ? "not-allowed" : "pointer" }}>
                          <input
                            type="checkbox"
                            checked={level.update}
                            disabled={level.updateDisabled}
                            onChange={() => handleCheckboxChange(index, "update")}
                            style={{ display: "none" }}
                          />
                          <div
                            onMouseEnter={(e) => {
                              if (!level.update && !level.updateDisabled) {
                                e.currentTarget.style.border = "2px solid #9ca3af";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!level.update) {
                                e.currentTarget.style.border = "2px solid black";
                              }
                            }}
                            style={{
                              width: "19px",
                              height: "19px",
                              borderRadius: "5px",
                              border: level.update ? "2px solid var(--primary)" : "2px solid black",
                              backgroundColor: level.update ? "var(--primary)" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                              opacity: level.updateDisabled ? 0.5 : 1,
                              cursor: level.updateDisabled ? "not-allowed" : "pointer",
                            }}
                          >
                            {level.update && (
                              <svg
                                width="12"
                                height="9"
                                viewBox="0 0 12 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 4.5L4.5 8L11 1"
                                  stroke="#FFBD00"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </label>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <label style={{ cursor: level.deleteDisabled ? "not-allowed" : "pointer" }}>
                          <input
                            type="checkbox"
                            checked={level.delete}
                            disabled={level.deleteDisabled}
                            onChange={() => handleCheckboxChange(index, "delete")}
                            style={{ display: "none" }}
                          />
                          <div
                            onMouseEnter={(e) => {
                              if (!level.delete && !level.deleteDisabled) {
                                e.currentTarget.style.border = "2px solid #9ca3af";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!level.delete) {
                                e.currentTarget.style.border = "2px solid black";
                              }
                            }}
                            style={{
                              width: "19px",
                              height: "19px",
                              borderRadius: "5px",
                              border: level.delete ? "2px solid var(--primary)" : "2px solid black",
                              backgroundColor: level.delete ? "var(--primary)" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                              opacity: level.deleteDisabled ? 0.5 : 1,
                              cursor: level.deleteDisabled ? "not-allowed" : "pointer",
                            }}
                          >
                            {level.delete && (
                              <svg
                                width="12"
                                height="9"
                                viewBox="0 0 12 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 4.5L4.5 8L11 1"
                                  stroke="#FFBD00"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </label>
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