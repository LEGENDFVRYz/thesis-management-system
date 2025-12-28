import React from "react";

const primaryBg = "#730000"; // Figma primary color

export function DefaultHeader() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-t px-5 py-3" style={{ backgroundColor: primaryBg }}>
      <span className="min-w-[100px] text-sm text-white text-center">Column 1</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 2</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 3</span>
    </div>
  );
}

export function RowColumn1Header() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-t px-5 py-3" style={{ backgroundColor: primaryBg }}>
      <span className="min-w-[100px] text-sm text-white text-center">Column 1</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 2</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 3</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 4</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 5</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 6</span>
      <span className="min-w-[100px] text-sm text-white text-center">Status</span>
      <span className="min-w-[100px] text-sm text-white text-center">Actions</span>
      <span className="min-w-[100px] text-sm text-white text-center">Edit</span>
    </div>
  );
}

export function MethodologyHeader() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-t px-5 py-3" style={{ backgroundColor: primaryBg }}>
      <span className="min-w-[100px] text-sm text-white text-center">Column 1</span>
      <span className="min-w-[100px] text-sm text-white text-center">Methodology</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 3</span>
      <span className="min-w-[100px] text-sm text-white text-center">Status</span>
    </div>
  );
}

export function ScheduledHeader() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-t px-5 py-3" style={{ backgroundColor: primaryBg }}>
      <span className="min-w-[100px] text-sm text-white text-center">Column 1</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 2</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 3</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 4</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 5</span>
      <span className="min-w-[100px] text-sm text-white text-center">Status</span>
      <span className="min-w-[100px] text-sm text-white text-center">Actions</span>
    </div>
  );
}

export function RevisionHeader() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-t px-5 py-3" style={{ backgroundColor: primaryBg }}>
      <span className="min-w-[100px] text-sm text-white text-center">Column 1</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 2</span>
      <span className="min-w-[80px] text-sm text-white text-center">Version</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 4</span>
      <span className="min-w-[100px] text-sm text-white text-center">Status</span>
      <span className="min-w-[100px] text-sm text-white text-center">Preview</span>
      <span className="min-w-[100px] text-sm text-white text-center">Download</span>
    </div>
  );
}

export function GradedHeader() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-t px-5 py-3" style={{ backgroundColor: primaryBg }}>
      <span className="min-w-[100px] text-sm text-white text-center">Column 1</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 2</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 3</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 4</span>
      <span className="min-w-[100px] text-sm text-white text-center">Column 5</span>
      <span className="min-w-[100px] text-sm text-white text-center">Status</span>
      <span className="min-w-[100px] text-sm text-white text-center">Actions</span>
    </div>
  );
}
