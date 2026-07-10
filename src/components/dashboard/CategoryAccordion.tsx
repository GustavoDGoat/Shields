import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FishSymbol, KeyRound, ShieldCheck, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrainingCategory } from "./TrainingTab";

interface CategoryAccordionProps {
  categories: TrainingCategory[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  phishing: FishSymbol,
  password: KeyRound,
  mfa: ShieldCheck,
};

const CategoryAccordion = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryAccordionProps) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const Icon = categoryIcons[category.id] || Folder;
        const isSelected = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
              isSelected
                ? "bg-primary/10 border border-primary/30 text-primary"
                : "bg-card/50 border border-border/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{category.name}</p>
              <p className="text-xs opacity-70">
                {category.videos.length} video{category.videos.length !== 1 ? "s" : ""}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryAccordion;
