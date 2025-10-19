import clsx from "clsx";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface CustomModalHeaderProps {
  preTitle?: string | number;
  title: string;
  subtitle?: string;
}

export function CustomModalHeader({
  preTitle,
  title,
  subtitle,
}: CustomModalHeaderProps) {
  return (
    <>
      <DialogHeader
        className={clsx("flex-shrink-0 px-6 ", preTitle ? "pt-2" : "pt-4")}
      >
        <div className="flex items-start justify-between">
          <div>
            {preTitle && (
              <span className="text-sm text-muted-foreground">#{preTitle}</span>
            )}
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </DialogHeader>
      <Separator className="flex-shrink-0 -mb-3 w-full" />
    </>
  );
}
