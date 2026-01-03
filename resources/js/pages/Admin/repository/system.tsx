import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import RepositoryLayout from './index';
import { system } from '@/routes/admin/repository';
import { type BreadcrumbItem } from '@/types';
import { SystemRepositoryStorage } from '@/components/system-repository-storage';
import { Icon } from '@/components/icon-index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TableHead } from '@/components/ui/table';
import { AlertCircle, FileText, Trash2, Calendar } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { index, theses } from '@/routes/repository';
import { AppContent } from '@/components/app-content';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Repository', href: index().url },
    { title: 'System Archive', href: system().url },
];

// Types
interface SystemData {
  id: string;
  name: string;
  fileSize: string;
  lastUpdate: string;
  syncStatus: 'Success' | 'Failed';
  thesisId: string;
  thesisTitle: string;
  totalBytes: string;
  primary: string;
  replicated: string;
  lastUpdateDate: string;
  lastSyncDate?: string;
  lastSyncStatus: string;
  block: string;
  thesisAdviser: string;
  proponents: string[];
}

// Mock Data
const mockSystemData: SystemData[] = [
  {
    id: '1',
    name: 'Machine Learning Applications in Healthcare Diagnostics',
    fileSize: '44.6 MB',
    lastUpdate: 'November 28, 2025 09:00 AM',
    syncStatus: 'Success',
    thesisId: '3301',
    thesisTitle: 'Machine Learning Applications in Healthcare Diagnostics',
    totalBytes: '44.6 MB',
    primary: '40.1 MB',
    replicated: '4.5 MB',
    lastUpdateDate: '11/25/2025',
    lastSyncDate: '11/25/2025',
    lastSyncStatus: 'Success',
    block: 'BSCPE 3-3',
    thesisAdviser: 'Dr. Maria Santos',
    proponents: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Lee']
  },
  {
    id: '2',
    name: 'Blockchain Technology in Supply Chain',
    fileSize: '39.8 MB',
    lastUpdate: 'November 28, 2025 09:00 AM',
    syncStatus: 'Failed',
    thesisId: '3302',
    thesisTitle: 'Blockchain Technology in Supply Chain Management',
    totalBytes: '39.8 MB',
    primary: '35.3 MB',
    replicated: '4.5 MB',
    lastUpdateDate: '11/25/2025',
    lastSyncStatus: 'Failed',
    block: 'BSCS 4-1',
    thesisAdviser: 'Dr. John Rivera',
    proponents: ['Alice Wong', 'Bob Chen', 'Carol Davis']
  },
  {
    id: '3',
    name: 'IoT-Based Smart Home Automation',
    fileSize: '41.2 MB',
    lastUpdate: 'November 28, 2025 09:00 AM',
    syncStatus: 'Success',
    thesisId: '3303',
    thesisTitle: 'IoT-Based Smart Home Automation System',
    totalBytes: '41.2 MB',
    primary: '37.0 MB',
    replicated: '4.2 MB',
    lastUpdateDate: '11/24/2025',
    lastSyncDate: '11/24/2025',
    lastSyncStatus: 'Success',
    block: 'BSIT 3-2',
    thesisAdviser: 'Dr. Emily Chen',
    proponents: ['David Lee', 'Emma Wilson']
  },
  {
    id: '4',
    name: 'Cybersecurity Framework for Mobile Banking',
    fileSize: '44.6 MB',
    lastUpdate: 'November 28, 2025 09:00 AM',
    syncStatus: 'Failed',
    thesisId: '3304',
    thesisTitle: 'Cybersecurity Framework for Mobile Banking Applications',
    totalBytes: '44.6 MB',
    primary: '39.8 MB',
    replicated: '4.8 MB',
    lastUpdateDate: '11/23/2025',
    lastSyncStatus: 'Failed',
    block: 'BSCS 3-3',
    thesisAdviser: 'Dr. Mark Taylor',
    proponents: ['Frank Miller', 'Grace Lee', 'Henry Park', 'Iris Kim']
  },
  {
    id: '5',
    name: 'Data Analytics in Educational Performance',
    fileSize: '39.8 MB',
    lastUpdate: 'November 28, 2025 09:00 AM',
    syncStatus: 'Success',
    thesisId: '3305',
    thesisTitle: 'Data Analytics in Educational Performance Tracking',
    totalBytes: '39.8 MB',
    primary: '35.5 MB',
    replicated: '4.3 MB',
    lastUpdateDate: '11/22/2025',
    lastSyncDate: '11/22/2025',
    lastSyncStatus: 'Success',
    block: 'BSIT 4-2',
    thesisAdviser: 'Dr. Lisa Anderson',
    proponents: ['Jack Brown', 'Kelly White']
  },
  {
    id: '6',
    name: 'Cloud Computing Solutions for ERP',
    fileSize: '41.2 MB',
    lastUpdate: 'November 28, 2025 09:00 AM',
    syncStatus: 'Failed',
    thesisId: '3306',
    thesisTitle: 'Cloud Computing Solutions for Enterprise Resource Planning',
    totalBytes: '41.2 MB',
    primary: '36.9 MB',
    replicated: '4.3 MB',
    lastUpdateDate: '11/21/2025',
    lastSyncStatus: 'Failed',
    block: 'BSCPE 4-1',
    thesisAdviser: 'Dr. Robert Kim',
    proponents: ['Laura Green', 'Mike Harris', 'Nancy Clark']
  },
  {
    id: '7',
    name: 'Virtual Reality in Medical Training',
    fileSize: '44.6 MB',
    lastUpdate: 'November 28, 2025 09:00 AM',
    syncStatus: 'Success',
    thesisId: '3307',
    thesisTitle: 'Virtual Reality Applications in Medical Training',
    totalBytes: '44.6 MB',
    primary: '40.2 MB',
    replicated: '4.4 MB',
    lastUpdateDate: '11/20/2025',
    lastSyncDate: '11/20/2025',
    lastSyncStatus: 'Success',
    block: 'BSCS 3-1',
    thesisAdviser: 'Dr. Sarah Johnson',
    proponents: ['Oscar Lee', 'Paula Martinez']
  },
  {
    id: '8',
    name: 'NLP Customer Service Chatbots',
    fileSize: '39.8 MB',
    lastUpdate: 'November 28, 2025 09:00 AM',
    syncStatus: 'Success',
    thesisId: '3308',
    thesisTitle: 'Natural Language Processing for Customer Service Chatbots',
    totalBytes: '39.8 MB',
    primary: '35.6 MB',
    replicated: '4.2 MB',
    lastUpdateDate: '11/19/2025',
    lastSyncDate: '11/19/2025',
    lastSyncStatus: 'Success',
    block: 'BSIT 3-3',
    thesisAdviser: 'Dr. Thomas Lee',
    proponents: ['Quinn Davis', 'Rachel Adams', 'Sam Wilson']
  },
  {
    id: '9',
    name: 'Computer Vision for Autonomous Vehicles',
    fileSize: '42.3 MB',
    lastUpdate: 'November 27, 2025 03:30 PM',
    syncStatus: 'Failed',
    thesisId: '3309',
    thesisTitle: 'Computer Vision for Autonomous Vehicle Navigation',
    totalBytes: '42.3 MB',
    primary: '38.1 MB',
    replicated: '4.2 MB',
    lastUpdateDate: '11/17/2025',
    lastSyncStatus: 'Failed',
    block: 'BSCPE 3-2',
    thesisAdviser: 'Dr. Victoria Chen',
    proponents: ['Tyler Brown', 'Uma Patel', 'Victor Smith']
  },
  {
    id: '10',
    name: 'Quantum Computing Applications',
    fileSize: '45.2 MB',
    lastUpdate: 'November 27, 2025 10:15 AM',
    syncStatus: 'Success',
    thesisId: '3310',
    thesisTitle: 'Quantum Computing Applications in Cryptography',
    totalBytes: '45.2 MB',
    primary: '40.8 MB',
    replicated: '4.4 MB',
    lastUpdateDate: '11/16/2025',
    lastSyncDate: '11/16/2025',
    lastSyncStatus: 'Success',
    block: 'BSCS 4-2',
    thesisAdviser: 'Dr. Michael Zhang',
    proponents: ['Wendy Garcia', 'Xavier Lopez']
  },
  {
    id: '11',
    name: 'Augmented Reality Shopping Experience',
    fileSize: '43.7 MB',
    lastUpdate: 'November 26, 2025 02:45 PM',
    syncStatus: 'Success',
    thesisId: '3311',
    thesisTitle: 'Augmented Reality for Enhanced Shopping Experience',
    totalBytes: '43.7 MB',
    primary: '39.3 MB',
    replicated: '4.4 MB',
    lastUpdateDate: '11/15/2025',
    lastSyncDate: '11/15/2025',
    lastSyncStatus: 'Success',
    block: 'BSIT 4-1',
    thesisAdviser: 'Dr. Anna Rodriguez',
    proponents: ['Yolanda Park', 'Zachary Kim', 'Aaron Chen', 'Beth Wilson']
  },
  {
    id: '12',
    name: 'Renewable Energy Optimization System',
    fileSize: '41.8 MB',
    lastUpdate: 'November 26, 2025 11:20 AM',
    syncStatus: 'Failed',
    thesisId: '3312',
    thesisTitle: 'Renewable Energy Grid Optimization Using AI',
    totalBytes: '41.8 MB',
    primary: '37.5 MB',
    replicated: '4.3 MB',
    lastUpdateDate: '11/14/2025',
    lastSyncStatus: 'Failed',
    block: 'BSCPE 4-3',
    thesisAdviser: 'Dr. Carlos Martinez',
    proponents: ['Chris Davis', 'Diana Evans']
  }
];

