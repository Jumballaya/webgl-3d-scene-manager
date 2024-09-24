import { Separator } from '@/shadcn/ui/separator';
import { useEffect, useState } from 'react';
import { AssetList } from './AssetList';
import { AssetTypeSelector } from './AssetTypeSelector';
import { AssetDetails } from './AssetDetails';
import { useEntityStore } from '@/store/entityStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/ui/tooltip';
import { Button } from '@/shadcn/ui/button';
import { File, FilePlus2Icon, Trash2 } from 'lucide-react';

const types = [
  'none',
  'geometries',
  'materials',
  'textures',
  'scripts',
  'prefabs',
];

const singularForm: Record<string, string> = {
  geometries: 'geometry',
  materials: 'material',
  textures: 'texture',
  scripts: 'script',
  prefabs: 'prefab',
};

function formatAssetTypeName(name: string): string {
  const singular = singularForm[name] || ' ';
  return `${singular[0].toUpperCase()}${singular.slice(1)}`;
}

/* <FileUploader
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
/> */

function AssetCommands(props: { currentType: string }) {
  return (
    <>
      <section className="flex-row">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
              }}
              variant="ghost"
              size="icon"
            >
              <FilePlus2Icon className="h-4 w-4" />
              <span className="sr-only">Create {props.currentType}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Create {formatAssetTypeName(props.currentType)}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
              }}
              variant="ghost"
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">
                Delete Selected {formatAssetTypeName(props.currentType)}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Delete Selected {formatAssetTypeName(props.currentType)}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
              }}
              variant="ghost"
              size="icon"
            >
              <File className="h-4 w-4" />
              <span className="sr-only">
                Upload {formatAssetTypeName(props.currentType)}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Upload {formatAssetTypeName(props.currentType)}
          </TooltipContent>
        </Tooltip>
      </section>
      <Separator />
    </>
  );
}

export function AssetViewer() {
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
      {currentType !== 'none' ? (
        <AssetCommands currentType={currentType} />
      ) : (
        <></>
      )}
      <AssetDetails selected={selected || ''} currentType={currentType} />
    </section>
  );
}
