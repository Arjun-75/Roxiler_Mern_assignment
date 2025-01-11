import React, { useState, useEffect } from "react";

const TransactionDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 3;  

  const fetchTransactions = async () => {
    if (!selectedMonth) {
      console.error("Month is not selected.");
      return;
    }
    console.log("Fetching transactions for month:", selectedMonth);

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/transactions?search=${searchQuery}&page=${currentPage}&perPage=${itemsPerPage}&month=${selectedMonth}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      setTransactions(jsonData.transactions || []);
      setTotalPages(jsonData.totalPages || 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);  
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1);  
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchQuery, selectedMonth, currentPage]);

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Transaction Dashboard</h1>

      <div className="flex space-x-4 mb-6">
        <div className="relative">
          <input
            type="text"
            className="px-4 py-2 border rounded-full shadow-md focus:outline-none"
            placeholder="Search transactions"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="relative">
          <select
            className="appearance-none px-10 py-2 border rounded-full shadow-md focus:outline-none"
            value={selectedMonth}
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
          <span className="absolute right-4 top-3 pointer-events-none text-gray-500">▼</span>
        </div>
      </div>

      <div className="w-full max-w-5xl bg-yellow-200 rounded-lg overflow-hidden shadow-md">
        <table className="table-auto w-full text-center">
          <thead className="bg-yellow-300">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Sold</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 border">
                  Loading...
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-2 border">{transaction.id}</td>
                  <td className="px-4 py-2 border">{transaction.title}</td>
                  <td className="px-4 py-2 border">{transaction.description}</td>
                  <td className="px-4 py-2 border">${transaction.price}</td>
                  <td className="px-4 py-2 border">{transaction.category}</td>
                  <td className="px-4 py-2 border">
                    {transaction.sold ? "Yes" : "No"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 border">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 w-full max-w-5xl px-4">
        <div>Page {currentPage} of {totalPages}</div>
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg shadow-md"
            disabled={currentPage === 1 || loading}
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg shadow-md"
            disabled={currentPage === totalPages || loading}
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
