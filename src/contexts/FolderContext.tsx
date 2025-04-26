import { createContext, useContext, useState, ReactNode } from "react";

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

interface FolderContextType {
  folders: Folder[];
  addFolder: (folder: Omit<Folder, "id">) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);

  const addFolder = (folder: Omit<Folder, "id">) => {
    const newFolder: Folder = {
      ...folder,
      id: Date.now().toString(),
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      )
    );
  };

  const deleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        addFolder,
        updateFolder,
        deleteFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error("useFolders must be used within a FolderProvider");
  }
  return context;
}
