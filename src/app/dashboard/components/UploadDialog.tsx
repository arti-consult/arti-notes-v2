import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) return;
    // TODO: Implement file upload logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Last opp lydopptak</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Velg lydfil</Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-violet-600 transition-colors"
              onClick={() => document.getElementById("file")?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {file
                    ? file.name
                    : "Klikk for å velge fil eller dra og slipp"}
                </p>
              </div>
              <input
                type="file"
                id="file"
                className="hidden"
                accept="audio/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Tittel</Label>
            <Input
              id="title"
              placeholder="Gi opptaket en tittel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !title}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Last opp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
