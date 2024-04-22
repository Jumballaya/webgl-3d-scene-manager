import { useEditorStore } from '@/store/editorStore';
import { useEntityStore } from '@/store/entityStore';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { EntityListItem } from '../entity-list/EntityListItem';

export function TextFileViewer() {
  const entityStore = useEntityStore();
  const editorStore = useEditorStore();
  return (
    <div>
      <ScrollArea className="h-44">
        <ul className="mx-2 list-none">
          {entityStore.scriptList.slice(1).map((scriptName, i) => (
            <EntityListItem
              key={`text-file-${scriptName}-${i}`}
              selected={scriptName === editorStore.currentTextFile}
              tabIndex={i}
              onSelect={() => {
                editorStore.setCurrentTextFile(scriptName);
              }}
              onCollapse={() => {}}
              type="blank"
              name={scriptName}
              level={0}
              collapsible={false}
              collapsed={false}
            />
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
