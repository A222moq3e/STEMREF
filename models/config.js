const mongoose = require("mongoose");
const Mixed = mongoose.Schema.Types.Mixed;

// Create User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  subscribe: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  reviewed: {
    type: Mixed,
    required: false,
  },
});

// Create Courses Schema
const Courseschema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  Author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  tags: {
    type: [String],
  },
  paidContent: {
    type: Boolean,
  },
  discussions: {
    type: Mixed,
  },
  Content: {
    Videos: {
      type: [Mixed],
    },
    Articles: {
      type: [Mixed],
    },
    Quizzes: {
      type: [Mixed],
    },
    Assignments: {
      type: [Mixed],
    },
    Others: {
      type: [Mixed],
    },
  },
});
// Enable automatic createdAt and updatedAt fields
Courseschema.set("timestamps", true);

// Define Review schema in its own collection
const ReviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rating: { type: Number, required: true },
    text: { type: String },
  },
  { timestamps: true },
);

// Collections
const usersCollection = new mongoose.model("users", UserSchema);
const coursesCollection = new mongoose.model("courses", Courseschema);
const reviewsCollection = mongoose.model("reviews", ReviewSchema);

module.exports = { usersCollection, coursesCollection, reviewsCollection };
