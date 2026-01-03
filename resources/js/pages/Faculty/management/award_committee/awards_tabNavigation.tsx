import { Button } from "@headlessui/react";

interface TabNavigationProps {
    activeTab: 'evaluation' | 'results';
    onTabChange: (tab: 'evaluation' | 'results') => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
    return (
        <div className="flex gap-6 border-b border-gray-300 mb-8">
            <Button
                onClick={() => onTabChange('evaluation')}
                className={`flex items-center gap-2 pb-3 border-b-2 font-medium transition-colors ${
                    activeTab === 'evaluation'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                Evaluation Page
            </Button>
            <Button
                onClick={() => onTabChange('results')}
                className={`flex items-center gap-2 pb-3 border-b-2 font-medium transition-colors ${
                    activeTab === 'results'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                Results Page
            </Button>
        </div>
    );
};