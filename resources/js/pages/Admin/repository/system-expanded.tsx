import { Head } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { SystemRepositoryStorage } from '@/components/system-repository-storage';

export default function SystemRepositoryExpanded() {
  return (
    <>
      <Head title="System Repository - All Files" />
      <AppHeader />

      <AppContent
        title="System Repository"
        subtitle="View all system files and storage details"
      >
        {/* Storage Card */}
        <div className="mb-8">
          <SystemRepositoryStorage />
        </div>

        {/* Placeholder for expanded content - to be implemented */}
        <div className="rounded-lg border-[0.8px] border-primary bg-background p-8">
          <p className="text-muted-foreground text-center font-dm">
            Expanded view content will be added here
          </p>
        </div>
      </AppContent>

      <NavFooter />
    </>
  );
}