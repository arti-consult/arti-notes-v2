interface RecordingUploadParams {
  file: File;
  title: string;
  folderId: string | null;
  participants: Array<{ name: string; email?: string }>;
  duration: number;
  onProgress?: (progress: number) => void;
}

export async function uploadRecording({
  file,
  title,
  folderId,
  participants,
  duration,
  onProgress,
}: RecordingUploadParams) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  if (folderId) {
    formData.append("folderId", folderId);
  }
  formData.append("participants", JSON.stringify(participants));
  formData.append("duration", duration.toString());

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener("progress", (event) => {
      if (onProgress && event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (error) {
          reject(new Error("Failed to parse response"));
        }
      } else {
        reject(new Error("Failed to upload recording"));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Failed to upload recording"));
    });

    xhr.open("POST", "/api/recordings/upload");
    xhr.send(formData);
  });
}
