import CheckCircleClicked from '../../ic_checkCircle-Clicked.svg';
import CheckCircleDefault from '../../ic_checkCircle-Default.svg';
import CheckCircleHover from '../../ic_checkCircle-Hover.svg';

export const registry = {
  clicked: CheckCircleClicked,
  default: CheckCircleDefault,
  hover: CheckCircleHover,
};

export type Variant = keyof typeof registry;
