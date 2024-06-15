const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory')


exports.createUser = (req, res)=>{
    res.status(500).json({
        staus:'error',
        message:'This route is not yet defined'
    });
};

exports.getUser= async (req, res) => {
    console.log(req.params.id)
    try {
      const user = await User.findById(req.params.id);
      // Tour.findOne({ _id: req.params.id })
    console.log(user);
      res.status(200).json({
        status: 'success',
        data: {
            user
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };
// exports.getAllUsers = factory.getAll(User);

// Do NOT update password with this!
// exports.updateOne = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);