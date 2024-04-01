import { Menubar } from '@/shadcn/ui/menubar';
import { ViewMenuItem } from './model-viewer/menu-bar/ViewMenuItem';
import { FileMenuItem } from './model-viewer/menu-bar/FileMenuItem';
import { EditMenuItem } from './model-viewer/menu-bar/EditMenuItem';

const MenuBar = () => {
  return (
    <Menubar>
      <FileMenuItem />
      <EditMenuItem />
      <ViewMenuItem />
    </Menubar>
  );
};

export default MenuBar;
