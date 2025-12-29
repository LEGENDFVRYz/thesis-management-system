import FeedbackClicked from '../../ic_feedback-Clicked.svg';
import FeedbackDefault from '../../ic_feedback-Default.svg';
import FeedbackHover from '../../ic_feedback-Hover.svg';

export const registry = {
  clicked: FeedbackClicked,
  default: FeedbackDefault,
  hover: FeedbackHover,
};

export type Variant = keyof typeof registry;
