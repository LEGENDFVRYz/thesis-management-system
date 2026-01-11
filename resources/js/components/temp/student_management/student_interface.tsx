export interface Student {
  studentNumber: string;
  name: string;
  email: string;
  groupCode: string;
  block: string;
  specialization: string;
  yearLevel: number;
  adviser: string;
  thesisTitle: string;
  hasPhoto?: boolean;
}

export interface GroupData {
  groupCode: string;
  thesisTitle: string;
  thesisStage: string;
  members: string[];
  adviser: string;
  specialization: string;
  block: string;
}

export interface FilterState {
  blocks: string[];
  specializations: string[];
}