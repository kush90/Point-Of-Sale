import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { months } from '../Helper';

const RechartBarChart = ({ orders, month }) => {
    let chartData;
    if (month) {
        // Group data by month
        const dataByMonth = orders.reduce((acc, entry) => {
            const month = new Date(entry.createdAt).getMonth();
            acc[month] = acc[month] || 0;
            acc[month] += entry.totalAmount;
            return acc;
        }, {});

        // Transform data for Recharts
        chartData = Object.keys(dataByMonth).map((month) => ({
            month: months[month], // Months are zero-indexed, so add 1
            totalAmount: dataByMonth[month],
        }));
    }
    else {
        // group data by date
        const processedData = orders.reduce((acc, item) => {
            const date = new Date(item.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += item.totalAmount;
            return acc;
        }, {});

        chartData = Object.keys(processedData).map(date => ({
            createdAt: date,
            totalAmount: processedData[date]
        }));
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={600} height={300} data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}

            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={month ? 'month' : 'createdAt'} />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="totalAmount" fill="#8884d8" barSize={50} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RechartBarChart;
