import EditClicked from '../../ic_edit-Clicked.svg';
import EditDefault from '../../ic_edit-Default.svg';
import EditHover from '../../ic_edit-Hover.svg';

export const registry = {
  clicked: EditClicked,
  default: EditDefault,
  hover: EditHover,
};

export type Variant = keyof typeof registry;
