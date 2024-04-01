import useModelViewerCore from '@/core/useModelViewerCore';
import { Texture } from '@/renderer/gl/Texture';
import { ScrollArea } from '@/shadcn/ui/scroll-area';

function DetailHeader(props: { name: string }) {
  return <h3 className="py-4 px-4 font-bold">{props.name}</h3>;
}

function AssetDetail(props: { selected: string; currentType: string }) {
  const { currentType, selected } = props;
  const mvc = useModelViewerCore();
  const assetManager = mvc.assetManager;
  if (!assetManager) {
    return <></>;
  }

  switch (currentType) {
    case 'textures': {
      const texture = assetManager.getTexture(selected);
      if (!texture) {
        break;
      }
      return <TextureDetail texture={texture} />;
    }
  }
  return <></>;
}

function TextureDetail(props: { texture: Texture }) {
  const { texture } = props;
  const img = texture.getImage();
  const src = img?.src ?? '';
  return (
    <section className="flex flex-column items-center justify-center">
      <img className="w-32" src={src} alt={texture.id.toString()} />
      <section></section>
    </section>
  );
}

export function AssetDetails(props: { selected: string; currentType: string }) {
  const { selected, currentType } = props;
  if (currentType === 'none') {
    return <></>;
  }
  return (
    <section>
      <DetailHeader name={selected} />
      <ScrollArea className="p-3 h-60">
        <AssetDetail selected={selected} currentType={currentType} />
      </ScrollArea>
    </section>
  );
}
