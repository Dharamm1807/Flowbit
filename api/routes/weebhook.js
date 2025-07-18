const express = require("express");
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");

const router = express.Router();

router.post("/ticket-done", async (req, res) => {
  try {
    const { ticketId, status, details } = req.body;
    console.log("Webhook ticket-done received:", { ticketId, status, details });

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ error: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    ticket.status = status || ticket.status;
    ticket.resolutionDetails = details || ticket.resolutionDetails;
    await ticket.save();

    res.status(200).json({ message: "Ticket updated successfully" });
  } catch (error) {
    console.error("Webhook ticket-done error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
