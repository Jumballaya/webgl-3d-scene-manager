import { FormItem } from '@/shadcn/ui/form';
import { Label } from '@/shadcn/ui/label';
import type { SelectDetailProps } from './component-details.types';
import { DropdownSelect } from '@/components/DropdownSelect';
import { useEffect, useState } from 'react';

export function EntityComponentFieldSelect(props: SelectDetailProps) {
  const { list } = props;
  const [fullList, setFullList] = useState<
    { value: string; display: string }[]
  >([]);
  useEffect(() => {
    setFullList((list ?? []).map((v) => ({ value: v, display: v })));
  }, [list]);
  return (
    <FormItem
      className={`flex flex-row items-baseline mr-2 ${props.className}`}
    >
      <Label htmlFor={props.id} className="mr-2">
        {props.label}
      </Label>

      <DropdownSelect
        name={'component_field_' + props.id}
        value={props.value}
        onValueChange={props.onChange}
        options={fullList}
        placeholder={props.placeholder || ''}
      />
    </FormItem>
  );
}
