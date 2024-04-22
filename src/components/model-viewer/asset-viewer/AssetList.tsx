import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { EntityListItem } from '../entity-list/EntityListItem';

export function AssetList(props: {
  assetList: string[];
  currentType: string;
  selected: string | null;
  onSelect: (item: string | null) => void;
}) {
  const { assetList, currentType, selected, onSelect } = props;

  return (
    <ScrollArea className="min-h-44 h-full">
      <ul className="mx-2 list-none">
        {assetList.map((e, i) => (
          <EntityListItem
            key={`asset-${currentType}-${e}`}
            selected={e === selected}
            tabIndex={i}
            onSelect={() => onSelect(e)}
            onCollapse={() => {}}
            type="blank"
            name={e}
            level={0}
            collapsible={false}
            collapsed={false}
          />
        ))}
      </ul>
    </ScrollArea>
  );
}
