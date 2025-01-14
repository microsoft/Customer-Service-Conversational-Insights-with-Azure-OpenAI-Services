import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  type ChartTypeRegistry,
  registerables,
} from "chart.js";

interface ChartProps {
  chartContent: {
    data: any;
    options: any;
    type: string;
  };
}

const ChatChart: React.FC<ChartProps> = ({
  chartContent,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current && chartContent.data && chartContent?.type) {
      ChartJS.register(...registerables);

      const myChart = new ChartJS(chartRef.current, {
        type:
          chartContent.type === "horizontalBar"
            ? "bar"
            : (chartContent.type as keyof ChartTypeRegistry),
        data: { ...chartContent.data },
        options: {
          ...chartContent?.options,
          responsive: false,
          indexAxis:
            chartContent.type === "horizontalBar"
              ? "y"
              : chartContent?.options?.indexAxis,
        },
      });

      return () => {
        myChart.destroy(); // Cleanup when component unmounts or updates
      };
    }
  }, [chartContent.data, chartContent?.options, chartContent?.type]);

  return <canvas ref={chartRef} />;
};

export default ChatChart;
