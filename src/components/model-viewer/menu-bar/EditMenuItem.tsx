import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/shadcn/ui/menubar';

export function EditMenuItem() {
  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          Undo <MenubarShortcut>Ctrl+Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          Redo <MenubarShortcut>Ctrl+Shift+Z</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarSub>
          <MenubarSubTrigger>Create New</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>Blank Entity</MenubarItem>
            <MenubarItem>Mesh Entity</MenubarItem>
            <MenubarItem>Light Entity</MenubarItem>
            <MenubarItem>Lua Script</MenubarItem>
            <MenubarItem>Post Effect</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  );
}
