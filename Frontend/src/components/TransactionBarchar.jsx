import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartStats = () => {
  // State variables
  const [month, setMonth] = useState("June"); // Selected month
  const [chartData, setChartData] = useState(null); // Data for the chart
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Labels for the bar chart
  const labels = [
    "0-100",
    "101-200",
    "201-300",
    "301-400",
    "401-500",
    "501-600",
    "701-800",
    "801-900",
    "901 above",
  ];

  // Chart options for customization
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend (optional)
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 80, // Set maximum value for the y-axis (based on the design)
      },
    },
  };

  // Function to fetch data from the backend
  const fetchChartData = async (selectedMonth) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/transactions/barchart?month=${selectedMonth}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Set chart data dynamically
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Frequency",
            data: data.frequencies, // Data from the backend
            backgroundColor: "#5AC9E8", // Light blue bar color
            borderColor: "#5AC9E8",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      setError("Failed to fetch chart data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component loads or the selected month changes
  useEffect(() => {
    fetchChartData(month);
  }, [month]);

  // Function to handle month change
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">Bar Chart Stats</h1>

        {/* Dropdown for selecting the month */}
        <select
          className="border p-2 rounded-md mb-6"
          value={month}
          onChange={handleMonthChange}
        >
          <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          {/* Add more months if needed */}
        </select>

        {/* Loading state */}
        {loading && <p>Loading...</p>}

        {/* Error state */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Bar chart */}
        {chartData && <Bar data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
};

export default BarChartStats;