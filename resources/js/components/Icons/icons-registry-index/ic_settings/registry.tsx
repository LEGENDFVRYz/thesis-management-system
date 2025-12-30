import SettingsClicked from '../../ic_settings-Clicked.svg';
import SettingsDefault from '../../ic_settings-Default.svg';
import SettingsHover from '../../ic_settings-Hover.svg';

export const registry = {
  clicked: SettingsClicked,
  default: SettingsDefault,
  hover: SettingsHover,
};

export type Variant = keyof typeof registry;
