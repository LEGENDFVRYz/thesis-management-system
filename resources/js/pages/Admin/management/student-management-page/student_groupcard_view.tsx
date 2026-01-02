import { GroupCard } from '@/components/ui/card';
import { GroupData } from './student_interface';

interface GroupCardViewProps {
  groups: GroupData[];
  onViewGroup: (group: GroupData) => void;
}

export function GroupCardView({ groups, onViewGroup }: GroupCardViewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
      {groups.map((group, index) => (
        <GroupCard
          key={`${group.groupCode}-${index}`}
          groupCode={group.groupCode}
          groupDescription={`${group.block} | ${group.specialization}`}
          thesisTitle={group.thesisTitle}
          thesisStage={group.thesisStage}
          members={group.members}
          adviserName={group.adviser}
          onViewGroup={() => onViewGroup(group)}
        />
      ))}
    </div>
  );
}