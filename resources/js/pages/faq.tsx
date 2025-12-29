import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import FAQNavbar from '@/components/faq-navbar';
import { NavFooter } from '@/components/nav-footer';
import { Search, HelpCircle } from 'lucide-react';

type Category = 'All Categories' | 'General' | 'Scheduling' | 'Panels' | 'Technical';

interface FAQItem {
    question: string;
    answer: string;
    category: Exclude<Category, 'All Categories'>;
}

const faqs: FAQItem[] = [
    {
        question: 'What is the Thesis Management System?',
        answer: 'The Thesis Management System is a comprehensive platform designed to streamline the thesis process for students, advisers, and coordinators. It helps manage thesis proposals, track progress, schedule defenses, and maintain an archive of completed theses.',
        category: 'General',
    },
    {
        question: 'How do I submit my thesis proposal?',
        answer: 'To submit your thesis proposal, log in to your student account, navigate to the "My Thesis" section, and click on "Submit Proposal". Fill in all required fields including title, abstract, and upload your proposal document. Your adviser will be notified once submitted.',
        category: 'General',
    },
    {
        question: 'How can I track my thesis progress?',
        answer: 'You can track your thesis progress through the Dashboard. It shows your current stage (MOR, DP1, DP2), upcoming deadlines, pending tasks, and feedback from your adviser and committee members.',
        category: 'General',
    },
    {
        question: 'Who can access my thesis documents?',
        answer: 'Your thesis documents are accessible to your assigned adviser, committee members, and coordinators. Once your thesis is approved and archived, it becomes available in the public archive for research purposes.',
        category: 'General',
    },
    {
        question: 'How do I schedule a defense?',
        answer: 'Defense scheduling is managed by your coordinator. You will receive notifications about your scheduled defense date, time, and panel members. Make sure to submit all required documents before the defense date.',
        category: 'Scheduling',
    },
    {
        question: 'What are the different thesis stages?',
        answer: 'The thesis process has three main stages: MOR (Manuscript for Oral Review), DP1 (Defense Proper 1 - Proposal Defense), and DP2 (Defense Proper 2 - Final Defense). Each stage has specific requirements and evaluation criteria.',
        category: 'General',
    },
    {
        question: 'How do I communicate with my adviser?',
        answer: 'You can communicate with your adviser through the messaging system in the platform. Navigate to "Messages" to send direct messages, share updates, or ask questions about your thesis.',
        category: 'Technical',
    },
    {
        question: 'Can I change my thesis title after submission?',
        answer: 'Yes, you can request title changes through your adviser. Navigate to your thesis details and click "Request Title Change". Your adviser must approve the change before it takes effect.',
        category: 'General',
    },
    {
        question: 'Where can I find archived theses for reference?',
        answer: 'You can access the thesis archive through the "Thesis Archive" section. Use filters to search by department, year, keywords, or author. All approved and completed theses are available for reference.',
        category: 'General',
    },
    {
        question: 'What should I do if I encounter technical issues?',
        answer: 'If you experience technical issues, first try refreshing your browser or logging out and back in. If the problem persists, contact the system administrator through the "Support" section or email the IT department.',
        category: 'Technical',
    },
];

export default function FAQ() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('All Categories');
    const [searchQuery, setSearchQuery] = useState('');

    const categories: Category[] = ['All Categories', 'General', 'Scheduling', 'Panels', 'Technical'];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'All Categories' || faq.category === selectedCategory;
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <Head title="FAQ" />
            <FAQNavbar />
            <div className="min-h-screen bg-gradient-to-br from-[#FDFDFC] to-[#F5F5F0] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header with Icon */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <HelpCircle className="w-10 h-10 text-primary-foreground-2 stroke-[3]" />
                            <h1 className="text-2xl font-bold text-primary font-['DM_Sans']">
                                Frequently Asked Questions
                            </h1>
                        </div>
                        <p className="text-base text-[#4a5565] font-['DM_Sans'] max-w-2xl mx-auto">
                            Find answers to common questions about the Thesis Management System
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search field text..."
                            className="flex-1 h-11 px-4 bg-white border border-[#808080] rounded-l-md font-['DM_Sans'] text-[#717182] focus:outline-none focus:border-primary transition-colors"
                        />
                        <button className="h-11 w-12 bg-primary rounded-r-lg flex items-center justify-center hover:bg-primary/90 transition-colors">
                            <Search className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 h-9 rounded-lg font-['DM_Sans'] font-medium text-[13.33px] transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-primary text-primary-foreground-2'
                                        : 'bg-breadcrumb text-primary hover:bg-[#e8e3c0]'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="space-y-3">
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((faq, index) => (
                                <Collapsible key={index}>
                                    <CollapsibleTrigger>
                                        <div className="flex items-center gap-5 text-left w-full">
                                            <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap font-['DM_Sans'] group-data-[state=open]:bg-primary-foreground-2 group-data-[state=open]:text-primary transition-colors">
                                                {faq.category}
                                            </span>
                                            <span className="font-medium flex-1 font-['DM_Sans']">
                                                {faq.question}
                                            </span>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="font-['DM_Sans'] text-sm">
                                            {faq.answer}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))
                        ) : (
                            <div className="bg-white rounded-xl p-6 text-center border border-[#e5e7eb]">
                                <p className="font-['DM_Sans'] text-[#4a5565]">
                                    No FAQs found matching your search or category.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Contact Section */}
                    <div className="mt-6 bg-breadcrumb rounded-xl p-6 border border-primary">
                        <h2 className="text-lg font-normal text-primary mb-2 font-['DM_Sans']">
                            Still have questions?
                        </h2>
                        <p className="text-base text-black font-['DM_Sans'] leading-6 mb-0">
                            If you couldn't find the answer you're looking for, please contact the program coordinator or reach out to the thesis defense administrator for assistance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Nav Footer */}
            <div className="mt-16">
                <NavFooter />
            </div>
        </>
    );
}
