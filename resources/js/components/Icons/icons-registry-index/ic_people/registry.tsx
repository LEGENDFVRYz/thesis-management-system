import PeopleBold from '../../ic_people-bold.svg';
import PeopleLinear from '../../ic_people-linear.svg';
import PeopleTwotone from '../../ic_people-twotone.svg';

export const registry = {
  bold: PeopleBold,
  linear: PeopleLinear,
  twotone: PeopleTwotone,
};

export type Variant = keyof typeof registry;
