import useModelViewerCore from '@/core/useModelViewerCore';
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
  const mvc = useModelViewerCore();
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
            <MenubarItem
              onClick={() => {
                const ent = mvc.addEntity();
                mvc.setCurrentlySelected(ent);
              }}
            >
              Blank Entity
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                const ent = mvc.addEntity('mesh');
                mvc.setCurrentlySelected(ent);
              }}
            >
              Mesh Entity
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                const ent = mvc.addEntity('light');
                mvc.setCurrentlySelected(ent);
              }}
            >
              Light Entity
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                mvc.addScript(`lua-script-${crypto.randomUUID()}`, '');
              }}
            >
              Lua Script
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                mvc.addPostEffects(`post-effect-${crypto.randomUUID()}`);
              }}
            >
              Post Effect
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  );
}
