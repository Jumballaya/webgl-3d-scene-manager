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
              Blank Entity <MenubarShortcut>Alt+E</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                const ent = mvc.addEntity('mesh');
                mvc.setCurrentlySelected(ent);
              }}
            >
              Mesh Entity{' '}
              <MenubarShortcut className="ml-3">Alt+M</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                const ent = mvc.addEntity('light');
                mvc.setCurrentlySelected(ent);
              }}
            >
              Light Entity <MenubarShortcut>Alt+L</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                mvc.addScript(`lua-script-${crypto.randomUUID()}`, '');
              }}
            >
              Lua Script <MenubarShortcut>Alt+S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                mvc.addPostEffects(`post-effect-${crypto.randomUUID()}`);
              }}
            >
              Post Effect <MenubarShortcut>Alt+P</MenubarShortcut>
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  );
}
