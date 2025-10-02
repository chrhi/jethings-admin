import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Store, Package, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { CartesianGrid, Dot, Line, LineChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type DashboardKpiStats = {
  totalUsers: number;
  totalStores: number;
  totalProducts: number;
  processedMoney: number;
};

type KpiTrendData = {
  id: number;
  title: string;
  description: string;
  value: string | number;
  Icon: React.ComponentType<{ className?: string }>;
  trendDirection: "up" | "down";
  trendPercentage: number;
  trendValue?: number;
  previousValue?: number;
  chartData: Array<{ date: string; value: number }>;
  footerDescription: string;
};

const KpiCards = ({ stats }: { stats: DashboardKpiStats }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "short" });
  const currentYear = currentDate.getFullYear();
  const monthlyRange = `1 ${currentMonth} - ${new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate()} ${currentMonth} ${currentYear}`;

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const weeklyRange = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString(
    "en-US",
    { month: "short" }
  )} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString("en-US", {
    month: "short",
  })} ${currentYear}`;

  const data: KpiTrendData[] = [
    {
      id: 1,
      title: "Total Users",
      description: monthlyRange,
      value: stats.totalUsers.toLocaleString(),
      Icon: Users,
      trendDirection: "up",
      trendPercentage: 12,
      previousValue: 1250,
      trendValue: 45,
      chartData: [
        { date: "1", value: 1200 },
        { date: "2", value: 1180 },
        { date: "3", value: 1230 },
        { date: "4", value: 1210 },
        { date: "5", value: 1295 },
      ],
      footerDescription: "Active users in the platform",
    },
    {
      id: 2,
      title: "Active Stores",
      description: monthlyRange,
      value: stats.totalStores.toLocaleString(),
      Icon: Store,
      trendDirection: "up",
      trendPercentage: 8,
      previousValue: 45,
      trendValue: 3,
      chartData: [
        { date: "1", value: 42 },
        { date: "2", value: 44 },
        { date: "3", value: 46 },
        { date: "4", value: 47 },
        { date: "5", value: 48 },
      ],
      footerDescription: "Stores with recent activity",
    },
    {
      id: 3,
      title: "Products Listed",
      description: weeklyRange,
      value: stats.totalProducts.toLocaleString(),
      Icon: Package,
      trendDirection: "up",
      trendPercentage: 15,
      previousValue: 2800,
      trendValue: 120,
      chartData: [
        { date: "1", value: 2750 },
        { date: "2", value: 2820 },
        { date: "3", value: 2890 },
        { date: "4", value: 2950 },
        { date: "5", value: 2920 },
      ],
      footerDescription: "Total products in catalog",
    },
    {
      id: 4,
      title: "Revenue",
      description: weeklyRange,
      value: `$${(stats.processedMoney / 1000).toFixed(1)}K`,
      Icon: DollarSign,
      trendDirection: "up",
      trendPercentage: 22,
      previousValue: 15000,
      trendValue: 2500,
      chartData: [
        { date: "1", value: 14500 },
        { date: "2", value: 16200 },
        { date: "3", value: 15800 },
        { date: "4", value: 17300 },
        { date: "5", value: 17500 },
      ],
      footerDescription: "Total processed transactions",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {data?.map((item) => (
        <KpiCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default KpiCards;

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

export function KpiCard({
  title,
  description,
  value,
  Icon,
  trendDirection,
  trendPercentage,
  trendValue,
  chartData,
  footerDescription,
}: KpiTrendData) {
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;
  const isPositiveTrend = trendDirection === "up";

  return (
    <Card className="rounded-sm">
      <CardHeader className="gap-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <Badge
            variant={isPositiveTrend ? "default" : "destructive"}
            className={
              isPositiveTrend
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-destructive/10 text-destructive"
            }
          >
            <TrendIcon className="size-3.5" />
            {isPositiveTrend ? "+" : "-"}
            {trendPercentage}%
          </Badge>
        </div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <CardDescription className="-mt-1.5 font-medium ms-0.5">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-40">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 16,
              left: 16,
              right: 16,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="value"
                  hideLabel
                />
              }
            />
            <Line
              dataKey="value"
              type="natural"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot key={payload.date} r={5} cx={props.cx} cy={props.cy} />
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          <TrendIcon
            className={`size-4.5 ${
              isPositiveTrend ? "text-green-600" : "text-destructive"
            }`}
          />
          <span className="mt-0.5">
            {isPositiveTrend ? "Up by" : "Down by"}{" "}
            <strong
              className={
                isPositiveTrend ? "text-green-600" : "text-destructive"
              }
            >
              {trendValue}
            </strong>{" "}
            this month
          </span>
        </div>
        <div className="text-muted-foreground leading-none">
          {footerDescription}
        </div>
      </CardFooter>
    </Card>
  );
}