import React, { useState, useEffect } from "react";

const TransactionStatistics = () => {
  const [month, setMonth] = useState("June");
  const [data, setData] = useState({
    totalSale: 0,
    totalSoldItem: 0,
    totalNotSoldItem: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatistics = async (selectedMonth) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/transactions/statistics?month=${selectedMonth}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const stats = await response.json();
      setData({
        totalSale: stats.totalSale,
        totalSoldItem: stats.totalSold,
        totalNotSoldItem: stats.totalNotSold,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics(month);
  }, [month]);

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setMonth(selectedMonth);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          Statistics - {month}{" "}
          <span className="text-sm text-gray-500">
            (Statistics details for the selected month)
          </span>
        </h1>

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

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-yellow-100 p-4 rounded-md">
            <div className="flex justify-between py-1">
              <span>Total sale</span>
              <span>{data.totalSale}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Total sold item</span>
              <span>{data.totalSoldItem}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Total not sold item</span>
              <span>{data.totalNotSoldItem}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionStatistics;