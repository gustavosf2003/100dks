import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CityAutocomplete } from "./CitiesAutocomplete";
import ImageUpload from "./ImageUpload";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "./ui/use-toast";

type SavedImage = {
  image_url: string;
  file: File;
  image_order: number;
};

type PurchaseSpaceFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

const formSchema = z.object({
  displayName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  size: z.string().min(1, "Digite o tamanho em centímetros"),
  width: z.string().optional(),
  country: z.string().optional(),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  race: z.string().min(1, "Selecione uma raça"),
  circunsidez: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const PurchaseSpaceForm = ({ isOpen, onClose }: PurchaseSpaceFormProps) => {
  const [images, setImages] = useState<SavedImage[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      size: "",
      width: "",
      country: "",
      city: "",
      race: "",
      circunsidez: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form submitted:", { ...data, images });

      toast({
        title: "Sucesso!",
        description: "Solicitação enviada com sucesso.",
      });

      // Reset form and close modal
      reset();
      setImages([]);
      onClose();
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a solicitação.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    reset();
    setImages([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comprar Espaço</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para adquirir um espaço na plataforma 100
            DKs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              {...register("displayName")}
              placeholder="Ex: João Silva, Maria Santos..."
            />
            {errors.displayName && (
              <p className="text-sm text-red-500">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Tamanho (cm)</Label>
            <div className="relative">
              <Input
                id="size"
                {...register("size")}
                placeholder="Ex: 180, 175, 190..."
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setValue("size", value);
                }}
                value={watch("size")}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                cm
              </div>
            </div>
            {errors.size && (
              <p className="text-sm text-red-500">{errors.size.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Largura (cm) - Opcional</Label>
            <div className="relative">
              <Input
                id="width"
                {...register("width")}
                placeholder="Ex: 15, 20, 25..."
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setValue("width", value);
                }}
                value={watch("width")}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                cm
              </div>
            </div>
            {errors.width && (
              <p className="text-sm text-red-500">{errors.width.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <CityAutocomplete
              value={watch("city")}
              onChange={(value) => setValue("city", value)}
              onCountryChange={(country) => setValue("country", country)}
              label="Cidade"
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              {...register("country")}
              placeholder="Preenchido automaticamente pela cidade"
              readOnly
              className="bg-gray-50 cursor-not-allowed"
            />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="race">Raça</Label>
            <Select
              value={watch("race")}
              onValueChange={(value) => setValue("race", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma raça" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branca">Branca</SelectItem>
                <SelectItem value="preta">Preta</SelectItem>
                <SelectItem value="parda">Parda</SelectItem>
                <SelectItem value="amarela">Amarela</SelectItem>
                <SelectItem value="indigena">Indígena</SelectItem>
                <SelectItem value="outra">Outra</SelectItem>
              </SelectContent>
            </Select>
            {errors.race && (
              <p className="text-sm text-red-500">{errors.race.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="circunsidez"
              checked={watch("circunsidez")}
              onCheckedChange={(checked) =>
                setValue("circunsidez", checked as boolean)
              }
            />
            <Label htmlFor="circunsidez">Circunsidez</Label>
          </div>

          <div className="space-y-2">
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={3}
              title="Imagens do DK"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseSpaceForm;
