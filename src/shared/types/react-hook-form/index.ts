import { UseControllerProps } from 'react-hook-form';

export type RulesType = UseControllerProps['rules'];

export type ContollerProps = {
  name: string;
  rules?: RulesType;
};