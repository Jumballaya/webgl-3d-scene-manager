import useModelViewerCore from '@/core/useModelViewerCore';
import { AssetManager } from '@/renderer/assets/AssetManager';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';
import { useEffect, useState } from 'react';

export function AssetTypeSelector(props: {
  currentType: string;
  types: string[];
  setCurrentType: (type: string) => void;
  setAssetList: (list: string[]) => void;
}) {
  const { setCurrentType, setAssetList, currentType, types } = props;
  const mvc = useModelViewerCore();
  const [assetManager, setAssetManager] = useState<AssetManager | undefined>(
    mvc.assetManager,
  );
  useEffect(() => {
    if (mvc.assetManager) {
      setAssetManager(mvc.assetManager);
    }
  }, [mvc.assetManager]);
  if (!assetManager) {
    return <></>;
  }

  return (
    <div className="flex flex-row p-3">
      <h3 className="self-center mr-2 font-bold">Type</h3>
      <Select
        onValueChange={(type) => {
          if (assetManager) {
            setCurrentType(type);
            switch (type) {
              case 'meshes': {
                setAssetList(assetManager.meshList);
                break;
              }
              case 'geometries': {
                setAssetList(assetManager.geometryList);
                break;
              }
              case 'materials': {
                setAssetList(assetManager.materialList);
                break;
              }
              case 'textures': {
                setAssetList(assetManager.textureList);
                break;
              }
              default: {
                setAssetList([]);
                break;
              }
            }
          }
        }}
        value={currentType}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a mesh" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {types.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
