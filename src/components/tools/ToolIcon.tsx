import {
  FileImage,
  Minimize2,
  Scaling,
  Smartphone,
  FileMinus,
  Braces,
  AlignLeft,
  Globe,
  Star,
  FileOutput,
  Combine,
  CheckCircle2,
  Fingerprint,
  Binary,
  Hash,
  Type,
  Palette,
  Calculator,
  Repeat,
  GraduationCap,
  Code2,
  FileText,
  Image,
  HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  FileImage,
  Minimize2,
  Scaling,
  Smartphone,
  FileMinus,
  Braces,
  AlignLeft,
  Globe,
  Star,
  FileOutput,
  Combine,
  CheckCircle2,
  Fingerprint,
  Binary,
  Hash,
  Type,
  Palette,
  Calculator,
  Repeat,
  GraduationCap,
  Code2,
  FileText,
  Image,
};

interface ToolIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function ToolIcon({ name, size = 20, className = '' }: ToolIconProps) {
  const Icon = iconMap[name] || HelpCircle;
  return <Icon size={size} className={className} />;
}
