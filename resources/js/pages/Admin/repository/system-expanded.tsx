import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import RepositoryLayout from '@/pages/Shared/repository/index';
import { system, systemExpanded } from '@/routes/admin/repository';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { SystemRepositoryStorage } from '@/components/system-repository-storage';
import { Icon } from '@/components/icon-index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TableHead } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import { AlertCircle, FileText, Trash2, Calendar, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { index } from '@/routes/admin/repository/index';
import { AppContent } from '@/components/app-content';


// Setup
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Repository', href: index().url },
    { title: 'System Archive', href: system().url },
];

const pageHeader: PageHeaderProps = {
    title: "System Archive",
    subtitle: "Browse and explore student thesis projects",
    icon: (
        // pa correct nalang
        <Icon
            name="calendarDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};


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

// Sort Component
function SortDropdown({ isOpen, onClose, onApply }: { isOpen: boolean; onClose: () => void; onApply: (sort: string) => void }) {
  const [selectedSort, setSelectedSort] = useState('');

  const handleReset = () => setSelectedSort('');
  const handleApply = () => {
    onApply(selectedSort);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 z-50 bg-background rounded-lg shadow-lg p-6 w-[350px] border border-primary/15">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-primary">Sort By</h3>
        <button onClick={onClose} className="text-foreground hover:text-primary">
          <X size={20} />
        </button>
      </div>
      <div className="border-t border-primary/15 my-4" />

      {/* Thesis ID */}
      <div className="mb-4">
        <label className="block text-foreground mb-2 font-medium">Thesis ID</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="thesis-id-asc" id="thesis-id-asc" />
            <Label htmlFor="thesis-id-asc">Ascending</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="thesis-id-desc" id="thesis-id-desc" />
            <Label htmlFor="thesis-id-desc">Descending</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Block */}
      <div className="mb-4">
        <label className="block text-foreground mb-2 font-medium">Block</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="block-asc" id="block-asc" />
            <Label htmlFor="block-asc">Ascending</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="block-desc" id="block-desc" />
            <Label htmlFor="block-desc">Descending</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Date Added */}
      <div className="mb-4">
        <label className="block text-foreground mb-2 font-medium">Date Added</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="date-oldest" id="date-oldest" />
            <Label htmlFor="date-oldest">Oldest to Newest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="date-newest" id="date-newest" />
            <Label htmlFor="date-newest">Newest to Oldest</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="tertiary" onClick={handleReset}>Reset</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="negative" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}

export default function SystemRepositoryExpanded() {
  {/* Filter & Toggle States */}
  const [filterStatus, setFilterStatus] = useState<'synced' | 'failed'>('synced');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  {/* Selection States */}
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const handleClearSelection = () => {
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  {/* Failed Sync Selection States */}
  const [failedSelectMode, setFailedSelectMode] = useState(false);
  const [failedSelectedIds, setFailedSelectedIds] = useState<string[]>([]);
  const [failedIsSyncing, setFailedIsSyncing] = useState(false);
  const [failedShowSuccess, setFailedShowSuccess] = useState(false);
  const [failedSyncedCount, setFailedSyncedCount] = useState(0);

  {/* Modals States */}
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<SystemData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentModalSyncStatus, setCurrentModalSyncStatus] =
    useState<'Success' | 'Failed'>('Success');

  {/* Delete States */}
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  {/* Sort Data */}
  const [sortOption, setSortOption] = useState<string>('');

  {/* Filtered Data */}
  const filteredData = [...mockSystemData]
  .filter(item =>
    filterStatus === 'synced'
      ? item.syncStatus === 'Success'
      : item.syncStatus === 'Failed'
  )
  .sort((a, b) => {
    switch (sortOption) {
      case 'thesis-id-asc':
        return a.thesisId.localeCompare(b.thesisId);
      case 'thesis-id-desc':
        return b.thesisId.localeCompare(a.thesisId);
      case 'block-asc':
        return a.block.localeCompare(b.block);
      case 'block-desc':
        return b.block.localeCompare(a.block);
      case 'date-oldest':
        return new Date(a.lastUpdateDate).getTime() - new Date(b.lastUpdateDate).getTime();
      case 'date-newest':
        return new Date(b.lastUpdateDate).getTime() - new Date(a.lastUpdateDate).getTime();
      default:
        return 0;
    }
  });


  {/* Count Metrics */}
  const syncedCount = mockSystemData.filter(i => i.syncStatus === 'Success').length;
  const failedCount = mockSystemData.filter(i => i.syncStatus === 'Failed').length;

  {/* ========================= */}
  {/* Selection Functions */}
  const isFailedTab = filterStatus === 'failed';

  const activeSelectMode = isFailedTab ? failedSelectMode : isSelectMode;
  const activeSelectedIds = isFailedTab ? failedSelectedIds : selectedIds;

  const deleteCount = activeSelectedIds.length;
  const thesisLabel = deleteCount === 1 ? 'item' : 'items';

  const toggleSelectMode = () => {
    if (isFailedTab) {
      setFailedSelectMode(prev => !prev);
      setFailedSelectedIds([]);
    } else {
      setIsSelectMode(prev => !prev);
      setSelectedIds([]);
    }
  };

  {/* Select / Deselect All */}
  const handleSelectAll = () => {
    const ids = filteredData.map(item => item.id);

    if (isFailedTab) {
      setFailedSelectedIds(
        failedSelectedIds.length === ids.length ? [] : ids
      );
    } else {
      setSelectedIds(
        selectedIds.length === ids.length ? [] : ids
      );
    }
  };

  {/* Select / Deselect Single Item */}
  const toggleRowSelection = (id: string) => {
    if (isFailedTab) {
      setFailedSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
      if (!failedSelectMode) setFailedSelectMode(true);
    } else {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
      if (!isSelectMode) setIsSelectMode(true);
    }
  };

  {/* Modal & Detail Functions */}
  {/* View Details Modal */}
  const handleViewDetails = (item: SystemData) => {
    setSelectedThesis(item);
    setCurrentModalSyncStatus(item.syncStatus);
    setShowSuccess(false);
    setIsSyncing(false);
    setShowDetailsModal(true);
  };

  {/* Delete Modal Functions */}
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const [deletedCount, setDeletedCount] = useState(0);

  const handleConfirmDelete = () => {
    setDeletedCount(deleteCount > 0 ? deleteCount : 1);
    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
    setShowDetailsModal(false);
    handleClearSelection();
  };

  {/* Sync Functions */}
  {/* General Sync Now */}
  const handleSyncNow = () => {
    setIsSyncing(true);
    setShowSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setCurrentModalSyncStatus('Success');
      setShowSuccess(true);
    }, 2000);
  };

  {/* Failed Sync Now (with selected items handling) */}
  const handleFailedSyncNow = () => {
    setFailedIsSyncing(true);

    const countToSync =
      failedSelectMode && failedSelectedIds.length > 0
        ? failedSelectedIds.length
        : filteredData.length;

    setFailedSyncedCount(countToSync);

    setTimeout(() => {
      setFailedIsSyncing(false);
      setFailedShowSuccess(true);
      setFailedSelectMode(false);
      setFailedSelectedIds([]);
    }, 2000);
  };

  return (
    <>
      <Head title="System Archive" />

      <RepositoryLayout 
          breadcrumbs={breadcrumbs}
          pageHeader={pageHeader}
      >

      {/* <AppContent
        title="System Archive"
        subtitle="Browse and explore student thesis projects"
      > */}

        {/* Return Button */}
        <Link
          href="/admin/repository/resources"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6 font-dm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Return</span>
        </Link>

        {/* Storage Card */}
        <div className="mb-8">
          <SystemRepositoryStorage />
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Left: Toggle Group */}
          <div className="flex items-center gap-4">
            <ToggleGroup
              type="single"
              value={filterStatus}
              onValueChange={(value) =>
                value && setFilterStatus(value as "synced" | "failed")
              }
              className="flex"
            >
              <ToggleGroupItem
                value="synced"
                className="px-6 py-2 min-w-[220px] flex justify-center"
              >
                <span className="font-dm text-[13.33px] font-medium whitespace-nowrap cursor-pointer">
                  Synced Successfully ({syncedCount})
                </span>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="failed"
                className="px-6 py-2 min-w-[220px] flex justify-center"
              >
                <span className="font-dm text-[13.33px] font-medium whitespace-nowrap cursor-pointer">
                  Sync Failed ({failedCount})
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Right: Select Item and Sort */}
          <div className="flex items-center gap-3 relative">
            {/* Sync Now - only for failed tab */}
            {filterStatus === 'failed' && (
              !failedIsSyncing ? (
                <button
                  onClick={handleFailedSyncNow}
                  className="underline text-primary font-medium hover:opacity-80 h-10 flex items-center px-2 cursor-pointer"
                  type="button"
                >
                  Sync Now
                </button>
              ) : (
                <div
                  className="h-10 w-10 flex items-center justify-center"
                  aria-label="Syncing"
                >
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )
            )}

            {/* Select Item */}
            <button
              onClick={() => {
                if (isFailedTab) {
                  if (failedSelectMode) {
                    setFailedSelectMode(false);
                    setFailedSelectedIds([]);
                  } else {
                    setFailedSelectMode(true);
                  }
                } else {
                  if (isSelectMode) {
                    handleClearSelection();
                  } else {
                    setIsSelectMode(true);
                  }
                }
              }}
              className={`h-10 px-4 flex items-center rounded-lg border-[0.8px] font-dm text-[13.33px] font-medium transition-colors cursor-pointer ${
                activeSelectMode
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-primary/15 hover:bg-breadcrumb"
              }`}
            >
              {activeSelectMode ? (
                <>
                  <X size={16} />
                  <span className="mx-3 h-4 w-px bg-primary-foreground/40 cursor-pointer"/>
                  <span>{activeSelectedIds.length} Selected</span>
                </>
              ) : (
                <span>Select Item</span>
              )}
            </button>

            {/* Delete Button */}
            {activeSelectMode && activeSelectedIds.length > 0 && (
              <button
                onClick={handleDeleteClick}
                className="h-10 w-10 flex items-center justify-center rounded-lg border-[0.8px] border-primary/15 bg-background text-foreground hover:bg-breadcrumb transition-colors cursor-pointer"
                aria-label="Delete selected items"
              >
                <Trash2 size={16} />
              </button>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
                <div
                  className="w-[400px] rounded-lg bg-background p-6"
                  style={{
                    border: "1px solid var(--primary)",
                    boxShadow: "0 10px 20px rgb(115 0 0 / 0.25)",
                  }}
                >
                  <AlertCircle
                    size={48}
                    className="mx-auto mb-5"
                    style={{ color: "var(--primary)" }}
                  />
                  <p
                    className="mb-2 text-center font-dm font-medium text-body-2"
                    style={{ color: "var(--primary)" }}
                  >
                    Are you sure you want to delete {deleteCount} {thesisLabel} in this repository?
                  </p>
                  <p
                    className="mb-6 text-center font-dm text-body-4"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="secondary"
                      className="rounded-full px-8 cursor-pointer"
                      onClick={() => setShowDeleteConfirm(false)}
                      size="default"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="negative"
                      className="rounded-full px-8 cursor-pointer"
                      onClick={handleConfirmDelete}
                      size="default"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Success Modal */}
            {showDeleteSuccess && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
                <div
                  className="w-[400px] rounded-lg bg-background p-6"
                  style={{
                    border: "1px solid var(--alert-success)", // thinner green border
                    boxShadow: "0 10px 20px rgb(20 83 45 / 0.25)",
                  }}
                >
                  <CheckCircle
                    size={48}
                    className="mx-auto mb-5"
                    style={{ color: "var(--alert-success)" }}
                  />
                  <p
                    className="mb-6 text-center font-dm font-medium text-body-2"
                    style={{ color: "var(--alert-success)" }}
                  >
                    Successfully deleted {deletedCount} {deletedCount === 1 ? 'item' : 'items'}.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      variant="secondary"
                      className="rounded-full px-10 bg-alert-success text-primary-foreground hover:bg-alert-success cursor-pointer"
                      onClick={() => setShowDeleteSuccess(false)}
                      size="default"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Sort Button */}
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border-[0.8px] border-primary/15 bg-background text-foreground hover:bg-breadcrumb transition-colors font-dm text-[13.33px] font-medium cursor-pointer"
              >
                <Icon name="sortDefault" size={16} />
                <span>Sort</span>
              </button>

              <SortDropdown 
                isOpen={showSortDropdown} 
                onClose={() => setShowSortDropdown(false)}
                onApply={(sort) => setSortOption(sort)}
              />
            </div>
          </div>
        </div>

        {/* Failed Sync Success Modal */}
        {failedShowSuccess && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
            <div
              className="w-[400px] rounded-lg bg-background p-6"
              style={{
                border: "1px solid var(--alert-success)", // thin green border
                boxShadow: "0 10px 20px rgb(20 83 45 / 0.25)",
              }}
            >
              <CheckCircle
                size={48}
                className="mx-auto mb-5"
                style={{ color: "var(--alert-success)" }}
              />
              <p
                className="mb-6 text-center font-dm font-medium text-body-2"
                style={{ color: "var(--alert-success)" }}
              >
                Successfully synced {failedSyncedCount} {failedSyncedCount === 1 ? "item" : "items"}.
              </p>
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  className="rounded-full px-10 bg-alert-success text-primary-foreground hover:bg-alert-success cursor-pointer"
                  onClick={() => setFailedShowSuccess(false)}
                  size="default"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Table */}
        <div className="rounded-lg border-[0.8px] border-primary overflow-hidden">
          {/* Table Header */}
          <div
            className={`grid ${
              activeSelectMode
                ? "grid-cols-[40px_80px_minmax(240px,1fr)_120px_180px_120px]"
                : "grid-cols-[80px_minmax(240px,1fr)_120px_180px_120px]"
            } gap-[10px] h-10 bg-primary`}
          >
            {activeSelectMode && (
              <TableHead className="flex items-center justify-center px-[10px]">
                <Checkbox
                  checked={
                    activeSelectedIds.length === filteredData.length &&
                    filteredData.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}

            <TableHead className="flex items-center justify-center px-[10px]">
              <span className="text-primary-foreground font-dm text-[13.33px] font-medium">
                Thesis ID
              </span>
            </TableHead>

            <TableHead className="flex items-center justify-center px-[10px]">
              <span className="text-primary-foreground font-dm text-[13.33px] font-medium">
                Title
              </span>
            </TableHead>

            <TableHead className="flex items-center justify-center px-[10px]">
              <span className="text-primary-foreground font-dm text-[13.33px] font-medium">
                File Size
              </span>
            </TableHead>

            <TableHead className="flex items-center justify-center px-[10px]">
              <span className="text-primary-foreground font-dm text-[13.33px] font-medium">
                Last Update
              </span>
            </TableHead>

            <TableHead className="flex items-center justify-center px-[10px]">
              <span className="text-primary-foreground font-dm text-[13.33px] font-medium">
                Action
              </span>
            </TableHead>
          </div>

          {/* Table Body */}
          <div className="bg-background">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className={`grid ${
                  activeSelectMode
                    ? "grid-cols-[40px_80px_minmax(240px,1fr)_120px_180px_120px]"
                    : "grid-cols-[80px_minmax(240px,1fr)_120px_180px_120px]"
                } gap-[10px] h-10 border-b border-primary/10 hover:bg-breadcrumb/50 transition-colors`}
              >
                {activeSelectMode && (
                  <div className="flex items-center justify-center px-[10px]">
                    <Checkbox
                      checked={activeSelectedIds.includes(item.id)}
                      onCheckedChange={() => toggleRowSelection(item.id)}
                    />
                  </div>
                )}
                <div className="flex items-center justify-center px-[10px]">
                  <span className="text-foreground font-dm text-[13.33px] font-medium">
                    {item.thesisId}
                  </span>
                </div>
                <div className="flex items-center justify-start gap-2 px-[10px]">
                  <FileText className="h-[15px] w-[15px] text-primary flex-shrink-0" />
                  <span className="text-foreground font-dm text-[13.33px] font-medium truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center justify-center px-[10px]">
                  <span className="text-foreground font-dm text-[13.33px] font-medium">
                    {item.fileSize}
                  </span>
                </div>
                <div className="flex items-center justify-center text-center px-[10px]">
                  <span className="text-foreground font-dm text-[13.33px] font-medium">
                    {item.lastUpdate}
                  </span>
                </div>
                <div className="flex items-center justify-center px-[10px]">
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="h-8 px-4 min-w-[110px] flex items-center justify-center gap-[6px] rounded-lg border-[0.8px] border-primary/75 hover:bg-breadcrumb transition-colors whitespace-nowrap"
                  >
                    <span className="text-primary/75 font-dm text-[13.33px] font-medium cursor-pointer">
                      View Details
                    </span>
                  </button>
                </div>
              </div>
            ))}

            {/* Table Footer: Row Count */}
            <div
              className={`grid ${
                isSelectMode
                  ? "grid-cols-[40px_80px_minmax(240px,1fr)_120px_180px_120px]"
                  : "grid-cols-[80px_minmax(240px,1fr)_120px_180px_120px]"
              } gap-[10px] h-10 bg-background border-t border-primary/10`}
            >
              <div
                className={`${
                  isSelectMode ? "col-span-6" : "col-span-5"
                } flex items-center justify-center text-muted-foreground font-dm text-[13.33px] font-medium`}
              >
                {filterStatus === "synced"
                  ? `${filteredData.length} of ${mockSystemData.filter(
                      (i) => i.syncStatus === "Success"
                    ).length} Successfully Synced Theses`
                  : `${filteredData.length} of ${mockSystemData.filter(
                      (i) => i.syncStatus === "Failed"
                    ).length} Sync Failed Theses`}
              </div>
            </div>
          </div>
        </div>

        {/* Details Modal */}
          {showDetailsModal && selectedThesis && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="w-[456px] rounded-lg border-[0.8px] border-primary bg-background p-5 pb-[20.6px] flex flex-col gap-[22px] relative">
                
                {/* Close Button */}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 text-foreground hover:text-primary"
                >
                  <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-start justify-between border-b-[0.8px] border-primary pb-[5px] pr-8">
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
                    onClick={handleDeleteClick}
                    className="h-8 px-3 gap-[6px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    <Trash2 size={16} />
                    <span className="text-[12px] font-medium">Delete</span>
                  </Button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-[15px]">
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
                          {currentModalSyncStatus === 'Failed' && (
                            <button
                              onClick={handleSyncNow}
                              className="text-foreground font-dm text-[12px] font-medium underline hover:text-primary cursor-pointer"
                            >
                              Sync now
                            </button>
                          )}

                          <Badge
                            className={`rounded-[25px] px-[22px] py-[2px] border ${
                              currentModalSyncStatus === 'Failed'
                                ? 'bg-transparent border-primary text-primary'
                                : 'bg-transparent border-[#0D542B] text-[#0D542B]'
                            } hover:bg-transparent`}
                          >
                            <span className="text-[12px] font-medium">{currentModalSyncStatus}</span>
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
                    <p className="text-primary font-dm text-[16px] font-bold leading-normal">Storage</p>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-dm text-[15px] font-bold">Total Bytes</span>
                      <span className="text-foreground font-dm text-[15px] font-medium">{selectedThesis.totalBytes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-dm text-[15px] font-bold">Primary</span>
                      <span className="text-foreground font-dm text-[15px] font-medium">{selectedThesis.primary}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-dm text-[15px] font-bold">Replicated</span>
                      <span className="text-foreground font-dm text-[15px] font-medium">{selectedThesis.replicated}</span>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-2 gap-[10px]">
                    <div className="flex flex-col gap-1">
                      <p className="text-primary font-dm text-[16px] font-bold leading-normal">Last Update</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" strokeWidth={1.33} />
                        <span className="text-foreground font-dm text-[15px] font-medium">{selectedThesis.lastUpdateDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-primary font-dm text-[16px] font-bold leading-normal">Last Sync</p>
                      <div className="flex items-center gap-2">
                        {currentModalSyncStatus === 'Failed' ? (
                          <>
                            <AlertCircle size={16} className="text-primary" />
                            <span className="text-primary font-dm text-[15px] font-medium">Failed</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 text-primary" strokeWidth={1.33} />
                            <span className="text-foreground font-dm text-[15px] font-medium">
                              {selectedThesis.lastSyncDate || 'Date Today'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Block & Adviser */}
                  <div className="grid grid-cols-2 gap-[10px]">
                    <div className="flex flex-col gap-[1.6px]">
                      <p className="text-primary font-dm text-[16px] font-bold leading-normal">Block</p>
                      <div className="inline-flex items-center justify-center px-[5px] py-[5px] rounded-lg border-[0.8px] border-primary w-fit">
                        <span className="texst-foreground font-dm text-[12px] font-medium">{selectedThesis.block}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-primary font-dm text-[16px] font-bold leading-normal">Thesis Adviser</p>
                      <span className="text-foreground font-dm text-[15px] font-medium">{selectedThesis.thesisAdviser}</span>
                    </div>
                  </div>

                  {/* Proponents */}
                  <div className="flex flex-col gap-2">
                    <p className="text-primary font-dm text-[16px] font-bold leading-normal">Proponents</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedThesis.proponents.map((proponent: string, index: number) => (
                        <div key={index} className="inline-flex items-center gap-2 rounded-lg bg-[rgba(255,189,0,0.5)] px-[8.8px] py-[2.6px]">
                          <Icon name="proponentsDefault" size={12} />
                          <span className="text-foreground font-dm text-[12px] font-medium leading-[16px]">{proponent}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        
        {/* </AppContent> */}
      </RepositoryLayout>

    </>
  );
}