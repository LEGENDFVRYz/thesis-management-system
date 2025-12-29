import AuthorIcon from '@/components/icons/author-icon';
import BookIcon from '@/components/icons/book-icon';

interface RecentProject {
    title: string;
    authors: string;
    tags: string;
    date: string;
}

interface RecentDPProps {
    projects: RecentProject[];
}

export default function RecentDP({ projects }: RecentDPProps) {
    return (
        <div className="p-6" style={{
            borderRadius: '8px',
            border: '1px solid rgba(115, 0, 0, 0.26)',
            background: '#FDFCF6',
            boxShadow: '0 0.5px 1.75px 0 rgba(0, 0, 0, 0.04), 0 1.85px 6.25px 0 rgba(0, 0, 0, 0.25)'
        }}>
            <h2 className="text-xl font-bold text-[#5D0000] mb-6 font-['DM_Sans'] pb-2 border-b border-gray-200">
                Recent Design Projects
            </h2>

            <div className="space-y-4">
                {projects.map((project, index) => (
                    <div key={index} className="pb-4 last:pb-0 border-b border-gray-200 last:border-b-0">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                {/* Title */}
                                <h3 className="text-primary hover:underline cursor-pointer font-['DM_Sans'] text-sm mb-2 leading-snug">
                                    {project.title}
                                </h3>

                                {/* Authors with icon */}
                                <div className="flex items-center gap-1.5 mb-1">
                                    <AuthorIcon className="w-3 h-3 flex-shrink-0" />
                                    <p className="text-xs text-gray-600 font-['DM_Sans']">
                                        {project.authors}
                                    </p>
                                </div>

                                {/* Tags with icon */}
                                <div className="flex items-center gap-1.5">
                                    <BookIcon className="w-3 h-3 flex-shrink-0" />
                                    <p className="text-xs text-gray-500 font-['DM_Sans']">
                                        {project.tags}
                                    </p>
                                </div>
                            </div>

                            {/* Date */}
                            <span className="text-sm text-gray-600 font-['DM_Sans'] whitespace-nowrap">
                                {project.date}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-200">
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded font-['DM_Sans'] transition-colors">
                    ← Previous
                </button>
                <button className="px-3 py-1 text-sm bg-primary text-white rounded font-['DM_Sans']">1</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded font-['DM_Sans'] transition-colors">2</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded font-['DM_Sans'] transition-colors">3</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded font-['DM_Sans'] transition-colors">4</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded font-['DM_Sans'] transition-colors">5</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded font-['DM_Sans'] transition-colors">
                    Next →
                </button>
            </div>
        </div>
    );
}
