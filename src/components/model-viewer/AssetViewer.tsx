import { Separator } from '@/shadcn/ui/separator';
import { useState } from 'react';
import useModelViewerCore from '@/core/useModelViewerCore';
import { AssetList } from './asset-viewer/AssetList';
import { AssetTypeSelector } from './asset-viewer/AssetTypeSelector';
import { FileUploader } from './asset-viewer/FileUploader';
import { AssetDetails } from './asset-viewer/AssetDetails';

const types = ['none', 'geometries', 'materials', 'textures', 'scripts'];

export function AssetViewer() {
  const mvc = useModelViewerCore();
  const [currentType, setCurrentType] = useState<string>('none');
  const [assetList, setAssetList] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

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
