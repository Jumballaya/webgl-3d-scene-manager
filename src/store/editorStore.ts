import { create } from 'zustand';

export type EditorTabName = '3d-viewer' | 'text-editor';

export type EditorStoreState = {
  currentTab: EditorTabName;
  setCurrentTab: (tab: EditorTabName) => void;

  currentTextFile: string | null;
  setCurrentTextFile: (file: string | null) => void;
};

export const useEditorStore = create<EditorStoreState>((set) => ({
  currentTab: '3d-viewer',

  setCurrentTab: (tab: EditorTabName) =>
    set((state) => ({
      ...state,
      currentTab: tab,
    })),

  currentTextFile: null,
  setCurrentTextFile: (file: string | null) =>
    set((state) => ({
      ...state,
      currentTextFile: file,
    })),
}));
