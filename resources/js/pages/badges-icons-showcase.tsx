import { Head } from '@inertiajs/react';
import { Icon } from '@/components/icon-index';
import { IconName } from '@/components/icons-registry';
import { Badge } from '@/components/badges-index';
import { BadgeName } from '@/components/badges-registry';

export default function BadgesIconsShowcase() {
    // Icon categories organized by state
    const iconSets = [
        {
            category: 'Archive',
            icons: ['archiveDefault', 'archiveHover', 'archiveClicked'] as IconName[]
        },
        {
            category: 'Back',
            icons: ['backDefault', 'backHover', 'backClicked'] as IconName[]
        },
        {
            category: 'Calendar',
            icons: ['calendarDefault', 'calendarHover', 'calendarClicked'] as IconName[]
        },
        {
            category: 'Check',
            icons: ['checkDefault', 'checkHover', 'checkClicked'] as IconName[]
        },
        {
            category: 'Check Circle',
            icons: ['checkCircleDefault', 'checkCircleHover', 'checkCircleClicked'] as IconName[]
        },
        {
            category: 'Clock',
            icons: ['clockDefault', 'clockHover', 'clockClicked'] as IconName[]
        },
        {
            category: 'Close',
            icons: ['closeDefault', 'closeHover', 'closeClicked'] as IconName[]
        },
        {
            category: 'Comment',
            icons: ['commentDefault', 'commentHover', 'commentClicked'] as IconName[]
        },
        {
            category: 'Dashboard',
            icons: ['dashboardDefault', 'dashboardHover', 'dashboardClicked'] as IconName[]
        },
        {
            category: 'Delete',
            icons: ['deleteDefault', 'deleteHover', 'deleteClicked', 'deletetableDefault', 'deletetableVariant2'] as IconName[]
        },
        {
            category: 'Document',
            icons: ['docuDefault', 'docuHover', 'docuClicked'] as IconName[]
        },
        {
            category: 'Download',
            icons: ['downloadDefault', 'downloadHover', 'downloadClicked'] as IconName[]
        },
        {
            category: 'Edit',
            icons: ['editDefault', 'editHover', 'editClicked', 'edittableDefault', 'edittableVariant2'] as IconName[]
        },
        {
            category: 'Eye Close',
            icons: ['eyecloseDefault', 'eyecloseHover', 'eyecloseClicked'] as IconName[]
        },
        {
            category: 'Eye Open',
            icons: ['eyeopenDefault', 'eyeopenHover', 'eyeopenClicked'] as IconName[]
        },
        {
            category: 'FAQ',
            icons: ['faqDefault', 'faqHover', 'faqClicked'] as IconName[]
        },
        {
            category: 'Feedback',
            icons: ['feedbackDefault', 'feedbackHover', 'feedbackClicked'] as IconName[]
        },
        {
            category: 'Files',
            icons: ['filesDefault', 'filesHover', 'filesClicked'] as IconName[]
        },
        {
            category: 'Goto',
            icons: ['gotoDefault', 'gotoHover', 'gotoClicked'] as IconName[]
        },
        {
            category: 'Home',
            icons: ['homeDefault', 'homeHover', 'homeClicked'] as IconName[]
        },
        {
            category: 'Logout',
            icons: ['logoutDefault', 'logoutHover', 'logoutClicked'] as IconName[]
        },
        {
            category: 'Menu',
            icons: ['menuDefault', 'menuHover', 'menuClicked'] as IconName[]
        },
        {
            category: 'Message',
            icons: ['messageDefault', 'messageHover', 'messageClicked'] as IconName[]
        },
        {
            category: 'More',
            icons: ['moreDefault', 'moreHover', 'moreClicked'] as IconName[]
        },
        {
            category: 'Notification',
            icons: ['notificationDefault', 'notificationHover', 'notificationClicked'] as IconName[]
        },
        {
            category: 'Notify',
            icons: ['notifyDefault', 'notifyHover', 'notifyClicked'] as IconName[]
        },
        {
            category: 'People',
            icons: ['peopleLinear', 'peopleBold', 'peopleTwotone'] as IconName[]
        },
        {
            category: 'Profile',
            icons: ['profileDefault', 'profileHover', 'profileClicked'] as IconName[]
        },
        {
            category: 'Proponents',
            icons: ['proponentsDefault', 'proponentsHover', 'proponentsClicked'] as IconName[]
        },
        {
            category: 'Quicklink (size: 127)',
            icons: ['quicklinkPeople', 'quicklinkPeopleHover', 'quicklinkRepository', 'quicklinkRepositoryHover', 'quicklinkCalendar', 'quicklinkCalendarHover', 'quicklinkManagement', 'quicklinkManagementHover'] as IconName[]
        },
        {
            category: 'Repository',
            icons: ['repoDefault', 'repoHover', 'repoClicked'] as IconName[]
        },
        {
            category: 'Search',
            icons: ['searchDefault', 'searchClicked', 'searchClicked1'] as IconName[]
        },
        {
            category: 'Settings',
            icons: ['settingsDefault', 'settingsHover', 'settingsClicked'] as IconName[]
        },
        {
            category: 'Share',
            icons: ['shareDefault', 'shareHover', 'shareClicked'] as IconName[]
        },
        {
            category: 'Sign',
            icons: ['signDefault', 'signHover', 'signClicked'] as IconName[]
        },
        {
            category: 'Sort',
            icons: ['sortDefault', 'sortHover', 'sortClicked'] as IconName[]
        },
        {
            category: 'Table',
            icons: ['tableDefault', 'tableHover', 'tableClicked'] as IconName[]
        },
        {
            category: 'Upload',
            icons: ['uploadDefault', 'uploadHover', 'uploadClicked'] as IconName[]
        },
        {
            category: 'Notification Icons',
            icons: ['nficonsManagement', 'nficonsNegativeAlert', 'nficonsPanels', 'nficonsPositiveAlert', 'nficonsReminder'] as IconName[]
        },
        {
            category: 'Other',
            icons: ['about'] as IconName[]
        }
    ];

    // Badge categories
    const basicBadges: BadgeName[] = [
        'basicBadgesPrimaryBadge',
        'basicBadgesSecondaryBadge',
        'basicBadgesTertiaryBadge',
        'basicBadgesHighlightedBadge',
    ];

    const changesBadges: BadgeName[] = [
        'changesBadgesTitleChange',
        'changesBadgesScopeChange',
        'changesBadgesMethodologyChange',
    ];

    const committeeBadges: BadgeName[] = [
        'committeeBadgesForReview',
        'committeeBadgesUnderEval',
        'committeeBadgesEvaluated',
    ];

    const committeeBadgesV2: BadgeName[] = [
        'committeeBadgev2Approved',
        'committeeBadgev2Submitted',
        'committeeBadgev2Rejected',
        'committeeBadgev2ForRevision',
    ];

    const endorsementBadges: BadgeName[] = [
        'endorsementBadgesEndorsed',
        'endorsementBadgesPending',
    ];

    const facultyBadges: BadgeName[] = [
        'facultyBadgesAdviser',
        'facultyBadgesAdmin',
        'facultyBadgesAwards',
        'facultyBadgesStudent',
        'facultyBadgesPanel',
        'facultyBadgesCoordinator',
        'facultyBadgesCommittee',
    ];

    const scheduledBadges: BadgeName[] = [
        'scheduledBadgesScheduled',
        'scheduledBadgesCompleted',
        'scheduledBadgesCancelled',
    ];

    const statusBadges: BadgeName[] = [
        'statusBadgeApproved',
        'statusBadgeDenied',
        'statusBadgePendingReview',
    ];

    const verdictBadges: BadgeName[] = [
        'verdictBadgesApproved',
        'verdictBadgesForRevision',
        'verdictBadgesRejected',
    ];

    return (
        <>
            <Head title="Badges & Icons Showcase" />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Badges & Icons Showcase
                        </h1>
                        <p className="text-lg text-gray-600">
                            Display of all available badges and icons in the system
                        </p>
                    </div>

                    {/* Icons Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Icons</h2>

                        {iconSets.map((iconSet) => (
                            <div key={iconSet.category} className="mb-8 last:mb-0">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">{iconSet.category}</h3>
                                <div className={iconSet.category === 'Quicklink (size: 127)'
                                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                                    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"}>
                                    {iconSet.icons.map((iconName) => (
                                        <div
                                            key={iconName}
                                            className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <Icon
                                                name={iconName}
                                                size={iconSet.category === 'Quicklink (size: 127)' ? 127 : 48}
                                            />
                                            <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                                {iconName}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Basic Badges Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Badges (default size: 24)</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {basicBadges.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Changes Badges Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes Badges</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {changesBadges.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Committee Badges Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Committee Badges</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {committeeBadges.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Committee Badges V2 Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Committee Badges V2</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {committeeBadgesV2.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Endorsement Badges Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Endorsement Badges</h2>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                            {endorsementBadges.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Faculty Badges Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Faculty Badges</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                            {facultyBadges.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scheduled Badges Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Scheduled Badges</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {scheduledBadges.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Badges Section */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Status Badges</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {statusBadges.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verdict Badges Section */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Verdict Badges</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {verdictBadges.map((badgeName) => (
                                <div
                                    key={badgeName}
                                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <Badge name={badgeName} size={64} />
                                    <p className="mt-2 text-xs text-gray-600 text-center break-all">
                                        {badgeName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
