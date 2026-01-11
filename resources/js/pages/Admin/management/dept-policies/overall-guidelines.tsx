import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { LuUpload } from 'react-icons/lu';

export default function OverallGuidelinesTab() {
    
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-medium text-[#730000]" style={{ fontSize: '24px' }}>
                    Overall Guidelines
                </h2>
                <Button variant="primary" className="flex items-center gap-2">
                    <LuUpload className="w-4 h-4" />
                    Upload New Policy Guide
                </Button>
            </div>

            <div className="bg-[#5A5A5AB2] rounded-xl border p-6">
                <div className="flex flex-col gap-3">
                    <div className="relative rounded-lg bg-white border border-[#5A5A5AB2] h-80 overflow-y-auto flex items-center justify-center">
                        <PlaceholderPattern className="absolute inset-0 w-full h-full text-[#5A5A5A66] stroke-[#5A5A5A80] stroke-[1]" />
                    </div>
                </div>
            </div>
        </>
    );
}