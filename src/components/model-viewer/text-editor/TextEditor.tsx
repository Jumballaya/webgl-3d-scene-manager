import { useTheme } from '@/core/theme';
import useModelViewerCore from '@/core/useModelViewerCore';
import { useEditorStore } from '@/store/editorStore';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

export function TextEditor() {
  const { currentTextFile } = useEditorStore();
  const { theme } = useTheme();
  const mvc = useModelViewerCore();
  const [code, setCode] = useState(
    currentTextFile ? mvc.getScript(currentTextFile)?.text ?? '' : '',
  );

  useEffect(() => {
    if (currentTextFile === null) {
      setCode('');
      return;
    }
    const text = mvc.getScript(currentTextFile)?.text ?? '';
    setCode(text);
  }, [currentTextFile, mvc]);

  return (
    <div className="h-full w-full">
      <Editor
        language="lua"
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={code}
        path={currentTextFile ?? undefined}
        onChange={(text) => {
          if (text && currentTextFile) {
            const script = mvc.getScript(currentTextFile);
            if (script) {
              const original = script.text;
              try {
                script.updateText(text);
                script.compile();
              } catch (e) {
                script.updateText(original);
                script.compile();
                // @TODO: Route this error to the console logger component
              }
            }
          }
        }}
        onValidate={(...p) => {
          console.log(p);
        }}
      />
    </div>
  );
}
