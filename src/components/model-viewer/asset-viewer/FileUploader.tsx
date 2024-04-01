import { useRef } from 'react';
import useModelViewerCore from '@/core/useModelViewerCore';
import { Button } from '@/shadcn/ui/button';

export function FileUploader(props: { onUpload?: () => void }) {
  const ref = useRef<HTMLInputElement | null>(null);
  const mvc = useModelViewerCore();
  return (
    <div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          if (ref.current) {
            ref.current.click();
          }
        }}
      >
        Upload File
      </Button>
      <input
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.mtl,.obj,text/plain"
        style={{ visibility: 'hidden', width: 0, height: 0 }}
        ref={ref}
        onChange={async (e) => {
          const files = e.target.files;
          if (files) {
            await mvc.processFiles(files);
            if (props.onUpload) props.onUpload();
          }
        }}
      />
    </div>
  );
}
