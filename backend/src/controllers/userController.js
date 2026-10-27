
const User = require("../models/User");

const searchUsers = async (req, res, next) => {
  try {
    const searchTerm = req.query.q?.trim();

    // Return an empty list when no search term is provided.
    if (!searchTerm) {
      return res.status(200).json({ users: [] });
    }

    // Escape special regex characters in the search term.
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedTerm, "i");

    // Find users by username or email, excluding the logged-in user.
    const users = await User.find({
      _id: { $ne: req.user.userId },
      $or: [
        { username: searchRegex },
        { email: searchRegex },
      ],
    })
      .select("username email")
      .limit(20)
      .lean();

    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchUsers };
