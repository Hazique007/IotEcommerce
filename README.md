# 🔌 IoT-Integrated E-Commerce Platform

A full-stack e-commerce platform that merges the physical and digital world using **IoT hardware (Arduino + sensors)** and the **MERN stack**. This platform allows users to **purchase smart devices**, while also **monitoring their real-time data** through a web dashboard.

From browsing products to tracking sensor data (like temperature, humidity, or RFID scans), everything is connected through a powerful backend and intuitive UI — making it a perfect blend of **IoT + Web Commerce**.


## 🌟 Features

- 🛒 **E-Commerce Functionality**
  - Users can browse, add to cart, and place orders for IoT-based products.
  - Admin panel for managing products and monitoring system activity.

- 🔌 **Real-Time IoT Device Integration**
  - Devices like **Arduino + DHT11 / RFID / Relays** push data to the backend via Serial or HTTP.
  - Live data is stored in MongoDB and rendered in real time on the frontend.

- 📊 **Live Dashboard for Monitoring**
  - Real-time graphs and logs using **Chart.js / Recharts** to show temperature, device state, scan history, etc.

- 🌐 **Custom Node.js API**
  - Efficient REST API to manage both product data and device logs, built using Express.

- 🧪 **Use Case Simulation**
  - Smart home devices, environmental sensors, and RFID access logs showcased live.

---

## 🧱 Tech Stack

| Layer         | Technology                         |
|---------------|-------------------------------------|
| Frontend      | React.js, TailwindCSS, Recharts     |
| Backend       | Node.js, Express.js                 |
| IoT Hardware  | Arduino Uno, ESP8266, DHT11, RFID   |
| Database      | MongoDB                             |
| Realtime Comm | Serial/USB, HTTP |


## ⚙️ Getting Started

Follow these steps to get the full IoT E-Commerce app up and running — frontend, backend, and Arduino integration.

### 📥 1. Clone the Repository

```bash
git clone https://github.com/yourusername/iot-ecommerce.git
cd iot-ecommerce
```

### 🖥️ 2. Backend Setup (Node.js + Express)

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Then start the backend server:

```bash
npm run dev
```

Your backend will now be running at: `http://localhost:5000`

### 🌐 3. Frontend Setup (React + TailwindCSS)

Open a new terminal window/tab and run:

```bash
cd frontend
npm install
npm start
```

Your frontend will now be running at: `http://localhost:3000`


---

## 🙌 Credits

Made with ❤️ by [Mohammad Hazique](https://github.com/Hazique007)  







