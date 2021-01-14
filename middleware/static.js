const path = require("path");
const express = require("express");

module.exports = (app) => {
  if (process.env.NODE_ENV === "production") {
    // Serve any static files
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    // Handle React routing, return all requests to React app
    app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
    });
  }
};
