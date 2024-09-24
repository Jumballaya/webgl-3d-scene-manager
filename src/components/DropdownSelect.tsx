import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';

type DropdownSelectProps = {
  name: string;
  onValueChange: (value: string) => void;
  value: string;
  options: string[];
  placeholder: string;
};

export function DropdownSelect(props: DropdownSelectProps) {
  return (
    <Select onValueChange={props.onValueChange} value={props.value}>
      <SelectTrigger className="w-full py-1 pt-0 h-auto px-2 items-end">
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {props.options.map((opt) => (
            <SelectItem
              key={`${props.name}_dropdown_select_${opt}`}
              value={opt}
              className="flex flex-row h-auto py-1 flex-end"
            >
              {opt.length > 30 ? `${opt.slice(0, 27)}...` : opt}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
