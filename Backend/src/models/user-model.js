const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", admin],
      default: user,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = () => {
  const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRETS, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = async (password) => {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model("User", userSchema);
