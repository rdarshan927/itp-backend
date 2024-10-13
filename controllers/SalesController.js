const Invoice =  require('../models/InvoiceModel')

const getInvoice = async(req, res) => {
    try {
        const Invoices = await Invoice.find();

        res.status(200).json({Invoices});
    } catch(error) {
        console.log(error);
    }
}

const getSingleInvoice = async (req, res) => {
    try {
        // Get the invoice ID from the request parameters
        const { id } = req.params;

        // Check if id is a valid ObjectId before proceeding
        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // Find the invoice by ID
        const invoice = await Invoice.findById(id);

        // If no invoice is found, return a 404 error
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        // Return the found invoice
        res.status(200).json({ invoice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


const deleteInvoice = async(req, res) => {
    const ID = req.params.id;
    console.log('came : ', ID);
    try {
        const Invoices = await Invoice.findByIdAndDelete(ID);

        if(!Invoices){
            res.status(200).json({message: 'Deletion was not success!'});
        }
    } catch(error){
        console.log(error);
    }
}


const updateInvoice = async (req, res) => {
    try {
        const invoiceID = req.params.id; // Get item ID from the request params
        const { validity } = req.body; // Get validity value from the request body

        console.log(invoiceID, validity);

        // Find the item by ID and update its validity
        const response = await Invoice.findByIdAndUpdate(
            invoiceID,
            { validity },
            { new: true } // Return the updated document
        );

        if (!response) {
            return res.status(400).json({ message: 'Item not found!' });
        }

        res.status(200).json({ message: 'Validity updated successfully!', item: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating validity!' });
    }
};

const getMonthlyTotals = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    console.log("Current Year:", currentYear);

    // Step 1: Fetch all relevant documents
    const invoices = await Invoice.find({}).exec();

    // Step 2: Filter out documents with valid `paidOn` dates
    const filteredInvoices = invoices.filter(invoice => 
      invoice.paidOn instanceof Date && !isNaN(invoice.paidOn)
    );

    // Step 3: Group by month and calculate totals
    const monthlyTotals = filteredInvoices.reduce((acc, invoice) => {
      const month = invoice.paidOn.getMonth(); // 0-indexed
      const year = invoice.paidOn.getFullYear();

      if (year === currentYear) {
        acc[month] = (acc[month] || 0) + invoice.amountPaid;
      }
      return acc;
    }, {});

    // Step 4: Prepare results for response
    const results = Object.keys(monthlyTotals).map(monthIndex => ({
      month: monthIndex + 1, // Convert back to 1-indexed
      total: monthlyTotals[monthIndex],
      monthName: new Date(0, monthIndex).toLocaleString('default', { month: 'long' }) // Get month name
    }));

    console.log("Monthly Totals:", results);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error in getMonthlyTotals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSalesComparison = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    console.log("Current Year:", currentYear);

    // Fetch all relevant invoices
    const invoices = await Invoice.find({}).exec();

    // Step 1: Filter out documents with valid `paidOn` dates
    const filteredInvoices = invoices.filter(invoice => 
      invoice.paidOn instanceof Date && !isNaN(invoice.paidOn)
    );

    // Step 2: Group by year and calculate totals
    const yearlyTotals = {
      [currentYear]: 0,
      [currentYear - 1]: 0,
      [currentYear - 2]: 0
    };

    filteredInvoices.forEach(invoice => {
      const year = invoice.paidOn.getFullYear();
      if (year >= currentYear - 2 && year <= currentYear) {
        yearlyTotals[year] += invoice.amountPaid;
      }
    });

    console.log("Sales Comparison for Last 3 Years:", yearlyTotals);

    res.status(200).json(yearlyTotals);
  } catch (error) {
    console.error("Error in getSalesComparison:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCustomerStats = async (req, res) => {

    const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    try {
        // Total customers before the current month
        const previousCustomers = await Invoice.aggregate([
            { $match: { createdAt: { $lt: startOfCurrentMonth } } },
            { $group: { _id: "$userID" } }, // Group by userID to get distinct customers
            { $count: "totalPreviousCustomers" }
        ]);

        // Customers in the current month
        const newCustomers = await Invoice.aggregate([
            { $match: { createdAt: { $gte: startOfCurrentMonth } } },
            { $group: { _id: "$userID" } }, // Group by userID to get distinct customers
            { $count: "newCustomersThisMonth" }
        ]);

        // Send the result to the client
        return res.status(200).json({
            totalPreviousCustomers: previousCustomers[0]?.totalPreviousCustomers || 0,
            newCustomersThisMonth: newCustomers[0]?.newCustomersThisMonth || 0
        });
        
    } catch (error) {
        console.error('Error fetching customer stats:', error);
        throw error;
    }
};


module.exports = { getInvoice, getSingleInvoice, updateInvoice, deleteInvoice, getMonthlyTotals, getSalesComparison, getCustomerStats };