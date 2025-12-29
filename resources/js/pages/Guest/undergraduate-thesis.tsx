export default function UndergraduateThesis() {
    const publicationYears = [
        { year: '2025', count: 240 },
        { year: '2024', count: 240 },
        { year: '2023', count: 240 },
        { year: '2022', count: 240 },
        { year: '2021', count: 240 },
        { year: '2020', count: 240 }
    ];

    const publicationYearsRight = [
        { year: '2019', count: 240 },
        { year: '2018', count: 240 },
        { year: '2017', count: 240 },
        { year: '2016', count: 240 },
        { year: '2015', count: 240 },
        { year: '2014', count: 240 }
    ];

    const researchAreas = [
        { name: 'Machine Learning/AI', count: 240 },
        { name: 'IOT/Embedded Systems', count: 240 },
        { name: 'Web & Mobile Development', count: 240 },
        { name: 'Machine Learning/AI', count: 240 },
        { name: 'IOT/Embedded Systems', count: 240 },
        { name: 'Web & Mobile Development', count: 240 }
    ];

    const keywords = [
        { name: 'Computer Vision', count: 240 },
        { name: 'Neural Networks', count: 240 },
        { name: 'Data Mining', count: 240 },
        { name: 'Data Analytics', count: 240 },
        { name: 'Cybersecurity', count: 240 },
        { name: 'Software Engineering', count: 240 }
    ];

    return (
        <div className="p-6" style={{
            borderRadius: '8px',
            border: '1px solid rgba(115, 0, 0, 0.26)',
            background: '#FDFCF6',
            boxShadow: '0 0.5px 1.75px 0 rgba(0, 0, 0, 0.04), 0 1.85px 6.25px 0 rgba(0, 0, 0, 0.25)'
        }}>
            <h2 className="text-xl font-bold text-[#5D0000] mb-6 font-['DM_Sans'] pb-2 border-b border-[#730000]">
                Undergraduate Thesis Available
            </h2>

            <div className="grid grid-cols-3 gap-8">
                {/* Publication Year */}
                <div>
                    <h3 className="text-sm font-bold text-[#730000] mb-3 font-['DM_Sans']">Publication Year</h3>
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="space-y-1.5 text-sm font-['DM_Sans']">
                            {publicationYears.map((item, index) => (
                                <div key={index}>
                                    <a href="#" className="text-[#730000] underline hover:no-underline">
                                        {item.year}
                                    </a>
                                    <span className="text-gray-700"> ({item.count})</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1.5 text-sm font-['DM_Sans']">
                            {publicationYearsRight.map((item, index) => (
                                <div key={index}>
                                    <a href="#" className="text-[#730000] underline hover:no-underline">
                                        {item.year}
                                    </a>
                                    <span className="text-gray-700"> ({item.count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Research Area */}
                <div>
                    <h3 className="text-sm font-bold text-[#730000] mb-3 font-['DM_Sans']">Research Area</h3>
                    <div className="space-y-1.5 text-sm font-['DM_Sans']">
                        {researchAreas.map((item, index) => (
                            <div key={index}>
                                <a href="#" className="text-[#730000] underline hover:no-underline">
                                    {item.name}
                                </a>
                                <span className="text-gray-700"> ({item.count})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Keywords */}
                <div>
                    <h3 className="text-sm font-bold text-[#730000] mb-3 font-['DM_Sans']">Keywords</h3>
                    <div className="space-y-1.5 text-sm font-['DM_Sans']">
                        {keywords.map((item, index) => (
                            <div key={index}>
                                <a href="#" className="text-[#730000] underline hover:no-underline">
                                    {item.name}
                                </a>
                                <span className="text-gray-700"> ({item.count})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
