## This project is a transaction management system that provides an API for managing and analyzing transactions, with an integrated backend and frontend. It is designed to deliver powerful insights into transactional data through various endpoints and visualizations, focusing on monthly statistics, bar chart data, and pie chart data. Below is an overview:

## Key Features:
### Backend Functionality:

Transaction Listing: Fetch paginated transaction records with optional search, filtering by description, title, price, and month.
Statistics: Compute key statistics like total sales, sold items, and unsold items for a given month.
Bar Chart Data: Categorize transactions into price ranges to visualize the distribution of transaction amounts.
Pie Chart Data: Aggregate transaction categories and display their counts for insights.
Combined Data API: Integrates statistics, bar chart, and pie chart data into a single endpoint.

### Frontend Integration:

Developed with CORS support to ensure seamless communication between the backend and frontend hosted on http://localhost:5173.
Data visualization for user-friendly analysis (frontend code likely uses charting libraries like Chart.js or D3.js).
Database:

Utilizes MongoDB to store transactional data, enabling complex queries like $expr, $month, and aggregation pipelines for efficient analytics.

### Tools & Frameworks:

Backend: Node.js with Express.js for API development.
Frontend: Integration-ready for modern frameworks like React or Vue.js.
Database: MongoDB with Mongoose ORM for schema management.
Middleware: Body-parser for request parsing and CORS for cross-origin requests.

### APIs Overview:

GET /api/transactions: Fetch transactions with search, pagination, and filtering.
GET /api/transactions/statistics: Monthly transaction statistics.
GET /api/transactions/bar-chart: Bar chart data for transaction prices.
GET /api/transactions/pie-chart: Pie chart data for transaction categories.
GET /api/transactions/combined: Consolidated data from all endpoints.

### Deployment:

Configured via dotenv for secure environment variable management, with MongoDB credentials sourced from .env.

![image](https://github.com/user-attachments/assets/ea40eb4f-d499-45c5-9c64-1aa25e708ff4)
![image](https://github.com/user-attachments/assets/aaa6c6c7-785d-44c3-b36c-9cee525c9e65)
![image](https://github.com/user-attachments/assets/5c700e72-7928-43fb-9ed3-48e006aaf644)
![image](https://github.com/user-attachments/assets/3b5b27a2-2e85-424f-8116-e9f0e0b963b7)
