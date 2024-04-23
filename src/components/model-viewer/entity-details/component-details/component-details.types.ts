export type TextDetailProps = {
  label: string;
  id: string;
  type: 'text';
  startingValue: string;
  onChange: (v: string) => void;
  className?: string;
};

export type NumberDetailProps = {
  label: string;
  id: string;
  type: 'number';
  startingValue: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
};

export type SelectDetailProps = {
  label: string;
  id: string;
  type: 'select';
  value: string;
  onChange: (v: string) => void;
  list: string[];
  className?: string;
  placeholder?: string;
};

export type InputProps =
  | TextDetailProps
  | NumberDetailProps
  | SelectDetailProps;
