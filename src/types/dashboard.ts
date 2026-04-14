import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  isHighlight?: boolean;
  cover?: string;
  accent?: string;
  description?: string;
  keywords?: string;
}

export interface NavGroup {
  title: string;
  url: string;
  items?: NavItem[];
}
