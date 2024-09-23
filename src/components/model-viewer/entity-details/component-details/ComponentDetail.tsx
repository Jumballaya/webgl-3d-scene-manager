import { ReactElement } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import { XIcon } from 'lucide-react';

type ComponentDetailProps = {
  children?: ReactElement | ReactElement[];
  title: string;
  onDestroy?: () => void;
};

export function ComponentDetail(props: ComponentDetailProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="px-3 py-2">
          <span className="flex flex-row items-center">
            {props.onDestroy ? (
              <div
                className="p-1 bg-accent rounded mr-3 hover:bg-destructive"
                tabIndex={0}
                role="button"
                onClick={() => {
                  props.onDestroy?.();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    props.onDestroy?.();
                  }
                }}
              >
                <XIcon size={12} />
              </div>
            ) : null}
            {props.title}
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-2 pt-2">
          {props.children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
