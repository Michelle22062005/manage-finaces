import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export function CategoryIcon({
  name,
  size = 18,
  color = "#4EA8DE",
}: {
  name?: string | null;
  size?: number;
  color?: string;
}) {
  return (
    <MaterialCommunityIcons
      name={(name as IconName) || "tag-outline"} // ícono por defecto si no hay
      size={size}
      color={color}
    />
  );
}