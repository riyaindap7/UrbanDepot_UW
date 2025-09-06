import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const LineChart = ({
  data,
  title = "Line Chart",
  height = 400,
  xAxisLabel = "",
  yAxisLabel = "",
  color = "#7a1a32",
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: "bold",
          family: "Inter, sans-serif",
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        font: {
          family: "Inter, sans-serif",
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: {
            size: 12,
            weight: "bold",
            family: "Inter, sans-serif",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        display: true,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            size: 12,
            weight: "bold",
            family: "Inter, sans-serif",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: data?.label || "Data",
        data: data?.values || [],
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  }

  return (
    <div style={{ height: `${height}px`, width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default LineChart
