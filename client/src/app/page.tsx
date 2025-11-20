"use client";

import React from "react";
import { useEffect } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [data, setData] = React.useState<any[]>([]);
  const [temperatures, setTemperatures] = React.useState<number[]>([]);
  const [humidities, setHumidities] = React.useState<number[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      socket.emit("getAllData");
    });
    socket.on("allData", (receivedData) => {
      setData(receivedData);
      setTemperatures(receivedData.map((item: { temperature: any; }) => item.temperature));
      setHumidities(receivedData.map((item: { humidity: any; }) => item.humidity));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const socket = io("http://localhost:4000");
      socket.emit("getNewData");
      socket.on("newData", (newData) => {
        setData((prevData) => [...prevData, newData]);
        setTemperatures((prevTemps) => [...prevTemps, newData.temperature]);
        setHumidities((prevHumids) => [...prevHumids, newData.humidity]);
        socket.disconnect();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Realtime Environment Monitor
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Live data from ESP32 Sensor
          </p>
        </div>

        <div className="bg-white overflow-hidden shadow-xl rounded-2xl">
          <div className="p-6 sm:p-10">
            <div className="relative h-[500px] w-full">
              <Line
                datasetIdKey="id"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                      text: 'Sensor Trends',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Value'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Time (points)'
                      }
                    }
                  }
                }}
                data={{
                  labels: data ? data.map((_, index) => index) : [],
                  datasets: [
                    {
                      label: "Temperature (°C)",
                      data: temperatures,
                      borderColor: "rgb(14, 165, 233)", // sky-500
                      backgroundColor: "rgba(14, 165, 233, 0.5)",
                      tension: 0.4, // Smooth curve
                      pointRadius: 2,
                    },
                    {
                      label: "Humidity (%)",
                      data: humidities,
                      borderColor: "rgb(236, 72, 153)", // pink-500
                      backgroundColor: "rgba(236, 72, 153, 0.5)",
                      tension: 0.4, // Smooth curve
                      pointRadius: 2,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}