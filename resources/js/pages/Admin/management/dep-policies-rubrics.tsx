import { useState } from 'react';
import { Button } from '@/components/ui/button';

// ICONS
import CloseIcon from '@/components/Icons/ic_close-Default.svg';

type RubricCategory = {
    category: string;
    weight: string;
    description: string;
    indicators: {
        name: string;
        levels: {
            insufficient: string;
            developing: string;
            proficient: string;
            advanced: string;
        };
    }[];
};

const RUBRICS_DATA: Record<string, RubricCategory> = {
    'Research & Investigation Skills': {
        category: 'Research & Investigation Skills',
        weight: '20%',
        description: 'Conduct investigations of complex engineering problems using research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of information to provide valid conclusions.',
        indicators: [
            {
                name: 'Problem Understanding',
                levels: {
                    insufficient: 'Demonstrates limited understanding of the problem or lacks awareness of key factors and background.',
                    developing: 'Partially understands the problem but may have gaps in knowledge or limited awareness of key factors and background',
                    proficient: 'Demonstrates a good understanding of the problems. Identifies key factors and background',
                    advanced: 'Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background.',
                },
            },
            {
                name: 'Research Design',
                levels: {
                    insufficient: 'Design analysis with inconsistency. Lacks attention to variables and controls.',
                    developing: 'Design analysis with some consistency but with gaps. Includes key variables and controls',
                    proficient: 'Design analysis with a clear purpose, correct variables, and controls. Ensures the method is valid and reliable.',
                    advanced: 'Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details',
                },
            },
            {
                name: 'Data Collection and Analysis',
                levels: {
                    insufficient: 'Collects and analyzes. data with limited accuracy. Fails to use appropriate tools or techniques',
                    developing: 'Collects and analyzes. data with some accuracy but with lack of consistency. Uses appropriate tools and techniques',
                    proficient: 'Collects and analyzes. data accurately. Uses appropriate tools and techniques effectively',
                    advanced: 'Collects and analyzes data thoroughly, ensuring accuracy. Display exceptional use of advanced tools and techniques',
                },
            },
        ],
    },
    'Teamwork & Leadership': {
        category: 'Teamwork & Leadership',
        weight: '20%',
        description: 'Function effectively as an individual, and as a member of leader in diverse teams and in multidisciplinary settings',
        indicators: [
            {
                name: 'Individual Contribution',
                levels: {
                    insufficient: 'Minimal contributions to team activities. Lacks initiative to fulfil responsibility',
                    developing: 'Some contributions to team activities. Shows limited initiative, need occasional guidance',
                    proficient: 'Significant contributions to team activities. Takes initiative and fulfills individual responsibilities',
                    advanced: 'Exceptional contributions to team activities. Display leadership, initiative and consistencies, fulfill individual responsibilities',
                },
            },
        ],
    },
    'Engineering Problem Analysis': {
        category: 'Engineering Problem Analysis',
        weight: '20%',
        description: 'Identify, formulate, research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences',
        indicators: [
            {
                name: 'Problem Identification',
                levels: {
                    insufficient: 'Struggles to identify or define problems. Lacks understanding of problem background',
                    developing: 'Partially identifies problems but lacks clarity or precision. Shows limited understanding of problem background',
                    proficient: 'Clearly identifies and defines problems. Demonstrates a good understanding of problem background',
                    advanced: 'Skillfully identifies and defines problems. Shows exceptional understanding of problem background',
                },
            },
            {
                name: 'Problem Formulation',
                levels: {
                    insufficient: 'Formulates problems with limited specificity or lacks focus. Does not consider relevant variables or constraints',
                    developing: 'Formulates problems with some specificity but lacks precision or may overlook certain variables or constraints',
                    proficient: 'Formulates problems with clarity and specificity. Considers relevant variables and constraints appropriately',
                    advanced: 'Formulates problems precisely and comprehensively. Identifies and incorporates all relevant variables and constraints',
                },
            },
            {
                name: 'Research Literature',
                levels: {
                    insufficient: 'Shows limited ability to research and gather relevant literature',
                    developing: 'Display some ability to research and gather relevant literature with inconsistently',
                    proficient: 'Research and gather relevant literature effectively. Shows good strength of references.',
                    advanced: 'Research and gather comprehensive literature from credible sources. Displays exceptional strength of references',
                },
            },
        ],
    },
    'Engineering Communication': {
        category: 'Engineering Communication',
        weight: '20%',
        description: 'Communicate effectively on complex engineering activities with the engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.',
        indicators: [
            {
                name: 'Technical Content Comprehension',
                levels: {
                    insufficient: 'Display limited understanding of activities. Struggles to comprehend content or terminology',
                    developing: 'Shows some understanding of activities but require clarification or explanation of content or terminology',
                    proficient: 'Displays a good understanding of activities. Comprehend content and terminology',
                    advanced: 'Displays exceptional understanding of activities. Comprehend content and terminology with ease and fluency',
                },
            },
            {
                name: 'Oral Presentation',
                levels: {
                    insufficient: 'Delivers oral presentation with limited clarity, coherence or effective use of visual aids.',
                    developing: 'Delivers oral presentation with some clarity and coherence. Uses visual aids to some extent',
                    proficient: 'Delivers oral presentation with clarity, coherence and effectiveness. Uses visual aids effectively. Display confidence in public speaking',
                    advanced: 'Delivers presentation with exceptional clarity, coherence, and effectiveness. Uses visual aids creatively and strategically. Display exceptional confidence in speaking engagement',
                },
            },
            {
                name: 'Documentation',
                levels: {
                    insufficient: 'Produces written documentation with limited clarity and organization. Lack of effective use of technical term and formatting',
                    developing: 'Produces written documentation with some clarity and organization. Uses technical term and appropriate formatting to a certain extent',
                    proficient: 'Produces written documentation with clarity, organization and coherence. Uses technical language and appropriate formatting effectively',
                    advanced: 'Produces written documentation with exceptional clarity, organization and coherence. Uses technical term and appropriate formatting with precision',
                },
            },
        ],
    },
    'Independent & Lifelong Learning': {
        category: 'Independent & Lifelong Learning',
        weight: '20%',
        description: 'Identify, formulate, research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences',
        indicators: [
            {
                name: 'Technological Change Awareness',
                levels: {
                    insufficient: 'Display limited awareness of implication of technological change. Needs understanding of emerging technologies',
                    developing: 'Shows some awareness of technological change but not consistently keep up',
                    proficient: 'Displays a good awareness of technological change and keeps up with emerging technologies.',
                    advanced: 'Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background.',
                },
            },
            {
                name: 'Independent Learning Preparation',
                levels: {
                    insufficient: 'Needs preparation and planning for independent learning. May strive to identify learning needs',
                    developing: 'Displays some preparation and planning for independent learning but not consistently identify learning needs',
                    proficient: 'Displays effective preparation and planning for independent learning. Identifies learning needs and relevant learning goals',
                    advanced: 'Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details',
                },
            },
            {
                name: 'Learning Strategies',
                levels: {
                    insufficient: 'Needs awareness of effective learning strategies. Does not utilize strategies to enhance learning or address challenges',
                    developing: 'Displays some awareness of learning strategies but not consistently use them effectively or adapt to different learning contexts',
                    proficient: 'Applies effective learning strategies to enhance learning and address challenges. Displays flexibility in adapting strategies to different learning contexts',
                    advanced: 'Applies a wide range of effective learning strategies with consistency and adaptability. Displays exceptional self-aware skills in selecting and adjusting strategies based on learning objectives and contexts',
                },
            },
            {
                name: 'Resource Utilization',
                levels: {
                    insufficient: 'Does not effectively utilize available resources for learning. Needs awareness of relevant resources',
                    developing: 'Utilizes some resources for learning but not fully maximize their potential certain relevant resources',
                    proficient: 'Effectively identifies and utilizes available resources for learning. Shows good creativity and seeks out additional resources',
                    advanced: 'Displays exceptional ability to identify and utilize a wide rangeof resources effectively. Shows exceptional creativity in seeking out and critically evaluating new resources',
                },
            },
            {
                name: 'Continuous Improvement',
                levels: {
                    insufficient: 'Shows resistance to feedback and limited willingness to make improvements. Does not take proactive steps to enhance skills or knowledge',
                    developing: 'Displays some openness to feedback and makes occasional upgrades. Takes limited initiative in enhancing skills or knowledge',
                    proficient: 'Shows openness to feedback and actively seeks opportunities for improvement. Takes initiative in enhancing skills or knowledge',
                    advanced: 'Embraces feedback with enthusiasm and actively seeks continuous improvement opportunities. Takes proactive and deliberate measures to enhance skills, knowledge, and professional development',
                },
            },
        ],
    },
};

