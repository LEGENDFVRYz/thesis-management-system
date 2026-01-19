// pages/compare.tsx
import ThesisIcon from '@/components/Icons/thesis_icon.svg';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ThesisManagementLayout from '@/pages/Student/management/thesis-management/index';
import type { BreadcrumbItem, PageHeaderProps } from '@/types';
import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { ThesisTabs } from './components/thesis-tabs';

const COMPARE_VERSIONS = [
    { value: 'v1', label: 'v1 - December 19, 2025' },
    { value: 'v2', label: 'v2 - December 20, 2025' },
    { value: 'v3', label: 'v3 - December 30, 2025' },
];

const pageHeader: PageHeaderProps = {
    title: 'Thesis Management',
    subtitle: 'Access and manage your thesis documents',
    icon: <img src={ThesisIcon} alt="Thesis Icon" className="h-8 w-8" />,
};

export default function ThesisCompare() {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Compare', href: '#' }];

    return (
        <ThesisManagementLayout
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <Head title="Thesis Compare" />
            <ThesisTabs activeTab="compare" />

            <div
                className="-mt-[16px] rounded-tr-xl rounded-b-xl bg-white p-6"
                style={{
                    border: '1px solid #73000042',
                    boxShadow: '0 8px 24px #00000040',
                }}
            >
                <h2 className="mb-6 text-3xl font-medium text-[#730000]">
                    Compare Documents
                </h2>

                <div className="space-y-6">
                    {/* Document Title Input */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Document Title
                        </label>
                        <Input
                            type="text"
                            placeholder="Document Title"
                            inputSize="full"
                            className="placeholder:text-gray-500"
                        />
                    </div>

                    {/* Version Selects */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Select Version
                            </label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Version" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPARE_VERSIONS.map((version) => (
                                        <SelectItem
                                            key={version.value}
                                            value={version.value}
                                        >
                                            {version.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Select Version
                            </label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Version" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPARE_VERSIONS.map((version) => (
                                        <SelectItem
                                            key={version.value}
                                            value={version.value}
                                        >
                                            {version.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Side-by-side Document Preview Panels */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-gray-200 bg-[#F5F5F7] p-8">
                            <div className="text-center text-gray-500">
                                <FileText className="mx-auto mb-2 h-12 w-12" />
                                <p className="text-sm">
                                    Select a version to preview
                                </p>
                            </div>
                        </div>

                        <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-gray-200 bg-[#F5F5F7] p-8">
                            <div className="text-center text-gray-500">
                                <FileText className="mx-auto mb-2 h-12 w-12" />
                                <p className="text-sm">
                                    Select a version to preview
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThesisManagementLayout>
    );
}
