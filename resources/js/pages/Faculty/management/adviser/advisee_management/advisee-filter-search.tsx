import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface BlockAndTagsFilterProps {
    block: string;
    onBlockChange: (block: string) => void;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    onApply: () => void;
    onReset: () => void;
}

// Default thesis stage options
const DEFAULT_THESIS_STAGES = [
    'Title Proposal',
    'Manuscript Submission',
    'DP1 Manuscript Revision',
];

export function BlockAndTagsFilter({
    block,
    onBlockChange,
    tags,
    onTagsChange,
    onApply,
    onReset,
}: BlockAndTagsFilterProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const blockOptions = ['BSCPE 3-3', 'BSCPE 4-3'];

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

    return (
        <div className="w-full max-w-md rounded-lg bg-primary-foreground p-8 shadow-lg">
            <h2 className="mb-3 text-2xl font-bold text-primary">
                Apply Filters
            </h2>
            <div className="my-4 border-t" />

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

            {/* Removable Tags */}
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
                                className="rounded-full p-0.5 transition-colors hover:bg-primary/10"
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
