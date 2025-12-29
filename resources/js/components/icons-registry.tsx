import React from 'react';

import ArchiveIcon from './Icons/icons-registry-index/ic_archive';
import BackIcon from './Icons/icons-registry-index/ic_back';
import CalendarIcon from './Icons/icons-registry-index/ic_calendar';
import CheckIcon from './Icons/icons-registry-index/ic_check';
import CheckCircleIcon from './Icons/icons-registry-index/ic_checkCircle';
import ClockIcon from './Icons/icons-registry-index/ic_clock';
import CloseIcon from './Icons/icons-registry-index/ic_close';
import CommentIcon from './Icons/icons-registry-index/ic_comment';
import DashboardIcon from './Icons/icons-registry-index/ic_dashboard';
import DeleteIcon from './Icons/icons-registry-index/ic_delete';
import DeletetableIcon from './Icons/icons-registry-index/ic_deletetable';
import DocuIcon from './Icons/icons-registry-index/ic_docu';
import DownloadIcon from './Icons/icons-registry-index/ic_download';
import EditIcon from './Icons/icons-registry-index/ic_edit';
import EdittableIcon from './Icons/icons-registry-index/ic_edittable';
import EyecloseIcon from './Icons/icons-registry-index/ic_eyeclose';
import EyeopenIcon from './Icons/icons-registry-index/ic_eyeopen';
import FaqIcon from './Icons/icons-registry-index/ic_faq';
import FeedbackIcon from './Icons/icons-registry-index/ic_feedback';
import FilesIcon from './Icons/icons-registry-index/ic_files';
import GotoIcon from './Icons/icons-registry-index/ic_goto';
import HomeIcon from './Icons/icons-registry-index/ic_home';
import LogoutIcon from './Icons/icons-registry-index/ic_logout';
import MenuIcon from './Icons/icons-registry-index/ic_menu';
import MessageIcon from './Icons/icons-registry-index/ic_message';
import MoreIcon from './Icons/icons-registry-index/ic_more';
import NficonsManagementIcon from './Icons/icons-registry-index/ic_nficons-management';
import NficonsNegativeAlertIcon from './Icons/icons-registry-index/ic_nficons-negative_alert';
import NficonsPanelsIcon from './Icons/icons-registry-index/ic_nficons-panels';
import NficonsPositiveAlertIcon from './Icons/icons-registry-index/ic_nficons-positive_alert';
import NficonsReminderIcon from './Icons/icons-registry-index/ic_nficons-reminder';
import NotificationIcon from './Icons/icons-registry-index/ic_notification';
import NotifyIcon from './Icons/icons-registry-index/ic_notify';
import PeopleIcon from './Icons/icons-registry-index/ic_people';
import ProfileIcon from './Icons/icons-registry-index/ic_profile';
import ProponentsIcon from './Icons/icons-registry-index/ic_proponents';
import RepoIcon from './Icons/icons-registry-index/ic_repo';
import SearchIcon from './Icons/icons-registry-index/ic_search';
import SettingsIcon from './Icons/icons-registry-index/ic_settings';
import ShareIcon from './Icons/icons-registry-index/ic_share';
import SignIcon from './Icons/icons-registry-index/ic_sign';
import SortIcon from './Icons/icons-registry-index/ic_sort';
import TableIcon from './Icons/icons-registry-index/ic_table';
import UploadIcon from './Icons/icons-registry-index/ic_upload';

const wrap = (Comp: any, variant?: string) => {
  const W: React.FC<any> = (props) => <Comp variant={(variant as any) || 'default'} {...props} />;
  return W;
};

