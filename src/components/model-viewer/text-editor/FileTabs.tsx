import { useTheme } from '@/core/theme';
import { ScrollArea, ScrollBar } from '@/shadcn/ui/scroll-area';
import { Separator } from '@/shadcn/ui/separator';
import { useEditorStore } from '@/store/editorStore';
import { CodeIcon, XIcon } from 'lucide-react';

const fileTabClassLight = 'border-primary';
const fileTabClassDark = 'border-white bg-accent';

function FileTab(props: {
  tabName: string;
  selected: boolean;
  onSelect: (tab: string) => void;
  onClose: (tab: string) => void;
}) {
  const { theme } = useTheme();
  const themeClasses = theme === 'light' ? fileTabClassLight : fileTabClassDark;
  const background = props.selected
    ? 'border-b-2 bg-transparent'
    : 'hover:bg-accent hover:border-b-2';
  return (
    <li
      role="button"
      className={`pt-2 pb-1 px-4 cursor-pointer ${background} ${themeClasses}`}
      onClick={(e) => {
        // CLICK ON THE CLOSE ICON
        if (e.target instanceof SVGElement) return;
        e.preventDefault();
        props.onSelect(props.tabName);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          props.onSelect(props.tabName);
        }
      }}
    >
      <div className="flex flex-row items-center justify-center">
        <CodeIcon size={13} />
        <span className="mx-2">{props.tabName}</span>
        <XIcon
          size={15}
          className={`${props.selected ? 'hover:bg-accent' : 'hover:bg-popover'} rounded`}
          onClick={(e) => {
            e.preventDefault();
            props.onClose(props.tabName);
          }}
        />
      </div>
    </li>
  );
}

export function FileTabs() {
  const editorStore = useEditorStore();
  return (
    <ScrollArea className="w-full whitespace-nowrap">
        <nav className="w-full mb-4">
          <ul className="flex flex-row flex-nowrap w-full h-11">
            {editorStore.openFileTabs.map((tab) => (
              <FileTab
                key={`${tab}--text-editor-tab`}
                tabName={tab}
                selected={tab === editorStore.currentTextFile}
                onSelect={(t) => {
                  editorStore.setCurrentTextFile(t);
                }}
                onClose={(t) => {
                  editorStore.closeFileTab(t);
                }}
              />
            ))}
          </ul>
          <ScrollBar orientation='horizontal' />
          <Separator />
        </nav>
    </ScrollArea>
  );
}
