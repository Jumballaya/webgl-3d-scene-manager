import Editor from '@monaco-editor/react';

export function TextEditor(props: { code: string }) {
  return (
    <div className="h-full w-full">
      <Editor
        language="lua"
        theme="vs-dark"
        value={props.code}
        onChange={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
}
