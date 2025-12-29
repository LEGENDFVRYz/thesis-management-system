import CalendarClicked from '../../ic_calendar-Clicked.svg';
import CalendarDefault from '../../ic_calendar-Default.svg';
import CalendarHover from '../../ic_calendar-Hover.svg';

export const registry = {
  clicked: CalendarClicked,
  default: CalendarDefault,
  hover: CalendarHover,
};

export type Variant = keyof typeof registry;
