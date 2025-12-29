import CheckClicked from '../../ic_check-Clicked.svg';
import CheckDefault from '../../ic_check-Default.svg';
import CheckHover from '../../ic_check-Hover.svg';

export const registry = {
  clicked: CheckClicked,
  default: CheckDefault,
  hover: CheckHover,
};

export type Variant = keyof typeof registry;
