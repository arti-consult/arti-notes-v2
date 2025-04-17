import { Button } from "@/components/ui/button";
import { FolderOpen, Tag, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavigationItem {
  name: string;
  count?: number;
}

interface SidebarNavigationProps {
  folders?: NavigationItem[];
  tags?: NavigationItem[];
  selectedFolder?: string;
  selectedTag?: string;
  onFolderSelect?: (folder: string) => void;
  onTagSelect?: (tag: string) => void;
}

export function SidebarNavigation({
  folders = [],
  tags = [],
  selectedFolder,
  selectedTag,
  onFolderSelect,
  onTagSelect,
}: SidebarNavigationProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border h-[calc(100vh-24rem)]">
      <ScrollArea className="h-full pr-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-medium text-gray-700">
                <FolderOpen className="h-5 w-5 text-gray-500" />
                <span>Mapper</span>
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-violet-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start font-normal ${
                  selectedFolder === "all"
                    ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => onFolderSelect?.("all")}
              >
                Alle mapper
                <span className="ml-auto text-sm text-gray-500">
                  {folders.length}
                </span>
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.name}
                  variant="ghost"
                  className={`w-full justify-start font-normal ${
                    selectedFolder === folder.name
                      ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => onFolderSelect?.(folder.name)}
                >
                  {folder.name}
                  {folder.count !== undefined && (
                    <span className="ml-auto text-sm text-gray-500">
                      {folder.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-medium text-gray-700">
                <Tag className="h-5 w-5 text-gray-500" />
                <span>Etiketter</span>
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-violet-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {tags.map((tag) => (
                <Button
                  key={tag.name}
                  variant="ghost"
                  className={`w-full justify-start font-normal ${
                    selectedTag === tag.name
                      ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => onTagSelect?.(tag.name)}
                >
                  {tag.name}
                  {tag.count !== undefined && (
                    <span className="ml-auto text-sm text-gray-500">
                      {tag.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
