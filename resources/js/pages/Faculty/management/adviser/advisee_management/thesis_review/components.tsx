import { User, FileText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// StatusBadge Component
interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const isApproved = status === "Approved";
    
    return (
        <div 
            className={`
                flex flex-row justify-center items-center
                px-2.5 py-0
                h-5 rounded-[15px] border-[0.8px]
                ${isApproved 
                    ? 'bg-[#DBFEEB] border-[#94FF8E]' 
                    : 'bg-[#FEF9C2] border-[#FEEC71]'
                }
            `}
        >
            <span 
                className={`
                    font-['Arimo'] font-normal text-[12px] leading-5
                    ${isApproved ? 'text-[#39D863]' : 'text-[#C7891E]'}
                `}
            >
                {status}
            </span>
        </div>
    );
}

// SubmissionCard Component
interface SubmissionCardProps {
    title: string;
    submittedBy: string;
    submittedDate: string;
    status: string;
    thesisTitle: string;
    onClick?: () => void;
}

export function SubmissionCard({
    title,
    submittedBy,
    status,
    thesisTitle,
    onClick
}: SubmissionCardProps) {
    return (
        <div 
            className="relative bg-white border border-[#7A7A8A] rounded-[10px] p-[18px_17px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex flex-col gap-[3px] mb-3">
                <h3 className="font-semibold text-base leading-[21px] text-primary">
                    {title}
                </h3>
                
                <div className="flex items-center gap-[6px]">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" fill="#730000"/>
                    </svg>
                    <span className="text-[13.33px] leading-[17px] font-medium text-primary">
                        {thesisTitle}
                    </span>
                </div>
            </div>

            <div className="absolute left-[20.5px] bottom-[18px] flex items-center gap-[6px]">
                <User className="w-[10px] h-[10px] text-[#8B8B98]" />
                <span className="text-[8px] leading-[10px] font-medium text-[#7A7A8A]">
                    {submittedBy}
                </span>
            </div>

            <div className="absolute right-[17px] top-[18px]">
                <StatusBadge status={status} />
            </div>
        </div>
    );
}

// CommentItem Component
interface CommentItemProps {
    author: string;
    date: string;
    text: string;
    avatar: string;
}

export function CommentItem({ author, date, text, avatar }: CommentItemProps) {
    return (
        <div className="flex gap-3 p-3 bg-white rounded border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {avatar}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">{author}</h4>
                    <span className="text-xs text-gray-500">{date}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{text}</p>
            </div>
        </div>
    );
}

// GroupInfoCard Component
interface GroupInfoCardProps {
    groupCode: string;
    thesisTitle: string;
    section: string;
    numberofMembers: string;
    numberofSubmissions: string;
    lastSubmissionDate: string;
    badge?: string;
}

export function GroupInfoCard({
    groupCode,
    thesisTitle,
    section,
    numberofMembers,
    numberofSubmissions,
    lastSubmissionDate,
    badge
}: GroupInfoCardProps) {
    return (
        <div className="relative bg-white border border-[#7A7A8A] rounded-[10px] p-[18px_17px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between mb-[3px]">
                <h2 className="text-base leading-[21px] font-semibold text-primary">
                    {groupCode}
                </h2>
                {badge && <StatusBadge status={badge} />}
            </div>
            
            <div className="flex items-center gap-[6px] mb-[3px]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                    <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" fill="#730000"/>
                </svg>
                <span className="text-[13.33px] leading-[17px] font-medium text-primary">
                    {thesisTitle}
                </span>
            </div>

            <Badge variant="outline" className="text-[8px] h-auto px-2 py-0.5 mb-[3px]">
                {section}
            </Badge>

            <div className="flex items-center gap-[6px] mt-[3px] pt-[3px] border-t border-gray-200">
                <User className="w-[10px] h-[10px] text-[#8B8B98]" />
                <span className="text-[8px] leading-[10px] font-medium text-[#7A7A8A]">
                    {numberofMembers}
                </span>
                <span className="text-[#7A7A8A] mx-0.5">•</span>
                <FileText className="w-[10px] h-[10px] text-[#8B8B98]" />
                <span className="text-[8px] leading-[10px] font-medium text-[#7A7A8A]">
                    {numberofSubmissions}
                </span>
                <span className="text-[#7A7A8A] mx-0.5">•</span>
                <Calendar className="w-[10px] h-[10px] text-[#8B8B98]" />
                <span className="text-[8px] leading-[10px] font-medium text-[#7A7A8A]">
                    Last submission: {lastSubmissionDate}
                </span>
            </div>
        </div>
    );
}