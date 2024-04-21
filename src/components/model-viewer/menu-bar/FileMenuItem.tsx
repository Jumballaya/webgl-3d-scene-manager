import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/shadcn/ui/menubar';

export function FileMenuItem() {
  return (
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          New Project <MenubarShortcut>Ctrl+N</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          New Scene <MenubarShortcut>Ctrl+Shift+N</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          Save Project <MenubarShortcut>Ctrl+S</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Properties</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}
