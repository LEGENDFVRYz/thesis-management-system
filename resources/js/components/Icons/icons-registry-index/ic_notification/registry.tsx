import NotificationClicked from '../../ic_notification-Clicked-ic_notification2-notification.svg';
import NotificationDefault from '../../ic_notification-Default-ic_notification2-notification.svg';
import NotificationHover from '../../ic_notification-Hover-ic_notification2-notification.svg';

export const registry = {
  clicked: NotificationClicked,
  default: NotificationDefault,
  hover: NotificationHover,
};

export type Variant = keyof typeof registry;
