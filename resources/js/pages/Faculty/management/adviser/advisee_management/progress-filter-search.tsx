import { badgesRegistry, type BadgeName } from '@/components/badges-registry';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';

interface BlockAndTagsFilterProps {
    block: string;
    onBlockChange: (block: string) => void;
    tags: string[];
    onTagsChange: Dispatch<SetStateAction<string[]>>;
    statusTags: number[];
    onStatusTagsChange: Dispatch<SetStateAction<number[]>>;
    searchTerm: string;
    onSearchTermChange: Dispatch<SetStateAction<string>>;
    onApply: () => void;
    onReset: () => void;
}

// Default thesis stage options for Progress Monitoring
const DEFAULT_THESIS_STAGES = [
    'Title Proposal',
    'Manuscript Submission',
    'DP1 Manuscript Revision',
];

const getStatusBadgeComponent = (status: number) => {
    const statusMap: Record<number, BadgeName> = {
        0: 'statusBadgePendingReview',
        1: 'statusBadgeApproved',
        2: 'statusBadgeDenied',
    };
    const badgeName = statusMap[status] || 'statusBadgePendingReview';
    const BadgeComponent = badgesRegistry[badgeName];
    return <BadgeComponent />;
};

export function BlockAndTagsFilter({
    block,
    onBlockChange,
    tags,
    onTagsChange,
    statusTags,
    onStatusTagsChange,
    searchTerm,
    onSearchTermChange,
    onApply,
    onReset,
}: BlockAndTagsFilterProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const blockOptions = ['BSCPE 3-3', 'BSCPE 4-3'];

    // Tag handlers
    const handleRemoveTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((t) => t !== tagToRemove));
    };

    const handleAddTag = (stage: string) => {
        if (!tags.includes(stage)) {
            onTagsChange([...tags, stage]);
        }
        setShowDropdown(false);
    };

    // Get available stages (not already selected)
    const availableStages = DEFAULT_THESIS_STAGES.filter(
        (stage) => !tags.includes(stage),
    );

    const toggleStatusTag = (status: number) => {
        if (statusTags.includes(status)) {
            onStatusTagsChange(statusTags.filter((s) => s !== status));
        } else {
            onStatusTagsChange([...statusTags, status]);
        }
    };

    return (
        <div className="w-full max-w-md rounded-lg bg-primary-foreground p-8 shadow-lg">
            <h2 className="mb-3 text-2xl font-bold text-primary">
                Apply Filters
            </h2>
            <div className="my-4 border-t" />

            {/* Search Input */}
            <div className="mb-6">
                <label className="font-medium">Search</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    placeholder="Search by keyword, title, or student..."
                    className="mt-1 w-full rounded bg-yellow-50 p-2"
                />
            </div>

            {/* Block Dropdown */}
            <div className="mb-6">
                <label className="font-medium">Block</label>
                <select
                    value={block}
                    onChange={(e) => onBlockChange(e.target.value)}
                    className="mt-1 w-full rounded bg-yellow-50 p-2"
                >
                    <option value="">All Blocks</option>
                    {blockOptions.map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </div>

            {/* Milestone Tags */}
            <div className="mb-6">
                <label className="font-medium">Thesis Stage Tags</label>
                <div className="mt-1 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full border border-primary bg-white px-3 py-1 text-xs font-medium text-primary"
                        >
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="rounded-full p-0.5 hover:bg-primary/10"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}

                    {/* Add Tag Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-400 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-primary hover:text-primary"
                            disabled={availableStages.length === 0}
                        >
                            <Plus className="h-3 w-3" /> Add Tag
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && availableStages.length > 0 && (
                            <div className="absolute top-full left-0 z-10 mt-1 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
                                <div className="max-h-60 overflow-y-auto p-1">
                                    {availableStages.map((stage) => (
                                        <button
                                            key={stage}
                                            onClick={() => handleAddTag(stage)}
                                            className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                                        >
                                            {stage}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Tags */}
            <div className="mb-6 space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-wrap gap-2">
                    {[0, 1, 2].map((status) => (
                        <div
                            key={status}
                            onClick={() => toggleStatusTag(status)}
                            className={`cursor-pointer transition-opacity ${
                                statusTags.includes(status)
                                    ? 'opacity-100'
                                    : 'opacity-40'
                            }`}
                        >
                            {getStatusBadgeComponent(status)}
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between">
                <Button variant="tertiary" onClick={onReset}>
                    Reset
                </Button>
                <Button variant="negative" onClick={onApply}>
                    Apply
                </Button>
            </div>
        </div>
    );
}
