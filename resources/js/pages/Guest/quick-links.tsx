import { UserCircle, FileText } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function QuickLinks() {
    return (
        <div
            className="p-6"
            style={{
                borderRadius: '8px',
                border: '1px solid rgba(115, 0, 0, 0.26)',
                background: '#FDFCF6',
                boxShadow: '0 0.5px 1.75px 0 rgba(0, 0, 0, 0.04), 0 1.85px 6.25px 0 rgba(0, 0, 0, 0.25)'
            }}
        >
            <div className="grid grid-cols-2 gap-6">
                <button className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center border-2 border-primary">
                        <UserCircle className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-primary font-bold font-['DM_Sans']">Login</span>
                </button>
                <Link href="/guest/repository" className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center border-2 border-primary">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-primary font-bold font-['DM_Sans']">Repository</span>
                </Link>
            </div>
        </div>
    );
}
