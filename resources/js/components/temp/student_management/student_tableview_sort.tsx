//UPDATE: Used the existing sort components for student management
//Not yet working since the components do not currently support 
//onApply/onClose callbacks. Only logs to console. 

import { Sort2, Sort3 } from '@/components/filter-search';

interface TableSortWrapperProps {
  onApply: (sortOption: string) => void;
  onClose: () => void;
}

export function TableSortWrapper({ onApply, onClose }: TableSortWrapperProps) {
  return <Sort2 />;
}

interface GroupSortWrapperProps {
  onApply: (sortOption: string) => void;
  onClose: () => void;
}

export function GroupSortWrapper({ onApply, onClose }: GroupSortWrapperProps) {
  return <Sort3 />;
}