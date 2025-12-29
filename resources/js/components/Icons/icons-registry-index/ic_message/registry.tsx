import MessageClicked from '../../ic_message-Clicked.svg';
import MessageDefault from '../../ic_message-Default.svg';
import MessageHover from '../../ic_message-Hover.svg';

export const registry = {
  clicked: MessageClicked,
  default: MessageDefault,
  hover: MessageHover,
};

export type Variant = keyof typeof registry;
