import ClockClicked from '../../ic_clock-Clicked.svg';
import ClockDefault from '../../ic_clock-Default.svg';
import ClockHover from '../../ic_clock-Hover.svg';

export const registry = {
  clicked: ClockClicked,
  default: ClockDefault,
  hover: ClockHover,
};

export type Variant = keyof typeof registry;
