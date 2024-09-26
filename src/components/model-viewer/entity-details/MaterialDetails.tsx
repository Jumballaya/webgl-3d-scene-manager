import { useEntityStore } from '@/store/entityStore';
import { useEffect, useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import { LitMaterial } from '@/engine/render/material/LitMaterial';
import { vec3 } from 'gl-matrix';
import { EntityComponentVec3Field } from './component-details/EntityComponentVec3Field';
import { EntityComponentField } from './component-details/EntityComponentField';
import { EntityComponentFieldSelect } from './component-details/EntityComponentFieldSelect';
import { Material } from '@/engine/render/material/Material';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@radix-ui/react-menubar';

function extract_material_defaults(material: Material | null) {
  const mat = {
    name: material?.name || '',
    ambient: [1, 1, 1] as vec3,
    specular: [1, 1, 1] as vec3,
    diffuse: [1, 1, 1] as vec3,
    opacity: 1,
  };
  if (material instanceof LitMaterial) {
    mat.ambient = material.ambient;
    mat.specular = material.specular;
    mat.diffuse = material.diffuse;
    mat.opacity = material.opacity;
  }
  return mat;
}

function MaterialDetails() {
  const { currentlySelectedMaterial, textureList } = useEntityStore();
  const [material, updateMaterial] = useState(
    extract_material_defaults(currentlySelectedMaterial),
  );

  // Runs when currentlySelected changes
  useEffect(() => {
    // update material
  }, [currentlySelectedMaterial]);

  if (!currentlySelectedMaterial) {
    return <></>;
  }
  return (
    <div className="px-4">
      <form
        id="material-details"
        name="material-details"
        className="pt-5"
        onSubmit={(e) => {
          e.preventDefault();
          currentlySelectedMaterial.setValues(material);
        }}
      >
        <Label>Material Name</Label>
        <Input
          type="text"
          id="rotation-x"
          className="m-0 px-2 py-1 h-auto mb-4"
          value={material.name}
          onChange={(e) => {
            updateMaterial({ ...material, name: e.target.value });
          }}
        />

        <EntityComponentVec3Field
          label="Diffuse"
          vec3={[
            {
              label: 'R',
              id: 'material-diffuse-red',
              type: 'number',
              startingValue: material.diffuse[0],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  diffuse: [v, material.diffuse[1], material.diffuse[2]],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
            {
              label: 'G',
              id: 'material-diffuse-green',
              type: 'number',
              startingValue: material.diffuse[1],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  diffuse: [material.diffuse[0], v, material.diffuse[2]],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
            {
              label: 'B',
              id: 'material-diffuse-blue',
              type: 'number',
              startingValue: material.diffuse[2],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  diffuse: [material.diffuse[0], material.diffuse[1], v],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
          ]}
        />

        <EntityComponentVec3Field
          label="Ambient"
          vec3={[
            {
              label: 'R',
              id: 'material-ambient-red',
              type: 'number',
              startingValue: material.ambient[0],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  ambient: [v, material.ambient[1], material.ambient[2]],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
            {
              label: 'G',
              id: 'material-ambient-green',
              type: 'number',
              startingValue: material.ambient[1],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  ambient: [material.ambient[0], v, material.ambient[2]],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
            {
              label: 'B',
              id: 'material-ambient-blue',
              type: 'number',
              startingValue: material.ambient[2],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  ambient: [material.ambient[0], material.ambient[1], v],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
          ]}
        />

        <EntityComponentVec3Field
          label="Specular"
          vec3={[
            {
              label: 'R',
              id: 'material-specular-red',
              type: 'number',
              startingValue: material.specular[0],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  specular: [v, material.specular[1], material.specular[2]],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
            {
              label: 'G',
              id: 'material-specular-green',
              type: 'number',
              startingValue: material.specular[1],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  specular: [material.specular[0], v, material.specular[2]],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
            {
              label: 'B',
              id: 'material-specular-blue',
              type: 'number',
              startingValue: material.specular[2],
              onChange: (v: number) =>
                updateMaterial({
                  ...material,
                  specular: [material.specular[0], material.specular[1], v],
                }),
              step: 0.01,
              min: 0,
              max: 1,
            },
          ]}
        />

        <div className="mb-5"></div>
        <EntityComponentField
          label="Opacity"
          type="number"
          id="opacity"
          className="mb-5"
          startingValue={material.opacity}
          step={0.01}
          min={0}
          max={1}
          onChange={(v) =>
            updateMaterial({
              ...material,
              opacity: v,
            })
          }
        />

        <EntityComponentFieldSelect
          type="select"
          label="Albedo"
          id="texture-albedo-map"
          className="mb-2"
          value={(currentlySelectedMaterial as LitMaterial).albedo}
          onChange={(albedo) => {
            currentlySelectedMaterial.setValues({ albedo });
          }}
          list={textureList}
          placeholder="Select a texture"
        />

        <EntityComponentFieldSelect
          type="select"
          label="Normal"
          id="texture-normal-map"
          className="mb-2"
          value={(currentlySelectedMaterial as LitMaterial).normal_map}
          onChange={(normal) => {
            currentlySelectedMaterial.setValues({ normal_map: normal });
          }}
          list={textureList}
          placeholder="Select a texture"
        />

        <EntityComponentFieldSelect
          type="select"
          label="Specular"
          id="texture-specular-map"
          className="mb-4"
          value={(currentlySelectedMaterial as LitMaterial).specular_map}
          onChange={(specular_map) => {
            currentlySelectedMaterial.setValues({ specular_map });
          }}
          list={textureList}
          placeholder="Select a texture"
        />

        <Button className="px-2 py-1 h-auto">Update Material</Button>
      </form>
    </div>
  );
}

export default MaterialDetails;
