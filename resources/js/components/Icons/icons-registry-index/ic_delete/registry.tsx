import DeleteClicked from '../../ic_delete-Clicked.svg';
import DeleteDefault from '../../ic_delete-Default.svg';
import DeleteHover from '../../ic_delete-Hover.svg';

export const registry = {
  clicked: DeleteClicked,
  default: DeleteDefault,
  hover: DeleteHover,
};

export type Variant = keyof typeof registry;
