import ProfileClicked from '../../ic_profile-Clicked.svg';
import ProfileDefault from '../../ic_profile-Default.svg';
import ProfileHover from '../../ic_profile-Hover.svg';

export const registry = {
  clicked: ProfileClicked,
  default: ProfileDefault,
  hover: ProfileHover,
};

export type Variant = keyof typeof registry;
