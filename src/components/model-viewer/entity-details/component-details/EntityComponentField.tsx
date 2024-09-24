import { FormItem } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import type { InputProps } from './component-details.types';

export function EntityComponentField(props: InputProps) {
  if (props.type !== 'number' && props.type !== 'text') {
    return null;
  }
  return (
    <FormItem className={`flex flex-row items-baseline ${props.className}`}>
      <Label htmlFor={props.id} className="bg-primary p-1">
        {props.label}
      </Label>
      <Input
        type={props.type}
        id={props.id}
        className="px-1 h-auto py-0 rounded-none"
        style={{ marginTop: '0' }}
        value={props.startingValue}
        step={props.type === 'number' ? props.step : undefined}
        min={props.type === 'number' ? props.min : undefined}
        max={props.type === 'number' ? props.max : undefined}
        inputMode={props.type === 'number' ? 'numeric' : undefined}
        pattern={props.type === 'number' ? '[0-9]*' : undefined}
        onChange={(e) => {
          const value = e.target.value;
          if (props.type === 'text') {
            props.onChange(value);
            return;
          }
          if (typeof value === 'number') {
            props.onChange(value);
            return;
          }
          const parsed = parseFloat(value);
          if (!isNaN(parsed)) {
            props.onChange(parsed);
            return;
          }
        }}
      />
    </FormItem>
  );
}
