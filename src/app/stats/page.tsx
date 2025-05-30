import StatsChart from "@/components/stats/StatsChart";
import StatsTitle from "@/components/stats/StatsTitle";
import StatsLore from "@/components/stats/StatsLore";

const Stats = () => {
  return (
    <div className="my-auto flex min-h-full flex-col items-center justify-center">
      <StatsTitle />
      <StatsChart />
      <StatsLore />
    </div>
  );
};

export default Stats;
