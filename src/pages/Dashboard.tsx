import { Bar, BarChart, CartesianGrid, XAxis, Rectangle } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

const chartData = [
  { month: "Jan", revenue: 1500 },
  { month: "Feb", revenue: 2000 },
  { month: "Mar", revenue: 2750 },
  { month: "Apr", revenue: 1730 },
  { month: "May", revenue: 900 },
  { month: "Jun", revenue: 1870 },
  { month: "Jul", revenue: 1870 },
  { month: "Aug", revenue: 2000 },
  { month: "Sep", revenue: 2750 },
  { month: "Oct", revenue: 1730 },
  { month: "Nov", revenue: 1240 },
  { month: "Dec", revenue: 1920 },
];

const chartConfig = {
  Jan: { label: "Jan" },
  Feb: { label: "Feb" },
  Mar: { label: "Mar" },
  Apr: { label: "Apr" },
  May: { label: "May" },
  Jun: { label: "Jun" },
  Jul: { label: "Jul" },
  Aug: { label: "Aug" },
  Sep: { label: "Sep" },
  Oct: { label: "Oct" },
  Nov: { label: "Nov" },
  Dec: { label: "Dec" },
} satisfies ChartConfig;

const chartData_2 = [
  { source: "Linkedin", candidates: 275, fill: "#0885E7" },
  { source: "Company Website", candidates: 200, fill: "#8AC3F5" },
  { source: "Referral", candidates: 287, fill: "#0885E7" },
  { source: "Other Job Portals", candidates: 173, fill: "#8AC3F5" },
];

const chartConfig_2 = {
  linkedin: { label: "Linkedin", color: "#0885E7" },
  website: { label: "Company Website", color: "#8AC3F5" },
  referral: { label: "Referral", color: "#0885E7" },
  portals: { label: "Other Job Portals", color: "#8AC3F5" },
} satisfies ChartConfig;

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Revenue from Placements",
            value: "₹12,30,000",
            bg: "bg-white",
          },
          {
            label: "Pending Invoices",
            value: "₹1,25,000",
            bg: "bg-[#ECF4FB]",
          },
          {
            label: "Total Candidates Registered",
            value: "865",
            bg: "bg-white",
          },
          {
            label: "Total Job Openings",
            value: "312",
            bg: "bg-[#ECF4FB]",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`${item.bg} shadow-md rounded-2xl p-5 flex flex-col items-center justify-center gap-2 transition-transform duration-300 hover:scale-105`}
          >
            <p className="text-sm text-gray-600 text-center font-medium">
              {item.label}
            </p>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bar Chart */}
        <Card className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-auto">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl">
                Revenue Growth from Placements
              </CardTitle>
              <select className="border rounded-md px-3 py-1 text-sm shadow-sm">
                <option disabled selected>
                  Select Year
                </option>
                <option>2025</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="h-full">
            <div className="w-full overflow-x-auto">
              <ChartContainer
                config={chartConfig}
                className="min-w-[600px] h-[300px]"
              >
                <BarChart data={chartData} height={300}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) =>
                      chartConfig[value as keyof typeof chartConfig]?.label
                    }
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#8AC3F5"
                    strokeWidth={1}
                    radius={8}
                    barSize={30}
                    activeIndex={2}
                    shape={(props: any) => (
                      <Rectangle
                        {...props}
                        fillOpacity={0.8}
                        stroke={props.payload.fill}
                        strokeDasharray={4}
                        strokeDashoffset={4}
                      />
                    )}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="w-full lg:w-1/3 h-[450px] flex flex-col">
          <CardHeader className="items-center text-center pb-0">
            <CardTitle>Candidate Source Channels</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={chartConfig_2}
              className="mx-auto max-h-[230px] aspect-square"
            >
              <PieChart width={250} height={250}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData_2}
                  dataKey="candidates"
                  nameKey="source"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  strokeWidth={5}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-1 text-sm px-6">
            <div className="w-full flex flex-col gap-2">
              {chartData_2.map((item, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <p>{item.source}</p>
                  <p>
                    <b>{item.candidates}</b>
                  </p>
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
