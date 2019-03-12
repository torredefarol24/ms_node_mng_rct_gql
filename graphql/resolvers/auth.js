const bcrypt = require('bcryptjs');
const JWT = require("jsonwebtoken");
const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  login : async args => {
    const { email, password} = args
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('User doesnt Exist');
      }

      const result = await bcrypt.compare(password, user.password)
      if (!result) {
        throw new Error('Password mismatch');
      }

      const token = JWT.sign({ userId : user._id, email : user.email}, "some-secret", { expiresIn : '1h'})
      return {
        userId : user._id,
        token : token,
        tokenExpiration : 1
      }

    } catch (err) {
      throw err
    }      
  }
};
