export type TextDetailProps = {
  label: string;
  id: string;
  type: 'text';
  startingValue: string;
  onChange: (v: string) => void;
};

export type NumbertDetailProps = {
  label: string;
  id: string;
  type: 'number';
  startingValue: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
};

export type InputProps = TextDetailProps | NumbertDetailProps;
