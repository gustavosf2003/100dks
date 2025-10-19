import React, { useRef } from "react";

import clsx from "clsx";
import { Upload, X, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

type SavedImage = {
  image_url: string;
  file: File;
  image_order: number;
};

interface ImageUploadProps {
  images: SavedImage[];
  onImagesChange: (images: SavedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
  isViewOnly?: boolean;
  title?: string;
  isLoading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
  isViewOnly = false,
  title = "Imagens do Item",
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);

    // Update order
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
      image_order: i + 1,
    }));
    onImagesChange(reorderedImages);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + images.length > maxImages) {
      toast({
        title: "Limite excedido",
        description: `Você pode adicionar no máximo ${maxImages} imagens.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Formato inválido",
          description: "Apenas arquivos de imagem são permitidos.",
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} é muito grande. Limite de 5MB.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    const newImages: SavedImage[] = validFiles.map((file, index) => ({
      image_url: URL.createObjectURL(file),
      file,
      image_order: index + images.length + 1,
    }));

    onImagesChange([...images, ...newImages]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    // Reorder remaining images
    const reorderedImages = updatedImages.map((img, i) => ({
      ...img,
    }));
    onImagesChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      {!isViewOnly && (
        <>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {title}{" "}
              {isLoading ? (
                <Skeleton className="h-4 w-4" />
              ) : (
                <>
                  ({images.length}/{maxImages})
                </>
              )}
            </Label>
            {images.length < maxImages && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Adicionar Imagens
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      )}

      {isLoading ? (
        <ImageUploadSkeleton />
      ) : images.length === 0 ? (
        <NoImages />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card
              key={index}
              className={clsx(
                "relative group hover:shadow-lg rounded-lg transition-shadow",
                isViewOnly && "cursor-pointer"
              )}
              onClick={() => {
                if (isViewOnly) {
                  window.open(image.image_url, "_blank");
                }
              }}
            >
              <CardContent className="p-2">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <img
                    src={image.image_url}
                    alt={`Item ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                  {!isViewOnly && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-lg">
                      Principal
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                  {!isViewOnly && (
                    <div className="flex gap-1">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveImage(index, index - 1)}
                        >
                          ←
                        </Button>
                      )}
                      {index < images.length - 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => moveImage(index, index + 1)}
                        >
                          →
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const NoImages = () => {
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="p-6 text-center">
        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">Nenhuma imagem adicionada</p>
        <p className="text-sm text-gray-400">
          Clique em "Adicionar Imagens" para fazer upload
        </p>
      </CardContent>
    </Card>
  );
};

const ImageUploadSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-2">
            <Skeleton className="aspect-square overflow-hidden relative" />
            <Skeleton className="h-6 w-20 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageUpload;
