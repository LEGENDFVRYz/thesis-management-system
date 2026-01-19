import React from 'react';

interface FormData {
  group_id: string;
  submitted_date: string;
  status?: string;
}

interface PendingFormsProps {
  title: string;
  data?: FormData[];
  className?: string;
  onCardClick?: (item: FormData) => void;
}

const defaultData: FormData[] = [
  { group_id: '3101', submitted_date: 'October 1, 2025' },
  { group_id: '3102', submitted_date: 'October 2, 2025' },
  { group_id: '3103', submitted_date: 'October 3, 2025' },
  { group_id: '3104', submitted_date: 'October 4, 2025' },
  { group_id: '3105', submitted_date: 'October 5, 2025' },
  { group_id: '3106', submitted_date: 'October 6, 2025' },
  { group_id: '3107', submitted_date: 'October 7, 2025' },
];

export function PendingForms({ 
  title,
  data = defaultData, 
  className = '',
  onCardClick
}: PendingFormsProps) {
  return (
    <div 
      className={`bg-accent border border-primary/20 rounded-lg shadow-[0px_0.5px_1.75px_0px_rgba(0,0,0,0.04),0px_1.85px_6.25px_0px_rgba(0,0,0,0.25)] p-6 ${className}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p 
          className="font-bold leading-normal text-primary text-title-3"
        >
          {title}
        </p>
        
        {/* Badge */}
        <div className="bg-[#730000] flex items-center justify-center px-[15px] py-0 rounded-[10px] size-[35px] relative">
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
          <p 
            className="font-medium leading-normal text-[#ffbd00] text-body-1 z-10"
          >
            {data.length}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => onCardClick?.(item)}
            className="bg-[#f3efd0] border-[0.8px] border-[rgba(0,0,0,0.1)] border-solid rounded-[14px] p-3 relative h-[100px] flex flex-col justify-between cursor-pointer transition-transform hover:scale-102 hover:shadow-lg"
          >
            {/* Group ID */}
            <p 
              className="font-medium leading-normal text-[#730000] text-title-2"
            >
              {item.group_id}
            </p>
            
            {/* Submitted Date */}
            <p 
              className="font-medium leading-normal text-[#4a5565] text-body-4"
            >
              Submitted: {item.submitted_date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}