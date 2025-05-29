"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];
const supabase = createClient();

const categoryLabels = {
  pure: "Pure Rice",
  silly: "Silly Rice",
  average: "Average Rice",
  dirty: "Dirty Rice",
};

const categoryImages: Record<string, string> = {
  pure: "/happyRice.svg",
  silly: "/sillyRice.svg",
  average: "/neutralRice.svg",
  dirty: "/dirtyRice.svg",
};

type CustomPieLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  value: number;
  name: string;
};

// Custom label renderer for Pie
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
  name,
}: CustomPieLabelProps & { value: number; name: string }) => {
  const RADIAN = Math.PI / 180;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 500;
  const labelOffset = isMobile ? 55 : 65;
  const imgSize = isMobile ? 0 : 50;
  const radius = outerRadius + labelOffset;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const imgKey = name?.toLowerCase().split(" ")[0] || "";
  const imgSrc = categoryImages[imgKey];
  const spacing = 0;
  return (
    <g>
      {!isMobile && imgSrc && (
        <image
          href={imgSrc}
          x={x - (imgSize + spacing) / 2}
          y={y - imgSize / 2}
          width={imgSize}
          height={imgSize}
          style={{ pointerEvents: "none" }}
        />
      )}
      <text
        x={isMobile ? x : x + imgSize / 2 + spacing}
        y={y}
        fill="#333"
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={isMobile ? 18 : 20}
        fontWeight="bold"
      >
        {`${value}%`}
      </text>
    </g>
  );
};

export default function StatsChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch scores from user_scores table
      const { data: userScores, error } = await supabase
        .from("user_scores")
        .select("score");
      if (error) {
        setLoading(false);
        return;
      }
      // Group scores into categories
      const counts: Record<string, number> = {
        pure: 0,
        silly: 0,
        average: 0,
        dirty: 0,
      };
      userScores?.forEach((row: { score: number }) => {
        if (row.score >= 76) counts.pure += 1;
        else if (row.score >= 51) counts.silly += 1;
        else if (row.score >= 26) counts.average += 1;
        else counts.dirty += 1;
      });
      const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
      const chartData = Object.entries(counts).map(([key, value]) => ({
        name: categoryLabels[key as keyof typeof categoryLabels] || key,
        value: total > 0 ? Math.round((value / total) * 100) : 0, // percentage
      }));
      setData(chartData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data.length) return <div>No data available.</div>;

  return (
    <ResponsiveContainer
      className="mb-10 flex min-h-full flex-col justify-center gap-4"
      width="100%"
      height={380}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(props) => renderCustomLabel({ ...props, outerRadius: 85 })} // bring label closer
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
