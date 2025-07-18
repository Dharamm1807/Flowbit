const express = require("express");
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const { auth, adminOnly } = require("../middleware/auth");
const {
  tenantIsolation,
  addTenantToBody,
} = require("../middleware/tenantIsolation");

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// POST /tickets - Create new ticket
router.post("/", auth, async (req, res) => {
  const {
    title,
    description,
    priority = "medium",
    assignedTo = null,
  } = req.body;
  const { customerId } = req.user;
  const userId = req.user?.id || req.user?._id;

  // Validation
  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({
      error: "Validation failed",
      details: {
        title: !title?.trim() ? "Title is required" : undefined,
        description: !description?.trim()
          ? "Description is required"
          : undefined,
      },
    });
  }

  try {
    const ticket = new Ticket({
      title: title.trim(),
      description: description.trim(),
      priority: ["low", "medium", "high"].includes(priority)
        ? priority
        : "medium",
      customerId,
      createdBy: userId,
      assignedTo,
      status: "open",
    });
    console.log("Creating ticket:", ticket);

    await ticket.save();

    // Optional n8n notification
    try {
      console.log("Notifying n8n about new ticket:", ticket._id);
      await fetch("http://localhost:5678/webhook-test/tickets-created", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticket._id }),
      });
    } catch (n8nError) {
      console.error("Failed to notify n8n:", n8nError);
    }

    // ✅ Only one response
    return res.status(201).json({
      ...ticket.toObject(),
      _links: {
        self: `/tickets/${ticket._id}`,
        all: `/tickets`,
      },
    });

  } catch (error) {
    console.error("Ticket creation failed:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Internal server error",
        requestId: req.requestId,
      });
    }
  }
});


// GET /tickets - Get all tickets for current user
router.get("/", tenantIsolation, async (req, res) => {
  try {
    const tickets = await Ticket.find({
      ...req.tenantFilter,
      $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }],
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch tickets",
      details: error.message,
    });
  }
});

// GET /tickets/all - Admin-only all tickets view
router.get("/all", adminOnly, tenantIsolation, async (req, res) => {
  try {
    const tickets = await Ticket.find(req.tenantFilter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: tickets.length,
      tickets,
      tenant: req.user.customerId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch tickets",
      details: error.message,
    });
  }
});

module.exports = router;
/* Get single ticket
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      ...req.tenantFilter,
    })
      .populate("createdBy", "email")
      .populate("assignedTo", "email");

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update ticket
router.put("/:id", async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;

    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, ...req.tenantFilter },
      {
        title,
        description,
        status,
        priority,
        assignedTo,
        updatedAt: Date.now(),
      },
      { new: true }
    )
      .populate("createdBy", "email")
      .populate("assignedTo", "email");

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete ticket
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({
      _id: req.params.id,
      ...req.tenantFilter,
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
*/
