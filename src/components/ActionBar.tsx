import { Button } from '@/shadcn/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { LucideIcon } from 'lucide-react';

type ActionItemProps = {
  onClick: () => void;
  variant: 'ghost' | 'destructive';
  icon: LucideIcon;
  tooltip: string;
};

function ActionItem(props: ActionItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={(e) => {
            e.preventDefault();
            props.onClick();
          }}
          variant={props.variant}
          size="icon"
          className="rounded-none"
        >
          <props.icon className="h-4 w-4" />
          <span className="sr-only">{props.tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{props.tooltip}</TooltipContent>
    </Tooltip>
  );
}

export type ActionBarProps = {
  name: string;
  entries: Array<{
    onClick: () => void;
    variant: 'ghost' | 'destructive';
    icon: LucideIcon;
    tooltip: string;
  }>;
};

export function ActionBar(props: ActionBarProps) {
  return (
    <div className="flex flex-row">
      {props.entries.map((e) => (
        <ActionItem
          key={props.name + '_' + e.tooltip}
          onClick={e.onClick}
          variant={e.variant}
          icon={e.icon}
          tooltip={e.tooltip}
        />
      ))}
    </div>
  );
}
