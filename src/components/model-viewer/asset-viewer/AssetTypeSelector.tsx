import useModelViewerCore from '@/core/useModelViewerCore';
import { AssetManager } from '@/engine/assets/AssetManager';
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
    <div className="flex flex-row p-2">
      <h4 className="self-center mr-1 w-1/2">Asset Type</h4>
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
              case 'scripts': {
                setAssetList(assetManager.scriptList);
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
        <SelectTrigger className="w-1/2 py-1 pt-0 h-auto px-2 items-end">
          <SelectValue />
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
