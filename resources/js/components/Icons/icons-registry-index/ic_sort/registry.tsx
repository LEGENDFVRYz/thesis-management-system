import SortClicked from '../../ic_sort-Clicked.svg';
import SortDefault from '../../ic_sort-Default.svg';
import SortHover from '../../ic_sort-Hover.svg';

export const registry = {
  clicked: SortClicked,
  default: SortDefault,
  hover: SortHover,
};

export type Variant = keyof typeof registry;
