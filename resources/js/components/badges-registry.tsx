import BasicBadgesPrimaryBadge from "./badges/basic_badges-primary_badge.svg";
import BasicBadgesSecondaryBadge from "./badges/basic_badges-secondary_badge.svg";
import BasicBadgesTertiaryBadge from "./badges/basic_badges-tertiary_badge.svg";
import BasicBadgesHighlightedBadge from "./badges/basic_badges-highlighted_badge.svg";
import ChangesBadgesTitleChange from "./badges/changes_badges-Title_Change.svg";
import ChangesBadgesScopeChange from "./badges/changes_badges-Scope_Change.svg";
import ChangesBadgesMethodologyChange from "./badges/changes_badges-Methodology_Change.svg";
import CommitteeBadgesForReview from "./badges/committee_badges-For_Review.svg";
import CommitteeBadgesUnderEval from "./badges/committee_badges-Under_Eval.svg";
import CommitteeBadgesEvaluated from "./badges/committee_badges-Evaluated.svg";
import CommitteeBadgev2Approved from "./badges/committee_badgev2-Approved.svg";
import CommitteeBadgev2Submitted from "./badges/committee_badgev2-Submitted.svg";
import CommitteeBadgev2Rejected from "./badges/committee_badgev2-Rejected.svg";
import CommitteeBadgev2ForRevision from "./badges/committee_badgev2-For_Revision.svg";
import EndorsementBadgesEndorsed from "./badges/endorsement_badges-Endorsed.svg";
import EndorsementBadgesPending from "./badges/endorsement_badges-Pending.svg";
import FacultyBadgesAdviser from "./badges/faculty_badges-Adviser.svg";
import FacultyBadgesAdmin from "./badges/faculty_badges-Admin.svg";
import FacultyBadgesAwards from "./badges/faculty_badges-Awards.svg";
import FacultyBadgesStudent from "./badges/faculty_badges-Student.svg";
import FacultyBadgesPanel from "./badges/faculty_badges-Panel.svg";
import FacultyBadgesCoordinator from "./badges/faculty_badges-Coordinator.svg";
import FacultyBadgesCommittee from "./badges/faculty_badges-Committee.svg";
import ScheduledBadgesScheduled from "./badges/scheduled_badges-Scheduled.svg";
import ScheduledBadgesCompleted from "./badges/scheduled_badges-Completed.svg";
import ScheduledBadgesCancelled from "./badges/scheduled_badges-Cancelled.svg";
import StatusBadgeApproved from "./badges/status_badge-Approved.svg";
import StatusBadgeDenied from "./badges/status_badge-Denied.svg";
import StatusBadgePendingReview from "./badges/status_badge-Pending_Review.svg";
import VerdictBadgesApproved from "./badges/verdict_badges-Approved.svg";
import VerdictBadgesForRevision from "./badges/verdict_badges-For_Revision.svg";
import VerdictBadgesRejected from "./badges/verdict_badges-Rejected.svg";

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
