const User =require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

// register
  exports.register = async (req, res) => {
  console.log(req.body)

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.credentials.password, salt);

    const newUser = new User({
      username: req.body.credentials.username,
      email: req.body.credentials.email,
      password: hash,
      // photo:req.body.photo,
    });

    await newUser.save();

    res.status(200).json({ success: true, message: "Successfully created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to create"});
    console.log(err)
  }
};

// login
exports.login = async (req, res) => {
  console.log(req.body)
  const email = req.body.email

  try {
    const user = await User.findOne({ email});

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!checkCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: 'invalid email or password' });
    }

    const { password, role, ...rest } = user._doc;

    //    jwt token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        expires: token.expiresIn,
      })
      .status(200)
      .json({
        token,
        data: { ...rest },
        role,
      });
  } catch (err) {
    console.log(err)
    res

        .status(500)
        .json({ success: false, message: "failed to login" });
  }
};