interface DefensePoliciesRubricsProps {
    category: string;
    onClose: () => void;
    onUpdate?: (oldCategory: string, newCategory: string, newWeight: string) => void;
}

export default function DefensePoliciesRubrics({ category, onClose, onUpdate }: DefensePoliciesRubricsProps) {
    const rubric = RUBRICS_DATA[category];
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [editableRubric, setEditableRubric] = useState<RubricCategory | null>(rubric);
    const [editingCell, setEditingCell] = useState<{ indicatorIdx: number; field: string } | null>(null);
    const [editValue, setEditValue] = useState('');

    if (!rubric) return null;

    const handleRatingChange = (indicatorName: string, rating: number) => {
        setRatings(prev => ({ ...prev, [indicatorName]: rating }));
    };

    const handleDoubleClick = (indicatorIdx: number, field: string, currentValue: string) => {
        setEditingCell({ indicatorIdx, field });
        setEditValue(currentValue);
    };

    const handleEditComplete = () => {
        if (!editingCell || !editableRubric) return;

        const { indicatorIdx, field } = editingCell;
        const updatedRubric = { ...editableRubric };

        if (indicatorIdx === -1) {
            // Editing category, weight, or description
            if (field === 'category') {
                updatedRubric.category = editValue;
            } else if (field === 'weight') {
                updatedRubric.weight = editValue;
            } else if (field === 'description') {
                updatedRubric.description = editValue;
            }
        } else {
            // Editing indicator fields
            if (field === 'name') {
                updatedRubric.indicators[indicatorIdx].name = editValue;
            } else if (field === 'insufficient' || field === 'developing' || field === 'proficient' || field === 'advanced') {
                updatedRubric.indicators[indicatorIdx].levels[field] = editValue;
            }
        }

        setEditableRubric(updatedRubric);
        setEditingCell(null);
        setEditValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEditComplete();
        } else if (e.key === 'Escape') {
            setEditingCell(null);
            setEditValue('');
        }
    };

    const handleSave = () => {
        // Here you would typically save to backend
        console.log('Saving rubric:', editableRubric);

        // Update the parent component if category or weight changed
        if (editableRubric && onUpdate) {
            onUpdate(category, editableRubric.category, editableRubric.weight);
        }

        onClose();
    };

    const currentRubric = editableRubric || rubric;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
                {/* HEADER */}
                <div className="sticky top-0 bg-[#730000] text-white px-8 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-2xl font-medium">Edit Rubric</h2>
                    <img
                        src={CloseIcon}
                        className="w-6 h-6 cursor-pointer filter brightness-0 invert"
                        onClick={onClose}
                    />
                </div>

                {/* CONTENT */}
                <div className="p-8">
                    {/* CATEGORY TITLE */}
                    <h3 className="text-xl font-semibold text-[#730000] mb-2 flex items-center gap-2">
                        <span
                            className="cursor-text"
                            onDoubleClick={() => handleDoubleClick(-1, 'category', currentRubric.category)}
                        >
                            {editingCell?.indicatorIdx === -1 && editingCell?.field === 'category' ? (
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={handleEditComplete}
                                    onKeyDown={handleKeyDown}
                                    className="px-2 py-1 border border-[#730000] rounded focus:outline-none focus:ring-2 focus:ring-[#730000]"
                                    autoFocus
                                />
                            ) : (
                                currentRubric.category
                            )}
                        </span>
                        <span
                            className="cursor-text"
                            onDoubleClick={() => handleDoubleClick(-1, 'weight', currentRubric.weight)}
                        >
                            {editingCell?.indicatorIdx === -1 && editingCell?.field === 'weight' ? (
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={handleEditComplete}
                                    onKeyDown={handleKeyDown}
                                    className="w-20 px-2 py-1 border border-[#730000] rounded focus:outline-none focus:ring-2 focus:ring-[#730000]"
                                    autoFocus
                                />
                            ) : (
                                `(${currentRubric.weight})`
                            )}
                        </span>
                    </h3>

                    {/* DESCRIPTION */}
                    <p
                        className="text-gray-700 mb-6 cursor-text"
                        onDoubleClick={() => handleDoubleClick(-1, 'description', currentRubric.description)}
                    >
                        {editingCell?.indicatorIdx === -1 && editingCell?.field === 'description' ? (
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleEditComplete}
                                onKeyDown={handleKeyDown}
                                className="w-full px-2 py-1 border border-[#730000] rounded focus:outline-none focus:ring-2 focus:ring-[#730000] resize-none"
                                rows={3}
                                autoFocus
                            />
                        ) : (
                            currentRubric.description
                        )}
                    </p>

                    {/* RUBRIC TABLE */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-[#730000] text-white">
                                <tr>
                                    <th className="px-4 py-3 text-center text-base font-medium border-r border-white/20">
                                        Performance<br />Indicator
                                    </th>
                                    <th className="px-4 py-3 text-center text-base font-medium border-r border-white/20">
                                        1<br />Insufficient
                                    </th>
                                    <th className="px-4 py-3 text-center text-base font-medium border-r border-white/20">
                                        2<br />Developing
                                    </th>
                                    <th className="px-4 py-3 text-center text-base font-medium border-r border-white/20">
                                        3<br />Proficient
                                    </th>
                                    <th className="px-4 py-3 text-center text-base font-medium border-r border-white/20">
                                        4<br />Advanced
                                    </th>
                                    <th className="px-4 py-3 text-center text-base font-medium bg-[#D9D9D9] text-gray-700">
                                        Rating
                                    </th>
                                </tr>
                                <tr className="bg-[#D9D9D9] text-gray-700 text-xs">
                                    <th className="px-4 py-2"></th>
                                    <th className="px-4 py-2 text-center">1</th>
                                    <th className="px-4 py-2 text-center">2</th>
                                    <th className="px-4 py-2 text-center">3</th>
                                    <th className="px-4 py-2 text-center">4</th>
                                    <th className="px-4 py-2 text-center flex justify-around">
                                        <span>1</span>
                                        <span>2</span>
                                        <span>3</span>
                                        <span>4</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRubric.indicators.map((indicator, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td
                                            className="px-4 py-4 font-semibold text-gray-900 bg-gray-50 border-r cursor-text"
                                            onDoubleClick={() => handleDoubleClick(idx, 'name', indicator.name)}
                                        >
                                            {editingCell?.indicatorIdx === idx && editingCell?.field === 'name' ? (
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleEditComplete}
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full px-2 py-1 border border-[#730000] rounded focus:outline-none focus:ring-2 focus:ring-[#730000]"
                                                    autoFocus
                                                />
                                            ) : (
                                                indicator.name
                                            )}
                                        </td>
                                        <td
                                            className="px-4 py-4 text-gray-700 bg-[#F5F5DC] border-r cursor-text"
                                            onDoubleClick={() => handleDoubleClick(idx, 'insufficient', indicator.levels.insufficient)}
                                        >
                                            {editingCell?.indicatorIdx === idx && editingCell?.field === 'insufficient' ? (
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleEditComplete}
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full px-2 py-1 border border-[#730000] rounded focus:outline-none focus:ring-2 focus:ring-[#730000] resize-none"
                                                    rows={3}
                                                    autoFocus
                                                />
                                            ) : (
                                                indicator.levels.insufficient
                                            )}
                                        </td>
                                        <td
                                            className="px-4 py-4 text-gray-700 bg-[#F5F5DC] border-r cursor-text"
                                            onDoubleClick={() => handleDoubleClick(idx, 'developing', indicator.levels.developing)}
                                        >
                                            {editingCell?.indicatorIdx === idx && editingCell?.field === 'developing' ? (
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleEditComplete}
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full px-2 py-1 border border-[#730000] rounded focus:outline-none focus:ring-2 focus:ring-[#730000] resize-none"
                                                    rows={3}
                                                    autoFocus
                                                />
                                            ) : (
                                                indicator.levels.developing
                                            )}
                                        </td>
                                        <td
                                            className="px-4 py-4 text-gray-700 bg-[#F5F5DC] border-r cursor-text"
                                            onDoubleClick={() => handleDoubleClick(idx, 'proficient', indicator.levels.proficient)}
                                        >
                                            {editingCell?.indicatorIdx === idx && editingCell?.field === 'proficient' ? (
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleEditComplete}
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full px-2 py-1 border border-[#730000] rounded focus:outline-none focus:ring-2 focus:ring-[#730000] resize-none"
                                                    rows={3}
                                                    autoFocus
                                                />
                                            ) : (
                                                indicator.levels.proficient
                                            )}
                                        </td>
                                        <td
                                            className="px-4 py-4 text-gray-700 bg-[#F5F5DC] border-r cursor-text"
                                            onDoubleClick={() => handleDoubleClick(idx, 'advanced', indicator.levels.advanced)}
                                        >
                                            {editingCell?.indicatorIdx === idx && editingCell?.field === 'advanced' ? (
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleEditComplete}
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full px-2 py-1 border border-[#730000] rounded focus:outline-none focus:ring-2 focus:ring-[#730000] resize-none"
                                                    rows={3}
                                                    autoFocus
                                                />
                                            ) : (
                                                indicator.levels.advanced
                                            )}
                                        </td>
                                        <td className="px-4 py-4 bg-[#E8E8E8]">
                                            <div className="flex justify-around items-center">
                                                {[1, 2, 3, 4].map(rating => (
                                                    <label key={rating} className="cursor-not-allowed">
                                                        <input
                                                            type="radio"
                                                            name={`rating-${idx}`}
                                                            value={rating}
                                                            checked={ratings[indicator.name] === rating}
                                                            onChange={() => handleRatingChange(indicator.name, rating)}
                                                            disabled
                                                            className="w-5 h-5 cursor-not-allowed accent-[#730000] opacity-50"
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="sticky bottom-0 bg-white border-t px-8 py-4 flex justify-end gap-3 rounded-b-xl">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex items-center gap-2 bg-[#730000] text-white hover:bg-[#5a0000]"
                    >
                        <img src={CloseIcon} className="w-4 h-4 filter brightness-0 invert" />
                        Delete
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        className="bg-[#730000] text-white hover:bg-[#5a0000]"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
