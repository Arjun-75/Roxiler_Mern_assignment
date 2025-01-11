/*--------------------------------------------------------------- BACKEND (GET 1) -----------------------------------------------------------*/

const axios = require('axios');
const Transaction = require('../models/Transaction');


const THIRD_PARTY_URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

const initializeDatabase = async (req, res) => {
    try {
        
        const response = await axios.get(THIRD_PARTY_URL);
        const transactions = response.data;

        
        await Transaction.deleteMany({});

        
        const formattedTransactions = transactions.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || "N/A",
            price: item.price,
            dateOfSale: new Date(item.dateOfSale),
            sold: item.sold,
            category: item.category || "Unknown",
        }));
        await Transaction.insertMany(formattedTransactions);

        res.status(200).json({ message: "Database initialized successfully", count: formattedTransactions.length });
    } catch (error) {
        console.error("Error initializing database:", error);
        res.status(500).json({ error: "Failed to initialize database" });
    }
};

module.exports = { initializeDatabase };