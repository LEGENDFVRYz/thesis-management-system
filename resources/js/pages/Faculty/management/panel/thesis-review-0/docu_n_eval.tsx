import { badgesRegistry } from '@/components/badges-registry';
import DocumentPreview from '@/components/document-preview';
import { iconRegistry } from '@/components/icons-registry';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { grading } from '@/routes/faculty/panel/evaluation';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, Users } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Tabs } from './doc_n_eval_tabs';
import { ConfirmDialog } from './modals-components';
import { RubricTable } from './rubric-table';
import { SuccessDialog } from './success-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Review and Evaluation',
        href: grading().url,
    },
];

const CompletedBadge = badgesRegistry.scheduledBadgesCompleted;
const BackIcon = iconRegistry.backDefault;

export default function Dashboard() {
    const [isSaveDraftOpen, setIsSaveDraftOpen] = useState(false);
    const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
    const [isSubmitCommentOpen, setIsSubmitCommentOpen] = useState(false);
    const [isSubmitGradesOpen, setIsSubmitGradesOpen] = useState(false);

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = () => {
        console.log('Grades submitted');

        setIsSubmitGradesOpen(false);
        setSuccessMessage('Grades submitted successfully.');
        setIsSuccessOpen(true);
    };

    const handleSaveDraft = () => {
        // save as draft logic
        console.log('Draft saved');

        setIsSaveDraftOpen(false);
        setSuccessMessage('Draft saved successfully.');
        setIsSuccessOpen(true);
    };

    const handleAddComment = () => {
        // add comment logic
        console.log('Comment saved');
        setIsAddCommentOpen(false);
        setSuccessMessage('Comment submitted successfully.');
        setIsSuccessOpen(true);
    };
    const handleSubmitComment = () => {
        console.log('Comment submitted');

        setIsSubmitCommentOpen(false);
        setSuccessMessage('Comment submitted successfully.');
        setIsSuccessOpen(true);
    };

    const [activeTab, setActiveTab] = useState('Documentation');

    const [selectedDoc, setSelectedDoc] = useState({
        title: 'BSCPE_4-3_DP1_Manuscript.pdf',
        url: '',
    });

    const documents = [
        {
            title: 'BSCPE_4-3_DP1_Manuscript.pdf',
            url: '',
            size: '2.4 MB',
            version: 'v3',
        },
        {
            title: 'BSCPE_4-3_Title_Proposal.pdf',
            url: '',
            size: '856 KB',
            version: 'v1',
        },
    ];

    const defenseDetails = {
        id: 'DEF-001',
        status: 'Completed',
        block: 'BSCPE 3-3',
        venue: 'Room 313, CEA',
        time: '09:00 AM',
        adviser: 'Dr. Maria Santos',
        date: '11/25/2025',
        proponents: ['John Doe', 'Jane Smith', 'Mike Johnson', 'John Doe'],
        panelists: [
            { id: 'P1', name: 'Dr. Robert Chen' },
            { id: 'P2', name: 'Dr. Sofia Smith' },
            { id: 'P3', name: 'Engr. John Johnson' },
        ],
    };

    const tabLabels = ['Documentation', 'Evaluation'];
    const [selectedDecision, setSelectedDecision] = useState<string | null>(
        null,
    );

    // ================== Rubric Data ==================
    const rubric1Rows = [
        {
            indicator: 'Problem Understanding',
            columns: [
                'Demonstrates limited understanding of the problem or lacks awareness of key factors and background.',
                'Partially understands the problem but may have gaps in knowledge or limited awareness of key factors and background',
                'Demonstrates a good understanding of problems. Identifies key factors and background',
                'Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background.',
            ],
        },
        {
            indicator: 'Research Design',
            columns: [
                'Design analysis with inconsistency. Lacks attention to variables and controls.',
                'Design analysis with some consistency but with gaps. Includes key variables and controls',
                'Design analysis with a clear purpose, correct variables, and controls. Ensures the method is valid and reliable.',
                'Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details',
            ],
        },
        {
            indicator: 'Data Collection and Analysis',
            columns: [
                'Collects and analyzes data with limited accuracy. Fails to use appropriate tools or techniques',
                'Collects and analyzes data with some accuracy but with lack of consistency. Uses appropriate tools and techniques',
                'Collects and analyzes data accurately. Uses appropriate tools and techniques effectively',
                'Collects and analyzes data thoroughly, ensuring accuracy. Display exceptional use of advanced tools and techniques',
            ],
        },
    ];

    const rubric2Rows = [
        {
            indicator: 'Individual Contribution',
            columns: [
                'Minimal contributions to team activities. Lacks initiative to fulfil responsibility',
                'Some contributions to team activities. Shows limited initiative, need occasional guidance',
                'Significant contributions to team activities. Takes initiative and fulfills',
                'Exceptional contributions to team activities. Display leadership, initiative and consistencies, fulfill individual responsibilities',
            ],
        },
    ];
    const rubric3Rows = [
        {
            indicator: 'Problem Identification',
            columns: [
                'Struggles to identify or define problems. Lacks  understanding of problem background',
                'Partially identifiesproblems but lacks clarity or precision. Shows limited understanding of problem background',
                'Clearly identifies anddefines problems. Demonstrates a good  understanding of problem background',
                'Skillfully identifies and defines problems. Shows exceptional  understanding of problem background',
            ],
        },
        {
            indicator: 'Problem Formulation',
            columns: [
                'Formulates problemswith limited specificity  or lacks focus. Does not  consider relevant variables or constraints',
                'Formulates problems with some specificity but lacks precision or may overlook certain variables or constraints',
                'Formulates problems with clarity and specificity. Considers  relevant variables and  constraints appropriately',
                'Formulates problems precisely and comprehensively. Identifies and incorporates all  relevant variables and constraints',
            ],
        },
        {
            indicator: 'Research Literature',
            columns: [
                'Shows limited ability to research and gather relevant literature',
                'Display some ability to research and gather literature with inconsistently',
                'Research and gather relevant literature effectively. Shows good  strength of references.Formulates problems with clarity and specificity. Considers  relevant variables and  constraints appropriately',
                'Research and gather comprehensive literature from  credible sources. Displays  exceptional strength of references',
            ],
        },
    ];
    const rubric4Rows = [
        {
            indicator: 'Technical Content Comprehension',
            columns: [
                'Display limited understanding of activities. Struggles to  comprehend content or  terminology',
                'Shows some understanding of activities but require clarification or explanation of content  or terminology',
                'Displays a good understanding of activities. Comprehend  content and terminology',
                'Displays exceptional understanding of activities.  Comprehend content and terminology with ease and  fluency',
            ],
        },
        {
            indicator: 'Oral Presentation',
            columns: [
                'Delivers oral presentation with limited clarity, coherence or effective  use of visual aids.',
                'Delivers oralpresentation with some  clarity and coherence.  Uses visual aids to some  extent',
                'Delivers oral presentation with clarity,  coherence and effectiveness. Uses visual aids effectively.  Display confidence in public speaking',
                'Delivers presentation with exceptional clarity, coherence,  and effectiveness. Uses visual  aids creatively and strategically.  Display exceptional confidence  in speaking engagement',
            ],
        },
        {
            indicator: 'Documentation',
            columns: [
                'Produces written documentation with limited clarity and organization. Lack of effective use of technical  term and formatting',
                'Produces written documentation with some clarity and organization, Uses technical term and appropriate formatting  to a certain extent',
                'Produces written documentation with clarity, organization and  coherence. Uses technical language and  appropriate formatting  effectively',
                'Produces written documentation with exceptional clarity, organization and coherence.  Uses technical term and appropriate formatting with  precision',
            ],
        },
    ];
    const rubric5Rows = [
        {
            indicator: 'Technological Change Awareness',
            columns: [
                'Display limited awareness of implication  of technological change.  Needs understanding of  emerging technologies',
                'Shows some awareness of technological change  but not consistently keep up',
                'Displays a good awareness of technological change and keeps up with emerging technologies.',
                'Demonstrates a broad understanding of the problem.  Identifies all significant factors and demonstrates exceptional awareness of background.',
            ],
        },
        {
            indicator: 'Independent Learning Preparation',
            columns: [
                'Needs preparation and planning for independent learning.  May strive to identify learning needs',
                'Displays somepreparation and planning for independent learning  but not consistently identify learning needs',
                'Displays effective preparation and planning for independent learning.  Identifies learning needs  and relevant learning  goals',
                'Design analysis with highly focused purpose, broad  consideration of variables and controls. Display exceptional attention to details',
            ],
        },
        {
            indicator: 'Learning Strategies',
            columns: [
                'Needs awareness of effective learning strategies. Does not utilize strategies to enhance learning or address challenges',
                'Displays someawareness of learning  strategies but not consistently use them  effectively or adapt to  different learning contexts',
                'Applies effective learning strategies to enhance learning and  address challenges. Displays flexibility in adapting strategies to  different learning context',
                'Applies a wide range of effective learning strategies  with consistency and adaptability. Displays exceptional self-aware skills in  selecting and adjusting strategies based on learning  objectives and contexts',
            ],
        },
        {
            indicator: 'Resource Utilization',
            columns: [
                'Does not effectively utilize available resources for learning.  Needs awareness of relevant resources',
                'Utilizes some resources for learning but not fully  maximize their potential  certain relevant resources',
                'Effectively identifies and utilizes available resources for learning.  Shows good creativity and seeks out additional  resources',
                'Displays exceptional ability to identify and utilize a wide range of resources effectively.  Shows creativity in seeking out  and critically evaluating new  resources',
            ],
        },
        {
            indicator: 'Continuous improvement',
            columns: [
                'Shows resistance to feedback and limited willingness to make improvements. Does  not take proactive steps  to enhance skills or knowledge',
                'Displays some openness to feedback and makes  occasional upgrades. Takes limited initiative in  enhancing skills or knowledge',
                'Shows openness to feedback and actively  seeks opportunities for  improvement. Takes initiative in enhancing  skills or knowledge based on feedback and  self-reflection',
                'Embraces feedback with enthusiasm and actively seeks  continuous improvement opportunities. Takes proactive  and deliberate measures to  enhance skills, knowledge, and  professional development',
            ],
        },
    ];

    const tabContent: Record<string, React.ReactNode> = {
        Documentation: (
            <div className="-mt-5 bg-accent">
                <div className="flex items-center">
                    <p className="text-body-1 mt-5 ml-4 text-primary">
                        Document Review
                    </p>
                </div>

                {/* ================= DEFENSE DETAILS ================= */}
                <div className="flex justify-center">
                    <div className="mt-6 w-[95%] max-w-[95rem] rounded-lg border bg-accent p-8 shadow-sm">
                        <div className="mb-8 flex justify-between">
                            <div>
                                <h2 className="text-body-1 mb-2 font-bold text-primary">
                                    Defense Details
                                </h2>
                                <p className="text-alert-desc">
                                    Complete information about the thesis
                                    defense
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="mr-23 mb-1 text-sm text-primary">
                                    Defense ID
                                </p>
                                <div className="flex items-center justify-end gap-3">
                                    <span className="text-lg font-semibold">
                                        {defenseDetails.id}
                                    </span>
                                    <CompletedBadge />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Block
                                </h3>
                                <p>{defenseDetails.block}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Venue
                                </h3>
                                <p>{defenseDetails.venue}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Time
                                </h3>
                                <p>{defenseDetails.time}</p>
                            </div>
                            <div className="col-start-4 row-span-2">
                                <h3 className="mb-2 text-sm font-semibold text-primary">
                                    Proponents
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {defenseDetails.proponents.map(
                                        (name, i) => (
                                            <div
                                                key={i}
                                                className="flex w-fit items-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-1.5"
                                            >
                                                <Users className="h-4 w-4" />
                                                {name}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="col-start-5 row-span-2">
                                <h3 className="mb-2 text-sm font-semibold text-primary">
                                    Defense Panel
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {defenseDetails.panelists.map((panel) => (
                                        <div
                                            key={panel.id}
                                            className="flex items-center gap-3 px-3 py-1.5"
                                        >
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/50 text-xs font-semibold text-primary">
                                                {panel.id}
                                            </span>
                                            {panel.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Thesis Adviser
                                </h3>
                                <p>{defenseDetails.adviser}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Date
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {defenseDetails.date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= DOCUMENT + SIDE PANELS ================= */}
                <div className="flex justify-center">
                    <div className="mt-6 w-[95%] max-w-[95rem]">
                        <div className="grid grid-cols-4 gap-6">
                            <div className="col-span-3">
                                <DocumentPreview
                                    documentTitle={selectedDoc.title}
                                    documentUrl={selectedDoc.url}
                                />
                            </div>

                            <div className="col-span-1 space-y-6">
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-4 text-sm font-semibold text-primary">
                                        Submitted Documents
                                    </h3>
                                    <div className="divide-y rounded-lg border">
                                        {documents.map((doc, i) => (
                                            <div
                                                key={i}
                                                onClick={() =>
                                                    setSelectedDoc(doc)
                                                }
                                                className={`flex cursor-pointer gap-3 border-l-4 p-3 transition ${
                                                    selectedDoc.title ===
                                                    doc.title
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-transparent hover:border-primary hover:bg-primary/10'
                                                }`}
                                            >
                                                <iconRegistry.docuDefault className="mt-1 h-5 w-5 shrink-0 text-primary" />
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {doc.title}
                                                    </p>
                                                    <p className="text-body-3 text-alert-default/80">
                                                        {doc.size}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {doc.version}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex h-80 flex-col rounded-lg border p-4">
                                    <div className="flex justify-between">
                                        <h3 className="text-sm font-semibold text-primary">
                                            Comments
                                        </h3>
                                        <h3 className="text-sm font-semibold text-primary">
                                            History
                                        </h3>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex flex-1 items-center justify-center">
                                        <p className="text-alert-desc">
                                            No comments yet
                                        </p>
                                    </div>
                                    <Separator className="my-4" />
                                    <div>
                                        <textarea
                                            placeholder="Add a comment or inline feedback..."
                                            className="w-full resize-none rounded-lg border border-alert-default/20 p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                            rows={2}
                                        />
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            setIsAddCommentOpen(true)
                                        }
                                    >
                                        Add Comment
                                    </Button>
                                    <ConfirmDialog
                                        open={isAddCommentOpen}
                                        onOpenChange={setIsAddCommentOpen}
                                        title="Are you sure you want to submit?"
                                        description="This action cannot be undone."
                                        confirmLabel="Confirm"
                                        onConfirm={handleAddComment}
                                    />
                                </div>
                            </div>

                            <div className="col-span-4 rounded-lg border p-6 shadow">
                                <p className="text-body-2 mb-2 font-bold text-primary">
                                    Comments / Recommendations
                                </p>
                                <div>
                                    <textarea
                                        placeholder="Add a comment or inline feedback..."
                                        className="w-full resize-none rounded-lg border border-alert-default/20 p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                        rows={5}
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="primary"
                                        onClick={() =>
                                            setIsSubmitCommentOpen(true)
                                        }
                                    >
                                        Submit Comment
                                    </Button>
                                    <ConfirmDialog
                                        open={isSubmitCommentOpen}
                                        onOpenChange={setIsSubmitCommentOpen}
                                        title="Are you sure you want to submit?"
                                        description="This action cannot be undone."
                                        confirmLabel="Confirm"
                                        onConfirm={handleSubmitComment}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        Evaluation: (
            <div className="-mt-5 space-y-6 bg-accent">
                <div className="flex items-center">
                    <p className="text-body-1 mt-5 ml-4 text-primary">
                        Evaluation Form
                    </p>
                </div>

                {/* ================= DEFENSE DETAILS ================= */}
                <div className="flex justify-center">
                    <div className="mt-6 w-[95%] max-w-[95rem] rounded-lg border bg-accent p-8 shadow-sm">
                        <div className="mb-8 flex justify-between">
                            <div>
                                <h2 className="text-body-1 mb-2 font-bold text-primary">
                                    Defense Details
                                </h2>
                                <p className="text-alert-desc">
                                    Complete information about the thesis
                                    defense
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="mr-23 mb-1 text-sm text-primary">
                                    Defense ID
                                </p>
                                <div className="flex items-center justify-end gap-3">
                                    <span className="text-lg font-semibold">
                                        {defenseDetails.id}
                                    </span>
                                    <CompletedBadge />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Block
                                </h3>
                                <p>{defenseDetails.block}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Venue
                                </h3>
                                <p>{defenseDetails.venue}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Time
                                </h3>
                                <p>{defenseDetails.time}</p>
                            </div>
                            <div className="col-start-4 row-span-2">
                                <h3 className="mb-2 text-sm font-semibold text-primary">
                                    Proponents
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {defenseDetails.proponents.map(
                                        (name, i) => (
                                            <div
                                                key={i}
                                                className="flex w-fit items-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-1.5"
                                            >
                                                <Users className="h-4 w-4" />
                                                {name}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="col-start-5 row-span-2">
                                <h3 className="mb-2 text-sm font-semibold text-primary">
                                    Defense Panel
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {defenseDetails.panelists.map((panel) => (
                                        <div
                                            key={panel.id}
                                            className="flex items-center gap-3 px-3 py-1.5"
                                        >
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/50 text-xs font-semibold text-primary">
                                                {panel.id}
                                            </span>
                                            {panel.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Thesis Adviser
                                </h3>
                                <p>{defenseDetails.adviser}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-primary">
                                    Date
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {defenseDetails.date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="mt-6 w-[95%] max-w-[95rem] bg-accent p-6">
                        {[
                            {
                                rows: rubric1Rows,
                                description:
                                    'Conduct investigations of complex engineering problems using research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of information to provide valid conclusions.',
                                percentage: 20,
                            },
                            {
                                rows: rubric2Rows,
                                description:
                                    'Function effectively as an individual, and as a member of leader in diverse teams and in multidisciplinary settings',
                                percentage: 25,
                            },
                            {
                                rows: rubric3Rows,
                                description:
                                    'Identify, formulate, research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences',
                                percentage: 20,
                            },
                            {
                                rows: rubric4Rows,
                                description:
                                    'Communicate effectively on complex engineering activities with the engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation, make effective  presentations, and give and receive clear instructions.',
                                percentage: 20,
                            },
                            {
                                rows: rubric5Rows,
                                description:
                                    'Identify, formulate, research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences',
                                percentage: 20,
                            },
                        ].map((r, i) => (
                            <div key={i} className={i > 0 ? 'mt-6' : ''}>
                                <RubricTable
                                    rubricNumber={i + 1}
                                    rows={r.rows}
                                    description={r.description}
                                    percentage={r.percentage}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="mt-6 flex w-[95%] max-w-[95rem] justify-start gap-6">
                        {/* Total Score */}
                        <div className="flex w-[15rem] items-center justify-between rounded-lg border bg-accent p-6 shadow">
                            <p className="text-body-2 font-bold text-primary">
                                Total Score:
                            </p>
                            <span className="text-body-2 font-bold text-primary">
                                0.0%
                            </span>
                        </div>

                        {/* Evaluation Decision */}
                        <div className="flex w-[20rem] flex-col rounded-lg border bg-accent p-6 shadow">
                            <p className="text-body-2 mb-4 font-bold text-primary">
                                Evaluation Decision
                            </p>

                            <div className="flex gap-6">
                                {['Accepted', 'Rejected'].map((option) => (
                                    <div
                                        key={option}
                                        onClick={() =>
                                            setSelectedDecision(option)
                                        }
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        {/* The ring */}
                                        <div
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${selectedDecision === option ? 'border-primary bg-alert-default/80' : 'border-foreground'} `}
                                        >
                                            {selectedDecision === option && (
                                                <div className="h-3 w-3 rounded-full bg-primary"></div>
                                            )}
                                        </div>

                                        {/* The label */}
                                        <span className="text-sm font-medium text-foreground">
                                            {option}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="mt-6 w-[95%] max-w-[95rem] rounded-lg border bg-accent p-6 shadow">
                        <p className="text-body-2 mb-2 font-bold text-primary">
                            Comments/Recommendations
                        </p>
                        <div>
                            <textarea
                                placeholder="Enter your comments and recommendations here..."
                                className="w-full resize-none rounded-lg border border-alert-default/20 p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                rows={5}
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-4">
                            <Button
                                variant="primary"
                                onClick={() => setIsSaveDraftOpen(true)}
                            >
                                Save as Draft
                            </Button>
                            <ConfirmDialog
                                open={isSaveDraftOpen}
                                onOpenChange={setIsSaveDraftOpen}
                                title="Are you sure you want to save changes?"
                                description="This action cannot be undone."
                                confirmLabel="Confirm"
                                onConfirm={handleSaveDraft}
                            />
                            <Button
                                variant="primary"
                                onClick={() => setIsSubmitGradesOpen(true)}
                            >
                                Submit Grades
                            </Button>
                            <ConfirmDialog
                                open={isSubmitGradesOpen}
                                onOpenChange={setIsSubmitGradesOpen}
                                title="Are you sure you want to submit?"
                                description="This action cannot be undone."
                                confirmLabel="Confirm"
                                onConfirm={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            title=""
            description=""
        >
            <Link
                href="/faculty/management/panel/thesis-review-0/thesis_review"
                className="mb-6 flex items-center gap-2"
            >
                <BackIcon className="h-6 w-6 text-primary" />
                <span className="text-primary underline">Return</span>
            </Link>

            <div className="flex justify-end">
                <Tabs
                    tabs={tabLabels}
                    defaultTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            <div>{tabContent[activeTab]}</div>
            <SuccessDialog
                open={isSuccessOpen}
                onOpenChange={setIsSuccessOpen}
                message={successMessage}
            />
        </FacultyManagementLayout>
    );
}
