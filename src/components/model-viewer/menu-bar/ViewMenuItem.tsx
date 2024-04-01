import { useTheme } from '@/core/theme';
import useModelViewerCore from '@/core/useModelViewerCore';
import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/shadcn/ui/menubar';
import { useEffect, useState } from 'react';

export function ViewMenuItem() {
  const { theme, setTheme } = useTheme();
  const mvc = useModelViewerCore();
  const [showGrid, setShowGrid] = useState(true);
  useEffect(() => {}, [showGrid]);

  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger inset>Theme</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarCheckboxItem
              onClick={() => {
                setTheme('light');
              }}
              checked={theme === 'light'}
            >
              Light
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              onClick={() => {
                setTheme('dark');
              }}
              checked={theme === 'dark'}
            >
              Dark
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              onClick={() => {
                setTheme('system');
              }}
              checked={theme === 'system'}
            >
              System
            </MenubarCheckboxItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarCheckboxItem
          onClick={() => {
            mvc.showGrid = !mvc.showGrid;
            setShowGrid(mvc.showGrid);
          }}
          checked={showGrid}
        >
          Show Grid
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  );
}
