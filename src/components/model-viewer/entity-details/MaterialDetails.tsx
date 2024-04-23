import { useEntityStore } from '@/store/entityStore';
import { useEffect, useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import { Mesh } from '@/engine/render/mesh/Mesh';
import { LitMaterial } from '@/engine/render/material/LitMaterial';
import { vec3 } from 'gl-matrix';
import useModelViewerCore from '@/core/useModelViewerCore';
import { EntityComponentVec3Field } from './component-details/EntityComponentVec3Field';
import { EntityComponentField } from './component-details/EntityComponentField';
import { EntityComponentFieldSelect } from './component-details/EntityComponentFieldSelect';

function extract_material_defaults(mesh: Mesh | undefined) {
  const mat = {
    ambient: [1, 1, 1] as vec3,
    specular: [1, 1, 1] as vec3,
    diffuse: [1, 1, 1] as vec3,
    opacity: 1,
  };
  const material = mesh?.material;
  if (material instanceof LitMaterial) {
    mat.ambient = material.ambient;
    mat.specular = material.specular;
    mat.diffuse = material.diffuse;
    mat.opacity = material.opacity;
  }
  return mat;
}

function MaterialDetails() {
  const { currentlySelected, textureList } = useEntityStore();
  const mvc = useModelViewerCore();
  const meshComp = currentlySelected?.components.filter(
    (c) => c[0] === 'Mesh',
  )[0] as [string, Mesh] | undefined;
  const meshMaterial = meshComp?.[1]?.material;
  const [material, updateMaterial] = useState(
    extract_material_defaults(meshComp?.[1]),
  );

  // Runs when currentlySelected changes
  useEffect(() => {
    // update material
  }, [currentlySelected]);

  if (!meshComp || !meshMaterial || !(meshMaterial instanceof LitMaterial)) {
    return <></>;
  }
  return (
    <div>
      <form
        id="material-details"
        name="material-details"
        className="pt-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (currentlySelected) {
            // update material
            meshMaterial.setValues(material);
            mvc.updateComponentOnCurrentlySelected('Mesh', meshComp[1]);
          }
        }}
      >
        <EntityComponentVec3Field
          label="Diffuse"
          vec3={[
            {
              label: 'Red',
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
              label: 'Green',
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
              label: 'Blue',
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
              label: 'Red',
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
              label: 'Green',
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
              label: 'Blue',
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
              label: 'Red',
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
              label: 'Green',
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
              label: 'Blue',
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
          className="mb-5"
          value={meshMaterial.albedo}
          onChange={(albedo) => {
            meshMaterial.setValues({ albedo });
            mvc.updateComponentOnCurrentlySelected('Mesh', meshComp[1]);
          }}
          list={textureList}
          placeholder="Select a texture"
        />

        <EntityComponentFieldSelect
          type="select"
          label="Normal"
          id="texture-normal-map"
          className="mb-5"
          value={meshMaterial.normal_map}
          onChange={(normal) => {
            meshMaterial.setValues({ normal_map: normal });
            mvc.updateComponentOnCurrentlySelected('Mesh', meshComp[1]);
          }}
          list={textureList}
          placeholder="Select a texture"
        />

        <EntityComponentFieldSelect
          type="select"
          label="Specular"
          id="texture-specular-map"
          className="mb-5"
          value={meshMaterial.specular_map}
          onChange={(specular_map) => {
            meshMaterial.setValues({ specular_map });
            mvc.updateComponentOnCurrentlySelected('Mesh', meshComp[1]);
          }}
          list={textureList}
          placeholder="Select a texture"
        />

        <Button>Update Material</Button>
      </form>
    </div>
  );
}

export default MaterialDetails;
