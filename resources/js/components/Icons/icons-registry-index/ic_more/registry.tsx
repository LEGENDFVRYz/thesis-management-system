import MoreClicked from '../../ic_more-Clicked.svg';
import MoreDefault from '../../ic_more-Default.svg';
import MoreHover from '../../ic_more-Hover.svg';

export const registry = {
  clicked: MoreClicked,
  default: MoreDefault,
  hover: MoreHover,
};

export type Variant = keyof typeof registry;
