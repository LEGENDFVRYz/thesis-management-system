import MenuClicked from '../../ic_menu-Clicked.svg';
import MenuDefault from '../../ic_menu-Default.svg';
import MenuHover from '../../ic_menu-Hover.svg';

export const registry = {
  clicked: MenuClicked,
  default: MenuDefault,
  hover: MenuHover,
};

export type Variant = keyof typeof registry;
