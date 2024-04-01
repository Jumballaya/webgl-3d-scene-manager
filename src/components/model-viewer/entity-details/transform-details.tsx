import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { FormItem } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useEntityStore } from '@/store/entityStore';
import { useEffect, useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import useModelViewerCore from '@/core/useModelViewerCore';
import { Transform } from '@/renderer/math/Transform';

function AddTransform() {
  const mvc = useModelViewerCore();
  return (
    <Card className="p-1 my-4">
      <CardHeader className="p-3 pb-0"></CardHeader>
      <CardContent className="p-3">
        <Button
          onClick={(e) => {
            e.preventDefault();
            mvc.addComponentToCurrentlySelected('Transform', new Transform());
          }}
          id="create-child"
        >
          Add Transform Component
        </Button>
      </CardContent>
    </Card>
  );
}

function extract_transform_defaults(transform: Transform | undefined) {
  return {
    translation: {
      x: transform?.translation?.[0] ?? 0,
      y: transform?.translation?.[1] ?? 0,
      z: transform?.translation?.[2] ?? 0,
    },
    rotation: {
      x: transform?.rotation?.[0] ?? 0,
      y: transform?.rotation?.[1] ?? 0,
      z: transform?.rotation?.[2] ?? 0,
    },
    scale: {
      x: transform?.scale?.[0] ?? 1,
      y: transform?.scale?.[1] ?? 1,
      z: transform?.scale?.[2] ?? 1,
    },
  };
}

function TransformDetails() {
  const { currentlySelected } = useEntityStore();
  const mvc = useModelViewerCore();
  const transComp = currentlySelected?.components.filter(
    (c) => c[0] === 'Transform',
  )[0] as [string, Transform] | undefined;
  const trans = transComp?.[1];
  const [transform, updateTransform] = useState(
    extract_transform_defaults(trans),
  );

  // runs when currentlySelected changes
  useEffect(() => {
    if (currentlySelected) {
      // update transform
      const transComp = currentlySelected?.components.filter(
        (c) => c[0] === 'Transform',
      )[0] as [string, Transform] | undefined;
      const trans = transComp?.[1];
      updateTransform(extract_transform_defaults(trans));
    }
  }, [currentlySelected]);

  if (!currentlySelected) {
    return <></>;
  }
  if (!transComp || !trans) {
    return <AddTransform />;
  }
  return (
    <Card className="my-4">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xl">Transform</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <form
          name="transform-details"
          id="transform-details"
          onSubmit={(e) => {
            e.preventDefault();
            if (currentlySelected) {
              // update transform
              trans.translation = [
                transform.translation.x,
                transform.translation.y,
                transform.translation.z,
              ];
              trans.rotation = [
                transform.rotation.x,
                transform.rotation.y,
                transform.rotation.z,
              ];
              trans.scale = [
                transform.scale.x,
                transform.scale.y,
                transform.scale.z,
              ];
              mvc.updateComponentOnCurrentlySelected('Transform', trans);
            }
          }}
        >
          <Card className="p-1 mb-2">
            <CardHeader className="p-1">
              <CardTitle className="text-md">Translation</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <section className="flex flex-row justify-around">
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="translation-x" className="mr-2">
                    X
                  </Label>
                  <Input
                    type="number"
                    id="translation-x"
                    className="h-8 w-14"
                    value={transform.translation.x}
                    step={0.1}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        translation: {
                          ...transform.translation,
                          x: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="translation-y" className="mr-2">
                    Y
                  </Label>
                  <Input
                    type="number"
                    id="translation-y"
                    className="h-8 w-14"
                    value={transform.translation.y}
                    step={0.1}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        translation: {
                          ...transform.translation,
                          y: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="translation-z" className="mr-2">
                    Z
                  </Label>
                  <Input
                    type="number"
                    id="translation-z"
                    className="h-8 w-14"
                    value={transform.translation.z}
                    step={0.1}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        translation: {
                          ...transform.translation,
                          z: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
              </section>
            </CardContent>
          </Card>

          <Card className="p-1 mb-2">
            <CardHeader className="p-1">
              <CardTitle className="text-md">Rotation</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <section className="flex flex-row justify-around">
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="rotation-x" className="mr-2">
                    X
                  </Label>
                  <Input
                    type="number"
                    id="rotation-x"
                    className="h-8 w-14"
                    value={transform.rotation.x}
                    step={0.1}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        rotation: {
                          ...transform.rotation,
                          x: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="rotation-y" className="mr-2">
                    Y
                  </Label>
                  <Input
                    type="number"
                    id="rotation-y"
                    className="h-8 w-14"
                    value={transform.rotation.y}
                    step={0.1}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        rotation: {
                          ...transform.rotation,
                          y: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="rotation-z" className="mr-2">
                    Z
                  </Label>
                  <Input
                    type="number"
                    id="rotation-z"
                    className="h-8 w-14"
                    value={transform.rotation.z}
                    step={0.1}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        rotation: {
                          ...transform.rotation,
                          z: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
              </section>
            </CardContent>
          </Card>

          <Card className="p-1 mb-2">
            <CardHeader className="p-1">
              <CardTitle className="text-md">Scale</CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <section className="flex flex-row justify-around">
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="scale-x" className="mr-2">
                    X
                  </Label>
                  <Input
                    type="number"
                    id="scale-x"
                    className="h-8 w-14"
                    value={transform.scale.x}
                    step={0.1}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        scale: {
                          ...transform.scale,
                          x: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="scale-y" className="mr-2">
                    Y
                  </Label>
                  <Input
                    type="number"
                    id="scale-y"
                    className="h-8 w-14"
                    step={0.1}
                    value={transform.scale.y}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        scale: {
                          ...transform.scale,
                          y: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
                <FormItem className="flex flex-row items-baseline">
                  <Label htmlFor="scale-z" className="mr-2">
                    Z
                  </Label>
                  <Input
                    type="number"
                    id="scale-z"
                    className="h-8 w-14"
                    step={0.1}
                    value={transform.scale.z}
                    onChange={(e) => {
                      updateTransform({
                        ...transform,
                        scale: {
                          ...transform.scale,
                          z: parseFloat(e.target.value),
                        },
                      });
                    }}
                  />
                </FormItem>
              </section>
            </CardContent>
          </Card>

          <div className="flex flex-row">
            <Button id="submit-update-transform">Update Transform</Button>
            <Button
              className="ml-3"
              onClick={(e) => {
                e.preventDefault();
                mvc.removeComponentFromCurrentlySelected('Transform');
              }}
              variant={'destructive'}
            >
              Remove
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default TransformDetails;
