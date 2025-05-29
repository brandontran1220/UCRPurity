import StatsChart from "@/components/stats/StatsChart";
import StatsTitle from "@/components/stats/StatsTitle";

const Stats = () => {
  return (
    <div className="my-auto flex min-h-full flex-col items-center justify-center">
      <StatsTitle />
      <StatsChart />
    </div>
  );
};

export default Stats;
