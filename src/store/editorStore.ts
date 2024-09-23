import { create } from 'zustand';

// @TODO:
//
//   Pass screen size down for resizing re-renders
//   This store should control everything about the UI
//
//

export type EditorTabName = '3d-viewer' | 'text-editor';

export type EditorStoreState = {
  currentTab: EditorTabName;
  setCurrentTab: (tab: EditorTabName) => void;

  currentTextFile: string | null;
  setCurrentTextFile: (file: string | null) => void;

  openFileTabs: string[];
  openFileTab: (tab: string) => void;
  closeFileTab: (tab: string) => void;
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

  openFileTabs: [],
  openFileTab: (tab: string) =>
    set((state) => ({
      ...state,
      currentTextFile: tab,
      openFileTabs: Array.from(new Set(state.openFileTabs.concat(tab))),
    })),
  closeFileTab: (tab: string) =>
    set((state) => {
      const openTabs = Array.from(
        new Set(state.openFileTabs.filter((t) => t !== tab)),
      );
      const currentTextFile =
        tab === state.currentTextFile
          ? openTabs[0] ?? null
          : state.currentTextFile;
      return {
        ...state,
        currentTextFile,
        openFileTabs: openTabs,
      };
    }),
}));
