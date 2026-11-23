
"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

export default function ImageUploader({
  value = [],
  onChange,
  max = 4,
  disabled = false,
  deferUpload = false,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = value.map((item) =>
      typeof item === "string" ? item : URL.createObjectURL(item)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url, index) => {
        if (typeof value[index] !== "string") {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [value]);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList).slice(
      0,
      max - value.length
    );

    if (!files.length) return;

    const validFiles = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5 MB");
        continue;
      }

      validFiles.push(file);
    }

    if (!validFiles.length) return;

    if (deferUpload) {
      onChange([...value, ...validFiles]);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);

    const urls = [];

    for (const file of validFiles) {
      try {
        urls.push(await uploadImage(file));
      } catch (err) {
        toast.error(err.message || "Image upload failed");
      }
    }

    if (urls.length) {
      onChange([...value, ...urls]);
    }

    setUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((item, index) => (
        <div
          key={`${typeof item === "string" ? item : item.name}-${index}`}
          className="relative size-24 overflow-hidden rounded-lg border"
        >
          <img
            src={previews[index] || ""}
            alt="Uploaded"
            className="size-full object-cover"
          />

          <button
            type="button"
            onClick={() =>
              onChange(value.filter((_, i) => i !== index))
            }
            className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
            aria-label="Remove image"
            disabled={disabled || uploading}
          >
            <X className="size-3" />
          </button>
        </div>
      ))}

      {value.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || disabled}
          className="flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImagePlus className="size-5" />
          )}

          {uploading ? "Uploading" : "Add image"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={max > 1}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
