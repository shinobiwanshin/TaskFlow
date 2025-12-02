import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";

const departmentColors = {
  Engineering: "bg-blue-50 text-blue-700 border-blue-200",
  Design: "bg-purple-50 text-purple-700 border-purple-200",
  Marketing: "bg-pink-50 text-pink-700 border-pink-200",
  Sales: "bg-green-50 text-green-700 border-green-200",
  HR: "bg-amber-50 text-amber-700 border-amber-200",
  Finance: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export default function EmployeeCard({ employee, taskCount, onClick }) {
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      className="p-5 bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Avatar: using our Avatar component; prefer fallback initials when image is absent */}
        {/* Always show initials fallback to avoid layout issues with image */}
        <Avatar
          alt={employee.name}
          fallback={initials}
          size="lg"
          className="avatar-lg"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
            {employee.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
            <WorkIcon className="icon-sm" />
            <span className="truncate">{employee.position}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-400">
            <EmailIcon className="icon-sm" />
            <span className="truncate">{employee.email}</span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Badge
              variant="secondary"
              className={`${
                departmentColors[employee.department]
              } border text-xs font-medium`}
            >
              {employee.department}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs text-slate-500 border-slate-200"
            >
              {taskCount} {taskCount === 1 ? "task" : "tasks"}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
