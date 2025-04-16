import type React from "react"
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
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
import axios from "axios"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface WPMGraphProps {
  socket: any // Replace 'any' with the correct type for your socket
}

const WPMGraph: React.FC<WPMGraphProps> = ({ socket }) => {
  const [averageWPM, setAverageWPM] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    axios
    .get("http://localhost:3011/api/averageWPM")
    .then((res) => {
        setAverageWPM(res.data);
    })
    .catch((err) => {
      console.error("Error fetching AVGWpm:", err);
    });

    socket.on("averageWPM", (wpm: number) => {
      setAverageWPM((prev) => [...prev, wpm])
      setLabels((prev) => [...prev, new Date().toLocaleTimeString()])
    })

    return () => {
      socket.off("averageWPM")
    }
  }, [socket])

  const data = {
    labels,
    datasets: [
      {
        label: "Average WPM",
        data: averageWPM,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Real-time Average WPM",
      },
    },
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Line data={data} options={options} />
    </div>
  )
}

export default WPMGraph

