/* --------------------------------------------------------BACKEND (GET 2)------------------------------------------------------------------------- */

const Transaction = require('../models/Transaction');

const listTransactions = async (req, res) => {
    console.log("List Transactions API hit");
    console.log("Query Params:", req.query);

    try {
        const { search = "", page = 1, perPage = 10, month } = req.query;

        // Build search query
        const searchQuery = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                ...(isNaN(search) ? [] : [{ price: parseFloat(search) }]),
            ],
        };

        if (month) {
            const moment = require("moment");
            const monthNumber = moment().month(month).format("M");

            if (!monthNumber) {
                return res.status(400).json({ error: "Invalid month provided." });
            }

            searchQuery.$expr = { $eq: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)] };
        }

        // Pagination logic
        const skip = (parseInt(page) - 1) * parseInt(perPage);
        const limit = parseInt(perPage);

        // Fetch transactions with query and pagination
        const transactions = await Transaction.find(searchQuery)
            .skip(skip)
            .limit(limit);

        const totalRecords = await Transaction.countDocuments(searchQuery);

        res.status(200).json({
            currentPage: parseInt(page),
            perPage: limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            transactions,
        });
    } catch (error) {
        console.error("Error in listTransactions:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


/* -------------------------------------------------------------BACKEND (GET 3) ------------------------------------------------------------- */

const getStatistics = async (req, res) => {
    try {
        const { month } = req.query; // Month format: "January", "February", etc.

        if (!month) {
            return res.status(400).json({ error: "Month is required." });
        }

        // Map month names to their corresponding numbers (1-based index for MongoDB)
        const monthMap = {
            January: 0,
            February: 1,
            March: 2,
            April: 3,
            May: 4,
            June: 5,
            July: 6,
            August: 7,
            September: 8,
            October: 9,
            November: 10,
            December: 11,
        };

        const monthIndex = monthMap[month];
        if (monthIndex === undefined) {
            return res.status(400).json({ error: "Invalid month provided." });
        }

        // Use MongoDB aggregation to filter and calculate statistics
        const transactions = await Transaction.aggregate([
            {
                $addFields: {
                    saleMonth: { $month: "$dateOfSale" },
                },
            },
            {
                $match: {
                    saleMonth: monthIndex + 1, // MongoDB months are 1-based, adding 1 to match the correct month
                },
            },
        ]);

        // Calculate statistics
        const totalSale = transactions.reduce((sum, t) => (t.sold ? sum + t.price : sum), 0);
        const totalSold = transactions.filter(t => t.sold).length;
        const totalNotSold = transactions.length - totalSold;

        // Send statistics response
        res.status(200).json({
            totalSale,     // Total sale amount of the selected month
            totalSold,     // Total number of sold items of the selected month
            totalNotSold,  // Total number of not sold items of the selected month
        });
    } catch (error) {
        console.error("Error fetching statistics:", error.message);
        res.status(500).json({ error: "Failed to fetch statistics." });
    }
};

/*--------------------------------------------------------------- BACKEND (Get 4)---------------------------------------------------------- */

const moment = require("moment"); // Ensure you have this package installed

const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ error: "Month query parameter is required" });
        }

        // Parse the month into a number (e.g., "Jan" -> 1, "Feb" -> 2, etc.)
        const monthNumber = moment().month(month).format("M");

        if (!monthNumber) {
            return res.status(400).json({ error: "Invalid month provided" });
        }

        // Get transactions for the selected month regardless of the year
        const transactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)] },
        });

        // Initialize price ranges
        const priceRanges = {
            "0-100": 0,
            "101-200": 0,
            "201-300": 0,
            "301-400": 0,
            "401-500": 0,
            "501-600": 0,
            "601-700": 0,
            "701-800": 0,
            "801-900": 0,
            "901-above": 0,
        };

        // Group transactions by price ranges
        transactions.forEach(({ price }) => {
            if (price <= 100) priceRanges["0-100"]++;
            else if (price <= 200) priceRanges["101-200"]++;
            else if (price <= 300) priceRanges["201-300"]++;
            else if (price <= 400) priceRanges["301-400"]++;
            else if (price <= 500) priceRanges["401-500"]++;
            else if (price <= 600) priceRanges["501-600"]++;
            else if (price <= 700) priceRanges["601-700"]++;
            else if (price <= 800) priceRanges["701-800"]++;
            else if (price <= 900) priceRanges["801-900"]++;
            else priceRanges["901-above"]++;
        });

        // Prepare response data
        const responseData = Object.entries(priceRanges).map(([range, count]) => ({
            priceRange: range,
            count,
        }));

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).json({ error: "Failed to fetch bar chart data" });
    }
};

