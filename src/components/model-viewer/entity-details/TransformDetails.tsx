import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { useEntityStore } from '@/store/entityStore';
import { useEffect, useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import useModelViewerCore from '@/core/useModelViewerCore';
import { Transform } from '@/engine/math/Transform';
import { EntityComponentVec3Field } from './component-details/EntityComponentVec3Field';

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
          <EntityComponentVec3Field
            label="Translation"
            vec3={[
              {
                label: 'X',
                type: 'number',
                id: 'translation-x',
                startingValue: transform.translation.x,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    translation: { ...transform.translation, x: v },
                  }),
              },
              {
                label: 'Y',
                type: 'number',
                id: 'translation-y',
                startingValue: transform.translation.y,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    translation: { ...transform.translation, y: v },
                  }),
              },
              {
                label: 'Z',
                type: 'number',
                id: 'translation-z',
                startingValue: transform.translation.z,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    translation: { ...transform.translation, z: v },
                  }),
              },
            ]}
          />

          <EntityComponentVec3Field
            label="Rotation"
            vec3={[
              {
                label: 'X',
                type: 'number',
                id: 'rotation-x',
                startingValue: transform.rotation.x,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    rotation: { ...transform.rotation, x: v },
                  }),
              },
              {
                label: 'Y',
                type: 'number',
                id: 'rotation-y',
                startingValue: transform.rotation.y,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    rotation: { ...transform.rotation, y: v },
                  }),
              },
              {
                label: 'Z',
                type: 'number',
                id: 'rotation-z',
                startingValue: transform.rotation.z,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    rotation: { ...transform.rotation, z: v },
                  }),
              },
            ]}
          />

          <EntityComponentVec3Field
            label="Scale"
            vec3={[
              {
                label: 'X',
                type: 'number',
                id: 'scale-x',
                startingValue: transform.scale.x,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    scale: { ...transform.scale, x: v },
                  }),
              },
              {
                label: 'Y',
                type: 'number',
                id: 'scale-y',
                startingValue: transform.scale.y,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    scale: { ...transform.scale, y: v },
                  }),
              },
              {
                label: 'Z',
                type: 'number',
                id: 'scale-z',
                startingValue: transform.scale.z,
                step: 0.1,
                onChange: (v) =>
                  updateTransform({
                    ...transform,
                    scale: { ...transform.scale, z: v },
                  }),
              },
            ]}
          />

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
