const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  nickname: String,
  email: { type: String, unique: true, required: true },
  gender: String,
  birthdate: Date,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: String,
}, { timestamps: true });

UserSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
