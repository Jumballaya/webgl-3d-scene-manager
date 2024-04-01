import { TooltipTrigger, Tooltip, TooltipContent } from '@/shadcn/ui/tooltip';
import { Button } from '@/shadcn/ui/button';
import { Box, Grid3X3, Lightbulb, Trash2 } from 'lucide-react';
import useModelViewerCore from '@/core/useModelViewerCore';
import { Light } from '@/renderer/viewer/light/Light';

export function EntityListCommands() {
  const mvc = useModelViewerCore();

  return (
    <div className="flex items-center gap-2 px-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={(e) => {
              e.preventDefault();
              const ent = mvc.addEntity();
              mvc.setCurrentlySelected(ent);
            }}
            variant="ghost"
            size="icon"
          >
            <Box className="h-4 w-4" />
            <span className="sr-only">Create Entity</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create Entity</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={(e) => {
              e.preventDefault();
              const ent = mvc.addEntity('mesh');
              mvc.setCurrentlySelected(ent);
            }}
            variant="ghost"
            size="icon"
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="sr-only">Create Mesh</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create Mesh</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={(e) => {
              e.preventDefault();
              const ent = mvc.addEntity('light');
              mvc.setCurrentlySelected(ent);
            }}
            variant="ghost"
            size="icon"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="sr-only">Create Light</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create Light</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={(e) => {
              e.preventDefault();
              const currentlySelected = mvc.getCurrentlySelected();
              if (currentlySelected) {
                mvc.deleteEntity(currentlySelected.id);
                const lightComp =
                  currentlySelected.getComponent<Light>('Light');
                if (lightComp) {
                  mvc.removeLight(lightComp.data);
                }
              }
            }}
            variant="ghost"
            size="icon"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Entity</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete Entity</TooltipContent>
      </Tooltip>
    </div>
  );
}
