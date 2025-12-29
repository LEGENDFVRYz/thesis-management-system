import BasicBadgesPrimaryBadge from "./badges/basic_badges-primary_badge.svg?react";
import BasicBadgesSecondaryBadge from "./badges/basic_badges-secondary_badge.svg?react";
import BasicBadgesTertiaryBadge from "./badges/basic_badges-tertiary_badge.svg?react";
import BasicBadgesHighlightedBadge from "./badges/basic_badges-highlighted_badge.svg?react";
import ChangesBadgesTitleChange from "./badges/changes_badges-Title_Change.svg?react";
import ChangesBadgesScopeChange from "./badges/changes_badges-Scope_Change.svg?react";
import ChangesBadgesMethodologyChange from "./badges/changes_badges-Methodology_Change.svg?react";
import CommitteeBadgesForReview from "./badges/committee_badges-For_Review.svg?react";
import CommitteeBadgesUnderEval from "./badges/committee_badges-Under_Eval.svg?react";
import CommitteeBadgesEvaluated from "./badges/committee_badges-Evaluated.svg?react";
import CommitteeBadgev2Approved from "./badges/committee_badgev2-Approved.svg?react";
import CommitteeBadgev2Submitted from "./badges/committee_badgev2-Submitted.svg?react";
import CommitteeBadgev2Rejected from "./badges/committee_badgev2-Rejected.svg?react";
import CommitteeBadgev2ForRevision from "./badges/committee_badgev2-For_Revision.svg?react";
import EndorsementBadgesEndorsed from "./badges/endorsement_badges-Endorsed.svg?react";
import EndorsementBadgesPending from "./badges/endorsement_badges-Pending.svg?react";
import FacultyBadgesAdviser from "./badges/faculty_badges-Adviser.svg?react";
import FacultyBadgesAdmin from "./badges/faculty_badges-Admin.svg?react";
import FacultyBadgesAwards from "./badges/faculty_badges-Awards.svg?react";
import FacultyBadgesStudent from "./badges/faculty_badges-Student.svg?react";
import FacultyBadgesPanel from "./badges/faculty_badges-Panel.svg?react";
import FacultyBadgesCoordinator from "./badges/faculty_badges-Coordinator.svg?react";
import FacultyBadgesCommittee from "./badges/faculty_badges-Committee.svg?react";
import ScheduledBadgesScheduled from "./badges/scheduled_badges-Scheduled.svg?react";
import ScheduledBadgesCompleted from "./badges/scheduled_badges-Completed.svg?react";
import ScheduledBadgesCancelled from "./badges/scheduled_badges-Cancelled.svg?react";
import StatusBadgeApproved from "./badges/status_badge-Approved.svg?react";
import StatusBadgeDenied from "./badges/status_badge-Denied.svg?react";
import StatusBadgePendingReview from "./badges/status_badge-Pending_Review.svg?react";
import VerdictBadgesApproved from "./badges/verdict_badges-Approved.svg?react";
import VerdictBadgesForRevision from "./badges/verdict_badges-For_Revision.svg?react";
import VerdictBadgesRejected from "./badges/verdict_badges-Rejected.svg?react";

export const badgesRegistry = {
  basicBadgesPrimaryBadge: BasicBadgesPrimaryBadge,
  basicBadgesSecondaryBadge: BasicBadgesSecondaryBadge,
  basicBadgesTertiaryBadge: BasicBadgesTertiaryBadge,
  basicBadgesHighlightedBadge: BasicBadgesHighlightedBadge,
  changesBadgesTitleChange: ChangesBadgesTitleChange,
  changesBadgesScopeChange: ChangesBadgesScopeChange,
  changesBadgesMethodologyChange: ChangesBadgesMethodologyChange,
  committeeBadgesForReview: CommitteeBadgesForReview,
  committeeBadgesUnderEval: CommitteeBadgesUnderEval,
  committeeBadgesEvaluated: CommitteeBadgesEvaluated,
  committeeBadgev2Approved: CommitteeBadgev2Approved,
  committeeBadgev2Submitted: CommitteeBadgev2Submitted,
  committeeBadgev2Rejected: CommitteeBadgev2Rejected,
  committeeBadgev2ForRevision: CommitteeBadgev2ForRevision,
  endorsementBadgesEndorsed: EndorsementBadgesEndorsed,
  endorsementBadgesPending: EndorsementBadgesPending,
  facultyBadgesAdviser: FacultyBadgesAdviser,
  facultyBadgesAdmin: FacultyBadgesAdmin,
  facultyBadgesAwards: FacultyBadgesAwards,
  facultyBadgesStudent: FacultyBadgesStudent,
  facultyBadgesPanel: FacultyBadgesPanel,
  facultyBadgesCoordinator: FacultyBadgesCoordinator,
  facultyBadgesCommittee: FacultyBadgesCommittee,
  scheduledBadgesScheduled: ScheduledBadgesScheduled,
  scheduledBadgesCompleted: ScheduledBadgesCompleted,
  scheduledBadgesCancelled: ScheduledBadgesCancelled,
  statusBadgeApproved: StatusBadgeApproved,
  statusBadgeDenied: StatusBadgeDenied,
  statusBadgePendingReview: StatusBadgePendingReview,
  verdictBadgesApproved: VerdictBadgesApproved,
  verdictBadgesForRevision: VerdictBadgesForRevision,
  verdictBadgesRejected: VerdictBadgesRejected,
} as const;

export type BadgeName = keyof typeof badgesRegistry;
