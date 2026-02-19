const Order = require("../models/Order");
const Reservation = require("../models/Reservation");

/**
 * Helper: Get date range based on report type
 */
const getDateRange = (type) => {
  const now = new Date();
  let startDate;

  if (type === "weekly") {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
  } else if (type === "monthly") {
    startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 1);
  } else if (type === "annual") {
    startDate = new Date(now);
    startDate.setFullYear(now.getFullYear() - 1);
  }

  return { startDate, endDate: now };
};

/**
 * Helper: Build period breakdown label
 */
const formatPeriodLabel = (id, type) => {
  if (type === "weekly") {
    // id = { year, month, day }
    return `${id.day}/${id.month}/${id.year}`;
  } else if (type === "monthly") {
    // id = { year, week }
    return `Week ${id.week}, ${id.year}`;
  } else {
    // id = { year, month }
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[id.month - 1]} ${id.year}`;
  }
};

/**
 * Helper: Get groupBy stage for aggregation
 */
const getGroupBy = (type) => {
  if (type === "weekly") {
    return {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" },
    };
  } else if (type === "monthly") {
    return {
      year: { $year: "$createdAt" },
      week: { $week: "$createdAt" },
    };
  } else {
    return {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
    };
  }
};

/**
 * @desc    Generate report (weekly / monthly / annual)
 * @route   GET /api/reports/:type
 * @access  Private (Admin)
 */
exports.getReport = async (req, res) => {
  try {
    const { type } = req.params;

    if (!["weekly", "monthly", "annual"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid report type." });
    }

    const { startDate, endDate } = getDateRange(type);
    const dateFilter = { createdAt: { $gte: startDate, $lte: endDate } };
    const groupBy = getGroupBy(type);

    // 1. Total Orders & Revenue
    const orderStats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    // 2. Total Reservations
    const reservationStats = await Reservation.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalReservations: { $sum: 1 } } },
    ]);

    // 3. Top Selling Items
    const topItems = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalQty: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // 4. Period Breakdown (orders + revenue per day/week/month)
    const orderBreakdown = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } },
    ]);

    const reservationBreakdown = await Reservation.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          reservations: { $sum: 1 },
        },
      },
    ]);

    // Merge order and reservation breakdowns by period label
    const breakdownMap = {};
    orderBreakdown.forEach((row) => {
      const label = formatPeriodLabel(row._id, type);
      breakdownMap[label] = {
        period: label,
        orders: row.orders,
        revenue: row.revenue,
        reservations: 0,
      };
    });

    reservationBreakdown.forEach((row) => {
      const label = formatPeriodLabel(row._id, type);
      if (breakdownMap[label]) {
        breakdownMap[label].reservations = row.reservations;
      } else {
        breakdownMap[label] = {
          period: label,
          orders: 0,
          revenue: 0,
          reservations: row.reservations,
        };
      }
    });

    const breakdown = Object.values(breakdownMap).sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    // 5. Build final response
    const stats = orderStats[0] || {};
    const resStats = reservationStats[0] || {};

    res.status(200).json({
      success: true,
      type,
      totalOrders: stats.totalOrders || 0,
      totalRevenue: Math.round(stats.totalRevenue || 0),
      avgOrderValue: Math.round(stats.avgOrderValue || 0),
      totalReservations: resStats.totalReservations || 0,
      topItems,
      breakdown,
    });
  } catch (err) {
    console.error("❌ Report Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to generate report." });
  }
};