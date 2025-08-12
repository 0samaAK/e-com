const express = require('express')
const db = require('../config/db')

const getAnalyticsData = async (req, res) => {
    
    try {
      
      const [ data ] = await db.query(`SELECT (SELECT COUNT(*) FROM users) AS totalUsers, (SELECT COUNT(*) FROM products) AS totalProducts, (SELECT COUNT(*) FROM orders) AS totalSales, (SELECT COALESCE(SUM(totalAmount), 0) FROM orders) AS totalRevenue`)

    return data[0]

    } catch (error) {

        return error.message

    }

}

const getDailySalesData = async (startDate, endDate) => {

  const pad = (num) => String(num).padStart(2, '0')
        
    const formatDateLocal = (date) => {
        
        return `${ date.getFullYear() }-${ pad(date.getMonth() + 1) }-${ pad(date.getDate()) }`
        
    }
    
  try {
    
    const rows = await db.query(`SELECT DATE(createdAt) AS date, COUNT(*) AS sales, COALESCE(SUM(totalAmount), 0) AS revenue FROM orders WHERE createdAt BETWEEN ? AND ? GROUP BY DATE(createdAt) ORDER BY date ASC`, [ startDate, endDate ])

    const allDates = getDatesInRange(startDate, endDate)
    
    const result = allDates.map(date => {

      const found = rows[0].find(r => formatDateLocal(new Date(r.date)) === date)

      return {

        date,
        sales: found ? found.sales : 0,
        revenue: found ? found.revenue : 0

      }

    })

    return result

  } catch (error) {

    console.error("Error fetching daily sales:", error)
    return error.message

  }

}

function getDatesInRange(startDate, endDate) {

  const dates = []
  let current = new Date(startDate)
  let last = new Date(endDate)

  while (current <= last) {

    dates.push(current.toISOString().split("T")[0])
    current.setDate(current.getDate() + 1)
  
  }

  return dates

}

module.exports = { getAnalyticsData, getDailySalesData }