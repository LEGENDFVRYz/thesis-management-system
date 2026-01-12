import { TabButton } from '@/components/ui/tabs'; 

interface TabNavigationProps {
    activeTab: 'evaluation' | 'results';
    onTabChange: (tab: 'evaluation' | 'results') => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
    return (
        <div className="inline-flex mb-8">
            <TabButton
                isActive={activeTab === 'evaluation'}
                onClick={() => onTabChange('evaluation')}
            >
                Evaluation Page
            </TabButton>
            <TabButton
                isActive={activeTab === 'results'}
                onClick={() => onTabChange('results')}
            >
                Results Page
            </TabButton>
        </div>
    );
};