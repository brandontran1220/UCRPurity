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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768; // Changed to md breakpoint
  const labelOffset = isMobile ? 55 : 80; // Increased offset for better spacing
  const imgSize = isMobile ? 0 : 60; // Slightly larger images
  const radius = outerRadius + labelOffset;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const imgKey = name?.toLowerCase().split(" ")[0] || "";
  const imgSrc = categoryImages[imgKey];

  // Calculate text position to center it on the radial line
  const textOffset = isMobile ? 0 : 50; // Increased spacing between image and text
  const textX = cx + (radius + textOffset) * Math.cos(-midAngle * RADIAN);
  const textY = cy + (radius + textOffset) * Math.sin(-midAngle * RADIAN);
  // Calculate line points for connecting line
  const lineStartRadius = outerRadius + 18; // Start exactly at the pie slice edge
  const lineEndRadius = outerRadius + (isMobile ? 30 : 40); // Shorter lines
  const lineStartX = cx + lineStartRadius * Math.cos(-midAngle * RADIAN);
  const lineStartY = cy + lineStartRadius * Math.sin(-midAngle * RADIAN);
  const lineEndX = cx + lineEndRadius * Math.cos(-midAngle * RADIAN);
  const lineEndY = cy + lineEndRadius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      {/* Connecting line */}
      <line
        x1={lineStartX}
        y1={lineStartY}
        x2={lineEndX}
        y2={lineEndY}
        stroke="#666"
        strokeWidth={1.5}
        strokeDasharray="none"
        style={{ pointerEvents: "none" }}
      />
      {!isMobile && imgSrc && (
        <image
          href={imgSrc}
          x={x - imgSize / 2}
          y={y - imgSize / 2}
          width={imgSize}
          height={imgSize}
          style={{ pointerEvents: "none" }}
        />
      )}
      <text
        x={isMobile ? x : textX}
        y={isMobile ? y : textY}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isMobile ? 16 : 18} // Slightly smaller text for better balance
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
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (!data.length)
    return (
      <div className="flex min-h-screen items-center justify-center">
        No data available.
      </div>
    );
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center pb-10">
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          {" "}
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={(props) => renderCustomLabel({ ...props, outerRadius: 105 })}
            labelLine={false}
            animationBegin={0}
            animationDuration={800}
            style={{ outline: "none" }}
          >
            {" "}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
                style={{
                  cursor: "pointer",
                  transition: "fill 0.2s ease-in-out",
                }}
                className="hover:brightness-110"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Percentage"]}
            labelStyle={{
              color: "#333",
              fontWeight: "bold",
              fontSize: "14px",
            }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "2px solid #0088FE",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              padding: "10px",
            }}
            cursor={{ fill: "rgba(0, 136, 254, 0.1)" }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "30px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
