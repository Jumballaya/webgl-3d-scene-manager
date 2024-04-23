import { FormItem } from '@/shadcn/ui/form';
import { Label } from '@/shadcn/ui/label';
import type { SelectDetailProps } from './component-details.types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';

export function EntityComponentFieldSelect(props: SelectDetailProps) {
  return (
    <FormItem
      className={`flex flex-row items-baseline mr-2 ${props.className}`}
    >
      <Label htmlFor={props.id} className="mr-2">
        {props.label}
      </Label>
      <Select
        onValueChange={(albedo) => {
          props.onChange(albedo);
        }}
        value={props.value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={props.placeholder ?? 'select a value'} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {props.list.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormItem>
  );
}
