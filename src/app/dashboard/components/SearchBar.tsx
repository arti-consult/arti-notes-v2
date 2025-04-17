import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings2 } from "lucide-react";

export function SearchBar() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              className="pl-10 bg-gray-50/50 border-0 focus-visible:ring-1 focus-visible:ring-violet-500"
              placeholder="Søk i opptak, transkripsjoner, etiketter..."
            />
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-1">
            Søk i titler, etiketter og mapper
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200"
        >
          <Settings2 className="h-5 w-5" />
          <span>Rediger meter</span>
        </Button>
      </div>
    </div>
  );
}
