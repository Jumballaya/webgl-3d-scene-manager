import { cn } from '@/shadcn/lib/utils';
import { Box, ChevronDown, ChevronUp, Lightbulb, Grid3X3 } from 'lucide-react';

type EntityListItemProps = {
  selected: boolean;
  tabIndex: number;
  onSelect: () => void;
  onCollapse: () => void;
  type: 'blank' | 'mesh' | 'light';
  name: string;
  level: number;
  collapsible: boolean;
  collapsed: boolean;
};

export function EntityIcon(props: { type: EntityListItemProps['type'] }) {
  const className = 'h-3 w-3 self-center ml-2';
  const { type } = props;
  if (type === 'mesh') return <Grid3X3 className={className} />;
  if (type === 'light') return <Lightbulb className={className} />;
  if (type === 'blank') return <Box className={className} />;
}

export function EntityListItem(props: EntityListItemProps) {
  return (
    <div
      role="button"
      tabIndex={props.tabIndex}
      onClick={props.onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter') props.onSelect();
      }}
      className={cn(
        'hover:cursor-pointer hover:bg-accent border-b',
        props.selected && 'bg-accent',
      )}
    >
      <div
        className={cn(
          'text-sm px-1 py-2 flex flex-row',
          props.level > 0 && 'border-l',
        )}
        style={{
          marginLeft: props.level * 24,
        }}
      >
        {props.collapsible &&
          (props.collapsed ? (
            <ChevronDown
              onClick={props.onCollapse}
              className="w-4 h-4 self-center mr-2 border"
            />
          ) : (
            <ChevronUp
              onClick={props.onCollapse}
              className="w-4 h-4 self-center mr-2 border"
            />
          ))}
        <EntityIcon type={props.type} />
        <span className={`ml-2`}>{props.name}</span>
      </div>
    </div>
  );
}
