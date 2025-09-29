const express = require("express");
const router = express.Router();
const Hoot = require("../models/hoot");

const User = require("../models/user");

const verifyToken = require("../middleware/verify-token");

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ err: "User not found." });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//Update
router.put("/:hootId", verifyToken, async (req, res) => {
  try {
    const hoot = await Hoot.findById(req.params.hootId);

    if (!hoot.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const updatedHoot = await Hoot.findByIdAndUpdate(
      req.params.hootId,
      req.body,
      { new: true }
    );

    updatedHoot._doc.author = req.user;

    res.status(200).json(updatedHoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
