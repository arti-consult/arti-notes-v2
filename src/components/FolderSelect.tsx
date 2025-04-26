import { useFolders } from "@/contexts/FolderContext";
import { cn } from "@/lib/utils";

interface FolderSelectProps {
  currentFolderId: string | null;
  onFolderChange: (folderId: string | null) => void;
  disabled?: boolean;
}

export default function FolderSelect({
  currentFolderId,
  onFolderChange,
  disabled = false,
}: FolderSelectProps) {
  const { folders } = useFolders();

  return (
    <div>
      <label
        htmlFor="folderSelect"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Velg mappe
      </label>
      <select
        id="folderSelect"
        value={currentFolderId || ""}
        onChange={(e) => onFolderChange(e.target.value || null)}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg border px-4 py-2 focus:border-violet-500 focus:ring-violet-500",
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
          "border-gray-300"
        )}
      >
        <option value="">Ingen mappe</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
    </div>
  );
}
