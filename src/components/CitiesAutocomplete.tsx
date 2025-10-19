import React from "react";

import { usePlacesWidget } from "react-google-autocomplete";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (country: string) => void;
  label?: string;
  disabled?: boolean;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  onCountryChange,
  label = "Cidade *",
  disabled = false,
}) => {
  const { ref } = usePlacesWidget({
    apiKey: "AIzaSyCnFEUE7WO5To9MbrUaZnm2Yx-qr7_soAM",
    language: "pt-BR",
    options: {
      types: ["(cities)"],
    },
    onPlaceSelected: (place) => {
      const cityName = place.address_components[0].long_name || "";
      onChange(cityName);
      if (place.address_components && onCountryChange) {
        const countryComponent = place.address_components.find((component) =>
          component.types.includes("country")
        );
        if (countryComponent) {
          onCountryChange(countryComponent.long_name);
        }
      }
    },
  });

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        disabled={disabled}
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite a cidade"
        className="mt-1"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};
