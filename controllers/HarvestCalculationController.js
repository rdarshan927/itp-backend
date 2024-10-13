const HarvestModel = require("../models/HarvestModel"); // Adjust the path as needed
const moment = require("moment");

// Function to get crop estimates for the current month and annual crop counts
const getCropEstimatesAndAnnualCount = async (cropType) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const previousMonthEnd = new Date(currentYear, currentMonth, 0); // Last day of previous month
    const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);
    const nextMonthEnd = new Date(currentYear, currentMonth + 2, 0); // Last day of next month

    console.log("Previous Month Start:", previousMonthStart);
    console.log("Previous Month End:", previousMonthEnd);
    console.log("Next Month Start:", nextMonthStart);
    console.log("Next Month End:", nextMonthEnd);

    try {
        // Get crop estimates for the current month
        const estimatesResults = await HarvestModel.aggregate([
            {
                $match: {
                    cropType: cropType,
                    harvestDate: {
                        $gte: previousMonthStart,
                        $lte: nextMonthEnd,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$harvestDate" },
                        month: { $month: "$harvestDate" },
                    },
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
        ]);

        console.log("Estimates Aggregation results:", estimatesResults);

        const cropEstimates = {
            previousMonth: 0,
            currentMonth: 0,
            estimatedNextMonth: 0,
        };

        estimatesResults.forEach((result) => {
            const month = result._id.month;
            const year = result._id.year;

            if (year === previousMonthStart.getFullYear() && month === previousMonthStart.getMonth() + 1) {
                cropEstimates.previousMonth = result.totalQuantity;
            } else if (year === currentYear && month === currentMonth + 1) {
                cropEstimates.currentMonth = result.totalQuantity;
            }
        });

        // Estimate for the next month
        cropEstimates.estimatedNextMonth = Math.round(cropEstimates.currentMonth * 1.2); // Example: increase by 20%

        // Get annual crop counts
        const annualResults = await HarvestModel.aggregate([
            {
                $match: {
                    cropType: cropType,
                },
            },
            {
                $group: {
                    _id: { $year: "$harvestDate" },
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        console.log("Annual crop count results:", annualResults);

        // Format the annual results
        const annualCropCounts = annualResults.map(result => ({
            year: result._id,
            totalQuantity: result.totalQuantity,
        }));

        return {
            cropEstimates,
            annualCropCounts,
        };
    } catch (error) {
        console.error("Error retrieving crop estimates and annual counts:", error); // Log error for debugging
        throw new Error("Error retrieving crop estimates and annual counts: " + error.message);
    }
};

const getCropEstimatesHandler = async (req, res) => {
    const { cropType } = req.body; // Get cropType from the request body

    try {
        const data = await getCropEstimatesAndAnnualCount(cropType);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCropEstimatesHandler,
};
