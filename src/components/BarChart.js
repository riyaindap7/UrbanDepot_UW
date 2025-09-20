import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart = ({
  data,
  title = "Bar Chart",
  height = 400,
  xAxisLabel = "",
  yAxisLabel = "",
  colors = ["#7a1a32", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#ffd700", "#fbbf24", "#f59e0b"],
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
        borderColor: colors[0],
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
          display: false,
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
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: data?.datasets
      ? data.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || colors[index % colors.length],
          borderColor: dataset.borderColor || colors[index % colors.length],
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }))
      : [
          {
            label: data?.label || "Data",
            data: data?.values || [],
            backgroundColor: colors[0],
            borderColor: colors[0],
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
  }

  return (
    <div style={{ height: `${height}px`, width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default BarChart
