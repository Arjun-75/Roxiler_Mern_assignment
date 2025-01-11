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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartStats = () => {
  
  const [month, setMonth] = useState("June"); 
  const [chartData, setChartData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

 
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


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 80, 
      },
    },
  };

  
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

      
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Frequency",
            data: data.frequencies, 
            backgroundColor: "#5AC9E8", 
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

  
  useEffect(() => {
    fetchChartData(month);
  }, [month]);

  
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
       
        <h1 className="text-2xl font-bold mb-4">Bar Chart Stats</h1>

       
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
          
        </select>

       
        {loading && <p>Loading...</p>}

       
        {error && <p className="text-red-500">{error}</p>}

        
        {chartData && <Bar data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
};

export default BarChartStats;