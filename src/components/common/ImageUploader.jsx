
"use client";
import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ImageUploader({
  value = [],
  onChange,
  max = 4,
  disabled = false,
}) {
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList).slice(0, max - value.length);

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        return false;
      }

      return true;
    });

    onChange([...value, ...validFiles]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="relative size-24 overflow-hidden rounded-lg border"
        >
          <img
            src={URL.createObjectURL(file)}
            alt="Selected"
            className="size-full object-cover"
          />

          <button
            type="button"
            onClick={() =>
              onChange(value.filter((_, i) => i !== index))
            }
            className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
            aria-label="Remove image"
            disabled={disabled}
          >
            <X className="size-3" />
          </button>
        </div>
      ))}

      {value.length < max && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-60"
        >
          <ImagePlus className="size-5" />
          Add image
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
