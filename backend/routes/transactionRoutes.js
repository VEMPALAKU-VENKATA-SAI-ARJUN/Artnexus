const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleWare");
const authorizeRoles = require("../middleware/roleMiddleware");

// 📌 Get all transactions (Only admin can view all transactions)
router.get("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  const transactions = await Transaction.find().populate("buyer artwork", "username title");
  res.json(transactions);
});

// 📌 Get transaction by ID (Only admin can view individual transaction)
router.get("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate("buyer artwork", "username title");
  res.json(transaction);
});

// 📌 Update transaction status (Only admin can update status)
router.put("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTransaction);
});

// 📌 Delete transaction (Only admin can delete a transaction)
router.delete("/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Transaction deleted" });
});

// 📌 Create a new transaction (Authenticated users)
// 📌 Create a new transaction (Authenticated users)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const buyer = req.user.id; // from authMiddleware
    const { artwork } = req.body;

    if (!artwork) {
      return res.status(400).json({ error: "Artwork ID is required" });
    }

    // Check if the user already bought the same artwork
    const existingTransaction = await Transaction.findOne({ buyer, artwork });
    if (existingTransaction) {
      return res.status(400).json({ error: "You have already purchased this artwork" });
    }

    // Get artwork price
    const Artwork = require("../models/Artwork");
    const foundArtwork = await Artwork.findById(artwork);
    if (!foundArtwork) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    const newTransaction = new Transaction({
      buyer,
      artwork,
      amount: foundArtwork.price,
      status: "completed", // or "pending" if you want manual confirmation
    });

    await newTransaction.save();
    res.status(201).json({ message: "Purchase successful", transaction: newTransaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});


// 📌 Get transactions for logged-in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const myTransactions = await Transaction.find({ buyer: userId, status: "completed" })
      .populate("artwork", "title price image")
      .sort({ createdAt: -1 });

    res.json(myTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
