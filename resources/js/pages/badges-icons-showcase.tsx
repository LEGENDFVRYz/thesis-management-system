import React from 'react';
import { Icon } from '@/components/icon-index';
import { Badge } from '@/components/badges-index';
import { IconName } from '@/components/icons-registry';
import { BadgeName } from '@/components/badges-registry';

export default function BadgesIconsShowcase() {
  // Icon categories with correct camelCase names
  const iconCategories = {
    'Navigation': [
      'homeDefault', 'homeClicked', 'homeHover',
      'dashboardDefault', 'dashboardClicked', 'dashboardHover',
      'backDefault', 'backClicked', 'backHover',
      'gotoDefault', 'gotoClicked', 'gotoHover',
    ],
    'Actions': [
      'editDefault', 'editClicked', 'editHover',
      'deleteDefault', 'deleteClicked', 'deleteHover',
      'checkDefault', 'checkClicked', 'checkHover',
      'closeDefault', 'closeClicked', 'closeHover',
    ],
    'Files & Documents': [
      'filesDefault', 'filesClicked', 'filesHover',
      'docuDefault', 'docuClicked', 'docuHover',
      'uploadDefault', 'uploadClicked', 'uploadHover',
      'downloadDefault', 'downloadClicked', 'downloadHover',
    ],
    'Communication': [
      'messageDefault', 'messageClicked', 'messageHover',
      'commentDefault', 'commentClicked', 'commentHover',
      'notificationDefault', 'notificationClicked', 'notificationHover',
      'feedbackDefault', 'feedbackClicked', 'feedbackHover',
    ],
    'User & Profile': [
      'profileDefault', 'profileClicked', 'profileHover',
      'proponentsDefault', 'proponentsClicked', 'proponentsHover',
      'peopleLinear', 'peopleBold', 'peopleTwotone',
    ],
    'System & Settings': [
      'settingsDefault', 'settingsClicked', 'settingsHover',
      'menuDefault', 'menuClicked', 'menuHover',
      'searchDefault', 'searchClicked', 'searchClicked1',
      'sortDefault', 'sortClicked', 'sortHover',
    ],
    'Visibility': [
      'eyeopenDefault', 'eyeopenClicked', 'eyeopenHover',
      'eyecloseDefault', 'eyecloseClicked', 'eyecloseHover',
    ],
    'Data & Tables': [
      'tableDefault', 'tableClicked', 'tableHover',
      'edittableDefault', 'edittableVariant2',
      'deletetableDefault', 'deletetableVariant2',
    ],
    'Time & Calendar': [
      'calendarDefault', 'calendarClicked', 'calendarHover',
      'clockDefault', 'clockClicked', 'clockHover',
    ],
    'Other': [
      'archiveDefault', 'archiveClicked', 'archiveHover',
      'repoDefault', 'repoClicked', 'repoHover',
      'shareDefault', 'shareClicked', 'shareHover',
      'signDefault', 'signClicked', 'signHover',
      'faqDefault', 'faqClicked', 'faqHover',
      'logoutDefault', 'logoutClicked', 'logoutHover',
      'moreDefault', 'moreClicked', 'moreHover',
      'checkCircleDefault', 'checkCircleClicked', 'checkCircleHover',
      'nficonsManagement', 'nficonsNegativeAlert', 'nficonsPanels',
      'nficonsPositiveAlert', 'nficonsReminder',
      'notifyDefault', 'notifyClicked', 'notifyHover',
    ],
  };

  // Badge categories with correct camelCase names
  const badgeCategories = {
    'Basic Badges': [
      'basicBadgesPrimaryBadge',
      'basicBadgesSecondaryBadge',
      'basicBadgesTertiaryBadge',
      'basicBadgesHighlightedBadge',
    ],
    'Faculty Badges': [
      'facultyBadgesAdviser',
      'facultyBadgesAdmin',
      'facultyBadgesAwards',
      'facultyBadgesStudent',
      'facultyBadgesPanel',
      'facultyBadgesCoordinator',
      'facultyBadgesCommittee',
    ],
    'Status Badges': [
      'statusBadgeApproved',
      'statusBadgeDenied',
      'statusBadgePendingReview',
    ],
    'Committee Badges': [
      'committeeBadgesForReview',
      'committeeBadgesUnderEval',
      'committeeBadgesEvaluated',
      'committeeBadgev2Approved',
      'committeeBadgev2Submitted',
      'committeeBadgev2Rejected',
      'committeeBadgev2ForRevision',
    ],
    'Endorsement Badges': [
      'endorsementBadgesEndorsed',
      'endorsementBadgesPending',
    ],
    'Verdict Badges': [
      'verdictBadgesApproved',
      'verdictBadgesForRevision',
      'verdictBadgesRejected',
    ],
    'Changes Badges': [
      'changesBadgesTitleChange',
      'changesBadgesScopeChange',
      'changesBadgesMethodologyChange',
    ],
    'Scheduled Badges': [
      'scheduledBadgesScheduled',
      'scheduledBadgesCompleted',
      'scheduledBadgesCancelled',
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Design System Showcase</h1>

        {/* Icons Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Icons</h2>

          {Object.entries(iconCategories).map(([category, icons]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-gray-700">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {icons.map((iconName) => (
                  <div
                    key={iconName}
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Icon name={iconName as IconName} size={32} />
                    <span className="mt-2 text-xs text-gray-600 text-center break-all">
                      {iconName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Badges</h2>

          {Object.entries(badgeCategories).map(([category, badges]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-gray-700">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badgeName) => (
                  <div
                    key={badgeName}
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Badge name={badgeName as BadgeName} size={100} />
                    <span className="mt-2 text-xs text-gray-600 text-center break-all">
                      {badgeName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