/*------------------------------------------------------------- BACKEND (GET 5)------------------------------------------------------------ */

const getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ error: "Month query parameter is required" });
        }

        // Parse the month into a number (e.g., "Jan" -> 1, "Feb" -> 2, etc.)
        const monthNumber = moment().month(month).format("M");

        if (!monthNumber) {
            return res.status(400).json({ error: "Invalid month provided" });
        }

        // Get transactions for the selected month regardless of the year
        const transactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)] },
        });

        // Group items by category
        const categoryCounts = {};
        transactions.forEach(({ category }) => {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        // Prepare response data
        const responseData = Object.entries(categoryCounts).map(([category, count]) => ({
            category,
            count,
        }));

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        res.status(500).json({ error: "Failed to fetch pie chart data" });
    }
};

/*-------------------------------------------------------------- BACKEND (GET 6)------------------------------------------------------ */

const getCombinedData = async (req, res) => {
    try {
        // Fetch data from the APIs (ensuring these functions return data)
        const statisticsPromise = getStatisticsData();
        const barChartDataPromise = getBarChartDataData();
        const pieChartDataPromise = getPieChartDataData();

        const [statistics, barChartData, pieChartData] = await Promise.all([
            statisticsPromise,
            barChartDataPromise,
            pieChartDataPromise,
        ]);

        const combinedData = {
            statistics,
            barChartData,
            pieChartData,
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error("Error fetching combined data:", error);
        res.status(500).json({ error: "Failed to fetch combined data" });
    }
};

// Helper functions to ensure the APIs return data
const getStatisticsData = async () => {
    const { month } = { month: "Jan" }; // Default value for demonstration
    const monthNumber = moment().month(month).format("M");

    const transactions = await Transaction.find({
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)] },
    });

    const totalSaleAmount = transactions.reduce((total, { price }) => total + price, 0);
    const totalSoldItems = transactions.length;
    const totalNotSoldItems = await Transaction.countDocuments({
        $expr: { $ne: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)] },
    });

    return { totalSaleAmount, totalSoldItems, totalNotSoldItems };
};

const getBarChartDataData = async () => {
    const { month } = { month: "Jan" }; // Default value for demonstration
    const monthNumber = moment().month(month).format("M");

    const transactions = await Transaction.find({
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)] },
    });

    const priceRanges = {
        "0-100": 0,
        "101-200": 0,
        "201-300": 0,
        "301-400": 0,
        "401-500": 0,
        "501-600": 0,
        "601-700": 0,
        "701-800": 0,
        "801-900": 0,
        "901-above": 0,
    };

    transactions.forEach(({ price }) => {
        if (price <= 100) priceRanges["0-100"]++;
        else if (price <= 200) priceRanges["101-200"]++;
        else if (price <= 300) priceRanges["201-300"]++;
        else if (price <= 400) priceRanges["301-400"]++;
        else if (price <= 500) priceRanges["401-500"]++;
        else if (price <= 600) priceRanges["501-600"]++;
        else if (price <= 700) priceRanges["601-700"]++;
        else if (price <= 800) priceRanges["701-800"]++;
        else if (price <= 900) priceRanges["801-900"]++;
        else priceRanges["901-above"]++;
    });

    return priceRanges;
};

const getPieChartDataData = async () => {
    const { month } = { month: "Jan" }; // Default value for demonstration
    const monthNumber = moment().month(month).format("M");

    const transactions = await Transaction.find({
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)] },
    });

    const categoryCounts = {};
    transactions.forEach(({ category }) => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));
};

module.exports = { listTransactions, getStatistics, getBarChartData, getPieChartData, getCombinedData };


