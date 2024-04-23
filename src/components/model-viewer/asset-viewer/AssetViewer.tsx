import { Separator } from '@/shadcn/ui/separator';
import { useEffect, useState } from 'react';
import useModelViewerCore from '@/core/useModelViewerCore';
import { AssetList } from './AssetList';
import { AssetTypeSelector } from './AssetTypeSelector';
import { FileUploader } from './FileUploader';
import { AssetDetails } from './AssetDetails';
import { useEntityStore } from '@/store/entityStore';

const types = [
  'none',
  'geometries',
  'materials',
  'textures',
  'scripts',
  'prefabs',
];

export function AssetViewer() {
  const mvc = useModelViewerCore();
  const { geometryList, materialList, textureList, scriptList, prefabList } =
    useEntityStore();
  const [currentType, setCurrentType] = useState<string>('none');
  const [assetList, setAssetList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    switch (currentType) {
      case 'geometries': {
        setAssetList(geometryList.filter((e) => e !== 'none'));
        break;
      }
      case 'materials': {
        setAssetList(materialList.filter((e) => e !== 'none'));
        break;
      }
      case 'textures': {
        setAssetList(textureList.filter((e) => e !== 'none'));
        break;
      }
      case 'scripts': {
        setAssetList(scriptList.filter((e) => e !== 'none'));
        break;
      }
      case 'prefabs': {
        setAssetList(prefabList.filter((e) => e !== 'none'));
        break;
      }
      default: {
        setAssetList([]);
        break;
      }
    }
  }, [
    currentType,
    geometryList,
    materialList,
    textureList,
    scriptList,
    prefabList,
  ]);

  return (
    <section>
      <h2 className="py-4 px-4 font-bold">Asset Manager</h2>
      <Separator />
      <AssetTypeSelector
        currentType={currentType}
        types={types}
        setCurrentType={setCurrentType}
        setAssetList={setAssetList}
      />
      <Separator />
      <AssetList
        assetList={assetList}
        currentType={currentType}
        selected={selected}
        onSelect={(item) => setSelected(item)}
      />
      <Separator />
      <section className="p-2 px-3">
        <FileUploader
          onUpload={() => {
            if (mvc.assetManager) {
              switch (currentType) {
                case 'geometries': {
                  setAssetList(mvc.assetManager.geometryList);
                  break;
                }
                case 'materials': {
                  setAssetList(mvc.assetManager.materialList);
                  break;
                }
                case 'textures': {
                  setAssetList(mvc.assetManager.textureList);
                  break;
                }
                case 'scripts': {
                  setAssetList(mvc.assetManager.scriptList);
                  break;
                }
                default: {
                  setAssetList([]);
                  break;
                }
              }
            }
          }}
        />
      </section>
      <Separator />
      <AssetDetails selected={selected || ''} currentType={currentType} />
    </section>
  );
}
