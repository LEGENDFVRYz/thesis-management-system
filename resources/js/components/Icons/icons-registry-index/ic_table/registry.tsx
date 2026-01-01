import TableClicked from '../../ic_table-Clicked.svg';
import TableDefault from '../../ic_table-Default.svg';
import TableHover from '../../ic_table-Hover.svg';

export const registry = {
  clicked: TableClicked,
  default: TableDefault,
  hover: TableHover,
};

export type Variant = keyof typeof registry;
