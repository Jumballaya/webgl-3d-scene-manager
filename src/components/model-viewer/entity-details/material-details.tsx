import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { FormItem } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { useEntityStore } from '@/store/entityStore';
import { useEffect, useState } from 'react';
import { Button } from '@/shadcn/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select';
import { Mesh } from '@/engine/render/mesh/Mesh';
import { LitMaterial } from '@/engine/render/material/LitMaterial';
import { vec3 } from 'gl-matrix';
import useModelViewerCore from '@/core/useModelViewerCore';

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
      <h3 className="text-xl mt-4 p-3 pb-1">Material</h3>
      <form
        id="material-details"
        name="material-details"
        onSubmit={(e) => {
          e.preventDefault();
          if (currentlySelected) {
            // update material
            meshMaterial.setValues(material);
            mvc.updateComponentOnCurrentlySelected('Mesh', meshComp[1]);
          }
        }}
      >
        <Card className="p-1 mb-2">
          <CardHeader className="p-1">
            <CardTitle className="text-md">Diffuse</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <section className="flex flex-row justify-around">
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="diffuse-red" className="mr-2">
                  Red
                </Label>
                <Input
                  type="number"
                  id="diffuse-red"
                  className="h-8 w-12 px-1"
                  value={material.diffuse[0]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      diffuse: [val, material.diffuse[1], material.diffuse[2]],
                    });
                  }}
                />
              </FormItem>
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="diffuse-green" className="mr-2">
                  Green
                </Label>
                <Input
                  type="number"
                  id="diffuse-green"
                  className="h-8 w-12 px-1"
                  value={material.diffuse[1]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      diffuse: [material.diffuse[0], val, material.diffuse[2]],
                    });
                  }}
                />
              </FormItem>
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="diffuse-blue" className="mr-2">
                  Blue
                </Label>
                <Input
                  type="number"
                  id="diffuse-blue"
                  className="h-8 w-12 px-1"
                  value={material.diffuse[2]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      diffuse: [material.diffuse[0], material.diffuse[1], val],
                    });
                  }}
                />
              </FormItem>
            </section>
          </CardContent>
        </Card>

        <Card className="p-1 mb-2">
          <CardHeader className="p-1">
            <CardTitle className="text-md">Ambient</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <section className="flex flex-row justify-around">
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="ambient-red" className="mr-2">
                  Red
                </Label>
                <Input
                  type="number"
                  id="ambient-red"
                  className="h-8 w-12 px-1"
                  value={material.ambient[0]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      ambient: [val, material.ambient[1], material.ambient[2]],
                    });
                  }}
                />
              </FormItem>
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="ambient-green" className="mr-2">
                  Green
                </Label>
                <Input
                  type="number"
                  id="ambient-green"
                  className="h-8 w-12 px-1"
                  value={material.ambient[1]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      ambient: [material.ambient[0], val, material.ambient[2]],
                    });
                  }}
                />
              </FormItem>
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="ambient-blue" className="mr-2">
                  Blue
                </Label>
                <Input
                  type="number"
                  id="ambient-blue"
                  className="h-8 w-12 px-1"
                  value={material.ambient[2]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      ambient: [material.ambient[0], material.ambient[1], val],
                    });
                  }}
                />
              </FormItem>
            </section>
          </CardContent>
        </Card>

        <Card className="p-1 mb-2">
          <CardHeader className="p-1">
            <CardTitle className="text-md">Specular</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <section className="flex flex-row justify-around">
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="specular-red" className="mr-2">
                  Red
                </Label>
                <Input
                  type="number"
                  id="specular-red"
                  className="h-8 w-12 px-1"
                  value={material.specular[0]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      specular: [
                        val,
                        material.specular[1],
                        material.specular[2],
                      ],
                    });
                  }}
                />
              </FormItem>
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="specular-green" className="mr-2">
                  Green
                </Label>
                <Input
                  type="number"
                  id="specular-green"
                  className="h-8 w-12 px-1"
                  value={material.specular[1]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      specular: [
                        material.specular[0],
                        val,
                        material.specular[2],
                      ],
                    });
                  }}
                />
              </FormItem>
              <FormItem className="flex flex-row items-baseline">
                <Label htmlFor="specular-blue" className="mr-2">
                  Blue
                </Label>
                <Input
                  type="number"
                  id="specular-blue"
                  className="h-8 w-12 px-1"
                  value={material.specular[2]}
                  step={0.01}
                  min={0.0}
                  max={1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (isNaN(val)) return;
                    updateMaterial({
                      ...material,
                      specular: [
                        material.specular[0],
                        material.specular[1],
                        val,
                      ],
                    });
                  }}
                />
              </FormItem>
            </section>
          </CardContent>
        </Card>

        <Card className="p-1 mb-2">
          <CardHeader className="p-1">
            <CardTitle className="text-md">Opacity</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <FormItem className="flex flex-row">
              <Input
                type="number"
                id="opacity"
                value={material.opacity}
                step={0.01}
                min={0.0}
                max={1.0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (isNaN(val)) return;
                  updateMaterial({
                    ...material,
                    opacity: val,
                  });
                }}
              />
            </FormItem>
          </CardContent>
        </Card>

        <Card className="p-1 my-4">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-md">Albedo Map</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <section className="mb-2">
              <Select
                onValueChange={(albedo) => {
                  // update material albedo
                  meshMaterial.setValues({ albedo });
                  mvc.updateComponentOnCurrentlySelected('Mesh', meshComp[1]);
                }}
                value={meshMaterial.albedo}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a texture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {textureList.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </section>
          </CardContent>
        </Card>

        <Card className="p-1 my-4">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-md">Normal Map</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <section className="mb-2">
              <Select
                onValueChange={(normal_map) => {
                  // update normal map
                  meshMaterial.setValues({ normal_map });
                  mvc.updateComponentOnCurrentlySelected('Mesh', meshComp[1]);
                }}
                value={meshMaterial.normal_map}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a texture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {textureList.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </section>
          </CardContent>
        </Card>

        <Card className="p-1 my-4">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-md">Specular Map</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <section className="mb-2">
              <Select
                onValueChange={(specular_map) => {
                  // update spec map
                  meshMaterial.setValues({ specular_map });
                  mvc.updateComponentOnCurrentlySelected('Mesh', meshComp[1]);
                }}
                value={meshMaterial.specular_map}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a texture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {textureList.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </section>
          </CardContent>
        </Card>

        <Button>Update Material</Button>
      </form>
    </div>
  );
}

export default MaterialDetails;
