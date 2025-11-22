import { useEffect, useState } from "react";

const COLOR_VARS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
] as const;

// Dynamically create a union type from the kebab-case strings
type KebabToCamelCase<S extends string> = S extends `${infer T}-${infer U}`
  ? `${T}${Capitalize<KebabToCamelCase<U>>}`
  : S;

// Create a mapped type for our colors
export type KonvaColors = {
  [K in (typeof COLOR_VARS)[number] as KebabToCamelCase<K>]: string;
};

export const useKonvaColors = (): KonvaColors => {
  const [colors, setColors] = useState<KonvaColors>({} as KonvaColors);

  useEffect(() => {
    const computedStyles = getComputedStyle(document.documentElement);
    const colorMap = {} as KonvaColors;

    COLOR_VARS.forEach((variable) => {
      const colorValue = computedStyles
        .getPropertyValue(`--${variable}`)
        .trim();
      if (colorValue) {
        const camelCaseName = variable.replace(/-(\w)/g, (_, letter) =>
          letter.toUpperCase()
        ) as keyof KonvaColors;
        (colorMap[camelCaseName] as string) = `hsl(${colorValue})`;
      }
    });

    setColors(colorMap);
  }, []);

  return colors;
};
