import DashboardClicked from '../../ic_dashboard-Clicked.svg';
import DashboardDefault from '../../ic_dashboard-Default.svg';
import DashboardHover from '../../ic_dashboard-Hover.svg';

export const registry = {
  clicked: DashboardClicked,
  default: DashboardDefault,
  hover: DashboardHover,
};

export type Variant = keyof typeof registry;
