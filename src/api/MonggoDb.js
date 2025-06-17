import dotenv from "dotenv";
dotenv.config(); // Harus dipanggil paling atas sebelum pakai process.env

import mongoose from "mongoose";

const dbUrl = process.env.DBURL;

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("Connection error", error));

const testSchema = new mongoose.Schema({
  name: String,
  testField: String,
});

const TestModel = mongoose.model("Test", testSchema);

const testData = new TestModel({
  name: "Node-Mongo Connection Test",
  testField: "It works!",
});

testData
  .save()
  .then(doc => {
    console.log("Test document saved:", doc);
  })
  .catch(error => {
    console.error("Error saving test document:", error);
  });
