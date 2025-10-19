import { useState } from "react";

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

type PurchaseSpaceFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PurchaseSpaceForm = ({ isOpen, onClose }: PurchaseSpaceFormProps) => {
  const [formData, setFormData] = useState({
    displayName: "",
    size: "",
    width: "",
    country: "",
    city: "",
    race: "",
    circunsidez: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comprar Espaço</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para adquirir um espaço na plataforma 100
            DKs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              placeholder="Nome de exibição"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Select
              value={formData.size}
              onValueChange={(value) => handleInputChange("size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="xlarge">X-Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Width (Opcional)</Label>
            <Input
              id="width"
              value={formData.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              placeholder="Largura"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="País"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Cidade"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="race">Race</Label>
            <Input
              id="race"
              value={formData.race}
              onChange={(e) => handleInputChange("race", e.target.value)}
              placeholder="Raça"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="circunsidez"
              checked={formData.circunsidez}
              onCheckedChange={(checked) =>
                handleInputChange("circunsidez", checked as boolean)
              }
            />
            <Label htmlFor="circunsidez">Circunsidez</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-black hover:bg-gray-800">
              Enviar Solicitação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseSpaceForm;
