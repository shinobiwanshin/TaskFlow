import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Circle, Clock, CheckCircle2, ListFilter } from "lucide-react";

const filters = [
  { value: "all", label: "All Tasks", icon: ListFilter },
  { value: "pending", label: "Pending", icon: Circle },
  { value: "in_progress", label: "In Progress", icon: Clock },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

export default function TaskFilters({
  activeFilter,
  onFilterChange,
  taskCounts,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const count =
          filter.value === "all"
            ? Object.values(taskCounts).reduce((a, b) => a + b, 0)
            : taskCounts[filter.value] || 0;

        return (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "gap-2 transition-all duration-200",
              activeFilter === filter.value
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md"
                : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
            )}
          >
            <Icon className="w-4 h-4" />
            {filter.label}
            <span
              className={cn(
                "ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium",
                activeFilter === filter.value
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              {count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