export const iconRegistry = {
  archiveClicked: wrap(ArchiveIcon, 'clicked'),
  archiveDefault: wrap(ArchiveIcon, 'default'),
  archiveHover: wrap(ArchiveIcon, 'hover'),
  backClicked: wrap(BackIcon, 'clicked'),
  backDefault: wrap(BackIcon, 'default'),
  backHover: wrap(BackIcon, 'hover'),
  calendarClicked: wrap(CalendarIcon, 'clicked'),
  calendarDefault: wrap(CalendarIcon, 'default'),
  calendarHover: wrap(CalendarIcon, 'hover'),
  checkClicked: wrap(CheckIcon, 'clicked'),
  checkDefault: wrap(CheckIcon, 'default'),
  checkHover: wrap(CheckIcon, 'hover'),
  checkCircleClicked: wrap(CheckCircleIcon, 'clicked'),
  checkCircleDefault: wrap(CheckCircleIcon, 'default'),
  checkCircleHover: wrap(CheckCircleIcon, 'hover'),
  clockClicked: wrap(ClockIcon, 'clicked'),
  clockDefault: wrap(ClockIcon, 'default'),
  clockHover: wrap(ClockIcon, 'hover'),
  closeClicked: wrap(CloseIcon, 'clicked'),
  closeDefault: wrap(CloseIcon, 'default'),
  closeHover: wrap(CloseIcon, 'hover'),
  commentClicked: wrap(CommentIcon, 'clicked'),
  commentDefault: wrap(CommentIcon, 'default'),
  commentHover: wrap(CommentIcon, 'hover'),
  dashboardClicked: wrap(DashboardIcon, 'clicked'),
  dashboardDefault: wrap(DashboardIcon, 'default'),
  dashboardHover: wrap(DashboardIcon, 'hover'),
  deleteClicked: wrap(DeleteIcon, 'clicked'),
  deleteDefault: wrap(DeleteIcon, 'default'),
  deleteHover: wrap(DeleteIcon, 'hover'),
  deletetableDefault: wrap(DeletetableIcon, 'default'),
  deletetableVariant2: wrap(DeletetableIcon, 'variant2'),
  docuClicked: wrap(DocuIcon, 'clicked'),
  docuDefault: wrap(DocuIcon, 'default'),
  docuHover: wrap(DocuIcon, 'hover'),
  downloadClicked: wrap(DownloadIcon, 'clicked'),
  downloadDefault: wrap(DownloadIcon, 'default'),
  downloadHover: wrap(DownloadIcon, 'hover'),
  editClicked: wrap(EditIcon, 'clicked'),
  editDefault: wrap(EditIcon, 'default'),
  editHover: wrap(EditIcon, 'hover'),
  edittableDefault: wrap(EdittableIcon, 'default'),
  edittableVariant2: wrap(EdittableIcon, 'variant2'),
  eyecloseClicked: wrap(EyecloseIcon, 'clicked'),
  eyecloseDefault: wrap(EyecloseIcon, 'default'),
  eyecloseHover: wrap(EyecloseIcon, 'hover'),
  eyeopenClicked: wrap(EyeopenIcon, 'clicked'),
  eyeopenDefault: wrap(EyeopenIcon, 'default'),
  eyeopenHover: wrap(EyeopenIcon, 'hover'),
  faqClicked: wrap(FaqIcon, 'clicked'),
  faqDefault: wrap(FaqIcon, 'default'),
  faqHover: wrap(FaqIcon, 'hover'),
  feedbackClicked: wrap(FeedbackIcon, 'clicked'),
  feedbackDefault: wrap(FeedbackIcon, 'default'),
  feedbackHover: wrap(FeedbackIcon, 'hover'),
  filesClicked: wrap(FilesIcon, 'clicked'),
  filesDefault: wrap(FilesIcon, 'default'),
  filesHover: wrap(FilesIcon, 'hover'),
  gotoClicked: wrap(GotoIcon, 'clicked'),
  gotoDefault: wrap(GotoIcon, 'default'),
  gotoHover: wrap(GotoIcon, 'hover'),
  homeClicked: wrap(HomeIcon, 'clicked'),
  homeDefault: wrap(HomeIcon, 'default'),
  homeHover: wrap(HomeIcon, 'hover'),
  logoutClicked: wrap(LogoutIcon, 'clicked'),
  logoutDefault: wrap(LogoutIcon, 'default'),
  logoutHover: wrap(LogoutIcon, 'hover'),
  menuClicked: wrap(MenuIcon, 'clicked'),
  menuDefault: wrap(MenuIcon, 'default'),
  menuHover: wrap(MenuIcon, 'hover'),
  messageClicked: wrap(MessageIcon, 'clicked'),
  messageDefault: wrap(MessageIcon, 'default'),
  messageHover: wrap(MessageIcon, 'hover'),
  moreClicked: wrap(MoreIcon, 'clicked'),
  moreDefault: wrap(MoreIcon, 'default'),
  moreHover: wrap(MoreIcon, 'hover'),
  nficonsManagement: wrap(NficonsManagementIcon, 'default'),
  nficonsNegativeAlert: wrap(NficonsNegativeAlertIcon, 'default'),
  nficonsPanels: wrap(NficonsPanelsIcon, 'default'),
  nficonsPositiveAlert: wrap(NficonsPositiveAlertIcon, 'default'),
  nficonsReminder: wrap(NficonsReminderIcon, 'default'),
  notificationClicked: wrap(NotificationIcon, 'clicked'),
  notificationDefault: wrap(NotificationIcon, 'default'),
  notificationHover: wrap(NotificationIcon, 'hover'),
  notifyClicked: wrap(NotifyIcon, 'clicked'),
  notifyDefault: wrap(NotifyIcon, 'default'),
  notifyHover: wrap(NotifyIcon, 'hover'),
  peopleBold: wrap(PeopleIcon, 'bold'),
  peopleLinear: wrap(PeopleIcon, 'linear'),
  peopleTwotone: wrap(PeopleIcon, 'twotone'),
  profileClicked: wrap(ProfileIcon, 'clicked'),
  profileDefault: wrap(ProfileIcon, 'default'),
  profileHover: wrap(ProfileIcon, 'hover'),
  proponentsClicked: wrap(ProponentsIcon, 'clicked'),
  proponentsDefault: wrap(ProponentsIcon, 'default'),
  proponentsHover: wrap(ProponentsIcon, 'hover'),
  repoClicked: wrap(RepoIcon, 'clicked'),
  repoDefault: wrap(RepoIcon, 'default'),
  repoHover: wrap(RepoIcon, 'hover'),
  searchClicked1: wrap(SearchIcon, 'clicked1'),
  searchClicked: wrap(SearchIcon, 'clicked'),
  searchDefault: wrap(SearchIcon, 'default'),
  settingsClicked: wrap(SettingsIcon, 'clicked'),
  settingsDefault: wrap(SettingsIcon, 'default'),
  settingsHover: wrap(SettingsIcon, 'hover'),
  shareClicked: wrap(ShareIcon, 'clicked'),
  shareDefault: wrap(ShareIcon, 'default'),
  shareHover: wrap(ShareIcon, 'hover'),
  signClicked: wrap(SignIcon, 'clicked'),
  signDefault: wrap(SignIcon, 'default'),
  signHover: wrap(SignIcon, 'hover'),
  sortClicked: wrap(SortIcon, 'clicked'),
  sortDefault: wrap(SortIcon, 'default'),
  sortHover: wrap(SortIcon, 'hover'),
  tableClicked: wrap(TableIcon, 'clicked'),
  tableDefault: wrap(TableIcon, 'default'),
  tableHover: wrap(TableIcon, 'hover'),
  uploadClicked: wrap(UploadIcon, 'clicked'),
  uploadDefault: wrap(UploadIcon, 'default'),
  uploadHover: wrap(UploadIcon, 'hover'),
};

export type IconName = keyof typeof iconRegistry;