export default function SystemRepository() {
  const [selectedId, setSelectedId] = useState<string>(mockSystemData[0]?.id || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [syncedFilesCount] = useState(1);

  const selectedThesis = mockSystemData.find(item => item.id === selectedId) || mockSystemData[0];
  const [currentSyncStatus, setCurrentSyncStatus] = useState<'Success' | 'Failed'>(selectedThesis.syncStatus);

  useEffect(() => {
    setCurrentSyncStatus(selectedThesis.syncStatus);
    setShowSuccess(false);
    setIsSyncing(false);
  }, [selectedId]);

  const isFailed = currentSyncStatus === 'Failed';

  const handleSyncNow = () => {
    setIsSyncing(true);
    setShowSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setCurrentSyncStatus('Success');
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <>
      <Head title="System Archive" />

      <RepositoryLayout breadcrumbs={breadcrumbs}>

      <AppContent
        title="System Archive"
        subtitle="Browse and explore student thesis projects"
      >

        {/* Storage Card */}
        <div className="mb-8">
          <SystemRepositoryStorage />
        </div>

        {/* Table and Details Card Section */}
        <div className="flex gap-6">
          {/* Table Section */}
          <div className="flex-1 rounded-lg border-[0.8px] border-primary overflow-hidden flex flex-col h-fit">
            {/* Table Header */}
            <div className="grid grid-cols-[300px_1fr_1fr_1fr] gap-[10px] h-10 bg-primary rounded-t-lg">
              <TableHead className="flex items-center justify-center px-[10px]">
                <span className="text-primary-foreground font-dm text-[13.33px] font-medium leading-normal">
                  Name
                </span>
              </TableHead>
              <TableHead className="flex items-center justify-center px-[10px]">
                <span className="text-primary-foreground font-dm text-[13.33px] font-medium leading-normal">
                  File Size
                </span>
              </TableHead>
              <TableHead className="flex items-center justify-center px-[10px]">
                <span className="text-primary-foreground font-dm text-[13.33px] font-medium leading-normal">
                  Last Update
                </span>
              </TableHead>
              <TableHead className="flex items-center justify-center px-[10px] pr-[22px]">
                <span className="text-primary-foreground font-dm text-[13.33px] font-medium leading-normal">
                  Action
                </span>
              </TableHead>
            </div>

            {/* Table Rows Container - scrollable */}
            <div className="flex flex-col flex-1 overflow-y-auto">
              {mockSystemData.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[300px_1fr_1fr_1fr] gap-[10px] h-10 transition-colors ${
                      isSelected ? 'bg-breadcrumb' : 'bg-background hover:bg-breadcrumb/50'
                    }`}
                  >
                    {/* Name Column */}
                    <div className="flex items-center justify-start gap-[10px] px-[10px]">
                      <FileText className="h-[15px] w-[15px] text-primary flex-shrink-0" />
                      <span className="text-foreground font-dm text-[13.33px] font-medium leading-normal truncate">
                        {item.name}
                      </span>
                    </div>

                    {/* File Size Column */}
                    <div className="flex items-center justify-center px-[10px]">
                      <span className="text-foreground font-dm text-[13.33px] font-medium leading-normal">
                        {item.fileSize}
                      </span>
                    </div>

                    {/* Last Update Column */}
                    <div className="flex items-center justify-center px-[10px]">
                      <span className="text-foreground font-dm text-[13.33px] font-medium leading-normal">
                        {item.lastUpdate}
                      </span>
                    </div>

                    {/* Action Column */}
                    <div className="flex items-center justify-center px-[10px]">
                      <button
                        className="h-8 px-3 flex items-center justify-center gap-[6px] rounded-lg border-[0.8px] border-primary/75 hover:bg-breadcrumb transition-colors"
                        onClick={() => setSelectedId(item.id)}
                      >
                        <span className="text-primary/75 font-dm text-[13.33px] font-medium leading-normal">
                          View Details
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table Footer - View All */}
            <Link href="/admin/repository/system-expanded">
              <div className="h-10 border-t-[0.8px] border-primary bg-background flex items-center justify-center gap-[10px] cursor-pointer hover:bg-breadcrumb/30 transition-colors">
                <span className="text-primary text-center font-dm text-[13.33px] font-medium leading-normal">
                  View All
                </span>
                <Icon name="gotoDefault" size={18} />
              </div>
            </Link>
          </div>

          {/* Details Card */}
          <div className="w-[456px] flex-shrink-0 rounded-lg border-[0.8px] border-primary bg-breadcrumb p-5 pb-[20.6px] flex flex-col gap-[22px]">
            {/* Header */}
            <div className="flex items-start justify-between border-b-[0.8px] border-primary pb-[5px]">
              <div className="flex flex-col gap-2">
                <h3 className="text-foreground font-dm text-[16px] font-bold leading-normal">
                  Thesis Details
                </h3>
                <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                  Complete information about the thesis
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                className="h-8 px-3 gap-[6px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Trash2 size={16} className="text-white" />
                <span className="text-[12px] font-medium">Delete</span>
              </Button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-[10px]">
              {/* Thesis ID & Sync Status */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-primary font-dm text-[16px] font-bold leading-normal">
                    Thesis ID
                </p>
                  <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                    {selectedThesis.thesisId}
                  </p>
                </div>
                    
                  {/* Sync Controls */}
                  <div className="flex items-center gap-2">
                    {!isSyncing && (
                      <>
                        {currentSyncStatus === 'Failed' && (
                          <button
                            onClick={handleSyncNow}
                            className="text-foreground font-dm text-[12px] font-medium underline hover:text-primary"
                          >
                            Sync now
                          </button>
                        )}
          
                        <Badge
                          className={`rounded-[25px] px-[22px] py-[2px] border ${
                            currentSyncStatus === 'Failed'
                              ? 'bg-transparent border-primary text-primary'
                              : 'bg-transparent border-[#0D542B] text-[#0D542B]'
                          } hover:bg-transparent`}
                        >
                          <span className="text-[12px] font-medium">{currentSyncStatus}</span>
                        </Badge>
                    </>
                  )}

                  {isSyncing && (
                    <div className="flex items-center gap-2">
                      <Spinner type="ring" size="sm" />
                      <span className="text-foreground font-dm text-[12px] font-medium">
                        Syncing...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thesis Title */}
              <div className="flex flex-col gap-1">
                <p className="text-primary font-dm text-[16px] font-bold leading-normal">
                  Thesis Title
                </p>
                <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                  {selectedThesis.thesisTitle}
                </p>
              </div>

              {/* Storage Details */}
              <div className="flex flex-col gap-1">
                <p className="text-primary font-dm text-[16px] font-bold leading-normal">
                  Storage
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-foreground font-dm text-[15px] font-bold leading-normal">
                    Total Bytes
                  </p>
                  <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                    {selectedThesis.totalBytes}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-foreground font-dm text-[15px] font-bold leading-normal">
                    Primary
                  </p>
                  <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                    {selectedThesis.primary}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-foreground font-dm text-[15px] font-bold leading-normal">
                    Replicated
                  </p>
                  <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                    {selectedThesis.replicated}
                  </p>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="grid grid-cols-2 gap-[5px]">
                <div className="flex flex-col gap-1">
                  <p className="text-primary font-dm text-[16px] font-bold leading-normal">
                    Last Update
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" strokeWidth={1.33} />
                    <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                      {selectedThesis.lastUpdateDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <p className="text-primary font-dm text-[16px] font-bold leading-normal">
                    Last Sync
                  </p>
                  <div className="flex items-center gap-2">
                    {currentSyncStatus === 'Failed' ? (
                      <>
                        <AlertCircle size={16} className="text-primary" />
                        <p className="text-primary font-dm text-[15px] font-medium leading-normal">
                          Failed
                        </p>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 text-primary" strokeWidth={1.33} />
                        <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                          {selectedThesis.lastSyncDate || 'Date Today'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Block and Adviser */}
              <div className="grid grid-cols-2 gap-[5px]">
                <div className="flex flex-col justify-center gap-[1.6px]">
                  <p className="text-primary font-dm text-[16px] font-bold leading-normal">
                    Block
                  </p>
                  <div className="inline-flex items-center justify-center px-[5px] py-[5px] rounded-lg border-[0.8px] border-primary w-fit">
                    <span className="text-foreground font-dm text-[12px] font-medium leading-normal">
                      {selectedThesis.block}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <p className="text-primary font-dm text-[16px] font-bold leading-normal">
                    Thesis Adviser
                  </p>
                  <p className="text-foreground font-dm text-[15px] font-medium leading-normal">
                    {selectedThesis.thesisAdviser}
                  </p>
                </div>
              </div>

              {/* Proponents */}
              <div className="flex flex-col gap-2">
                <p className="text-primary font-dm text-[16px] font-bold leading-normal">
                  Proponents
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedThesis.proponents.map((proponent, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 rounded-lg bg-[rgba(255,189,0,0.5)] px-[8.8px] py-[2.6px]"
                    >
                      <Icon name="proponentsDefault" size={12} />
                      <span className="text-foreground font-dm text-[12px] font-medium leading-[16px]">
                        {proponent}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppContent>
    </RepositoryLayout>
    
    <NavFooter />
    </>
  );
}