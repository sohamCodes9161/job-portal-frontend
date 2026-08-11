import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@/shared/theme/ThemeContext";

const COLORS_LIGHT = ["#4f46e5", "#818cf8", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];
const COLORS_DARK = ["#818cf8", "#a5b4fc", "#4ade80", "#fbbf24", "#f472b6", "#22d3ee"];

const getChartTheme = (theme) => {
  const dark = theme === "dark";
  return {
    colors: dark ? COLORS_DARK : COLORS_LIGHT,
    axisTick: { fontSize: 11.5, fill: dark ? "#9aa1ad" : "#9ca3af" },
    grid: dark ? "#242833" : "#f0f1f4",
    axisLine: dark ? "#2a2e38" : "#e5e7eb",
    cursorFill: dark ? "#1c2029" : "#f7f7f9",
    barPrimary: dark ? "#818cf8" : "#4f46e5",
    barSecondary: dark ? "#4ade80" : "#22c55e",
    tooltipStyle: {
      fontSize: 13,
      borderRadius: 8,
      border: `1px solid ${dark ? "#2a2e38" : "#e5e7eb"}`,
      background: dark ? "#171a21" : "#ffffff",
      color: dark ? "#f3f4f6" : "#111827",
      boxShadow: dark ? "0 8px 20px rgba(0,0,0,0.4)" : "0 8px 20px rgba(17,24,39,0.08)",
      fontFamily: "'Inter', system-ui, sans-serif",
    },
  };
};

/**
 * Pie chart showing the breakdown of job postings by job type.
 * data: [{ name: "full-time", value: 4 }, ...]
 */
export const JobTypePieChart = ({ data }) => {
  const { theme } = useTheme();
  const t = getChartTheme(theme);

  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={t.colors[index % t.colors.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip contentStyle={t.tooltipStyle} formatter={(value, name) => [value, name]} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12.5, textTransform: "capitalize", fontFamily: "inherit", color: "var(--color-text-secondary)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * Bar chart showing how many jobs were posted per day/week.
 * data: [{ label: "Jul 20", count: 3 }, ...]
 */
export const JobsTrendChart = ({ data }) => {
  const { theme } = useTheme();
  const t = getChartTheme(theme);

  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={t.grid} />
        <XAxis
          dataKey="label"
          tick={t.axisTick}
          axisLine={{ stroke: t.axisLine }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={t.axisTick}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip contentStyle={t.tooltipStyle} cursor={{ fill: t.cursorFill }} />
        <Bar dataKey="count" fill={t.barPrimary} radius={[6, 6, 0, 0]} maxBarSize={36} name="Jobs posted" />
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * Horizontal-ish bar chart: applicant counts for the top jobs.
 * data: [{ label: "Frontend Engineer", count: 12 }, ...]
 */
export const ApplicantsPerJobChart = ({ data }) => {
  const { theme } = useTheme();
  const t = getChartTheme(theme);

  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 42)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 20, left: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke={t.grid} />
        <XAxis type="number" allowDecimals={false} tick={t.axisTick} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={t.tooltipStyle} cursor={{ fill: t.cursorFill }} />
        <Bar dataKey="count" fill={t.barSecondary} radius={[0, 6, 6, 0]} maxBarSize={18} name="Applicants" />
      </BarChart>
    </ResponsiveContainer>
  );
};
