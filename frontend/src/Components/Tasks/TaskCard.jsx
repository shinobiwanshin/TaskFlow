import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FlagIcon from "@mui/icons-material/Flag";
import { format } from "date-fns";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const priorityConfig = {
  low: { label: "Low", className: "text-slate-500" },
  medium: { label: "Medium", className: "text-amber-500" },
  high: { label: "High", className: "text-red-500" },
};

export default function TaskCard({ task, employee }) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority || "medium"];

  const initials =
    employee?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className={`${status.className} border text-xs font-medium`}
            >
              {status.label}
            </Badge>
            <div
              className={`flex items-center gap-1 text-xs ${priority.className}`}
            >
              <FlagIcon className="icon-sm" />
              {priority.label}
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4">
            {task.due_date && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CalendarTodayIcon className="icon-sm" />
                <span>{format(new Date(task.due_date), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
        </div>

        {employee && (
          <div className="flex flex-col items-center gap-1">
            <Avatar
              alt={employee.name}
              fallback={initials}
              size="sm"
              className="avatar-sm"
            />
            <span className="text-xs text-slate-400 max-w-[80px] truncate text-center">
              {employee?.name?.split(" ")[0]}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
