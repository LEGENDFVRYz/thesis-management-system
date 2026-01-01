import { Link } from '@inertiajs/react';
import { Icon } from '@/components/icon-index';
import { useState } from 'react';

export default function QuickLinks() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
                <button
                    className="flex flex-col items-center gap-3 transition-all"
                    onMouseEnter={() => setHoveredItem('login')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <Icon
                        name={hoveredItem === 'login' ? 'quicklinkPeopleHover' : 'quicklinkPeople'}
                        size={127}
                    />
                    <span className="text-primary font-bold font-['DM_Sans']">Login</span>
                </button>
                <Link
                    href="/guest/repository"
                    className="flex flex-col items-center gap-3 transition-all"
                    onMouseEnter={() => setHoveredItem('repository')}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <Icon
                        name={hoveredItem === 'repository' ? 'quicklinkRepositoryHover' : 'quicklinkRepository'}
                        size={127}
                    />
                    <span className="text-primary font-bold font-['DM_Sans']">Repository</span>
                </Link>
            </div>
        </div>
    );
}
