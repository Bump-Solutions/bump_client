import { UploadedFile } from "../types/form";
import { ChangeEvent, forwardRef, useImperativeHandle, useRef } from "react";
import { useToast } from "../hooks/useToast";
import cuid from "cuid";

export interface UploaderHandle {
  open: () => void;
}

interface UploaderProps {
  onInputChange?: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
}

const Uploader = forwardRef<UploaderHandle, UploaderProps>(
  ({ onInputChange, accept = "", multiple = true, maxFiles, maxSize }, ref) => {
    const { addToast } = useToast();

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        inputRef.current?.click();
      },
    }));

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      let files = event.target.files ? Array.from(event.target.files) : [];

      if (maxFiles !== undefined && files.length > maxFiles) {
        addToast(
          "error",
          `Maximum ${maxFiles} fájl tölthető fel. (Aktuális: ${files.length})`
        );
        files = files.slice(0, maxFiles);
      }

      if (maxSize !== undefined) {
        const overized = files.filter((f) => f.size > maxSize);
        if (overized.length > 0) {
          addToast(
            "error",
            `A fájlok mérete nem haladhatja meg a ${
              maxSize / 1024 / 1024
            } MB-ot.`
          );
          files = files.filter((f) => f.size <= maxSize);
        }
      }

      if (files.length === 0) {
        event.target.value = "";
        return;
      }

      const fileReadPromises: Promise<UploadedFile>[] = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            resolve({
              id: cuid(),
              file: file,
              dataUrl: e.target?.result as string,
              name: file.name,
              size: file.size,
              type: file.type,
            });
          };

          reader.onerror = (e) => {
            reject(e);
          };

          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReadPromises).then((newFiles) => {
        onInputChange?.(newFiles);
      });

      event.target.value = ""; // Reset the input value
    };

    return (
      <input
        ref={inputRef}
        placeholder='Fájlok kiválasztása'
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    );
  }
);

export default Uploader;
