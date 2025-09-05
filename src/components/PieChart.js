import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, Title)

const PieChart = ({
  data,
  title = "Pie Chart",
  height = 400,
  colors = ["#7a1a32", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#ffd700", "#fbbf24", "#f59e0b"],
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
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
        borderWidth: 1,
        cornerRadius: 8,
        font: {
          family: "Inter, sans-serif",
        },
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#fff",
      },
    },
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: data?.label || "Data",
        data: data?.values || [],
        backgroundColor: colors.slice(0, (data?.labels || []).length),
        borderColor: colors.slice(0, (data?.labels || []).length),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }

  return (
    <div style={{ height: `${height}px`, width: "100%" }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}

export default PieChart
