const UserModel = require("../models/user");

module.exports = {
    
  getUser: async (req, res) =>  {
    const userId = req.user.id;

    try {
       const user = await UserModel.findOne({ id: userId })
       if (user) {
        res.status(200).json({
          status: true,
          data: user.toJSON(),
        });
      } else {
        res.status(404).json({
          status: false,
          error: 'User not found',
        });
      }
    } catch (err) {
        res.status(500).json({
          status: false,
          error: err.message,
        });
      }
  }
};