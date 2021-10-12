const path = require("path");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const PORT = process.env.PORT || 3000;
const app = express();
const socketio = require("socket.io");
module.exports = app;

const createApp = () => {
  //logging middleware
  app.use(morgan("dev"));

  //body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //middleware
  app.use(compression());

  //static file-serving middleware
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });
};

// sends to index.html
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/index.html"));
});

//error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

const startListening = () => {
  const server = app.listen(PORT, () => {
    console.log(`Crime happening on port ${PORT}`);
  });
};

async function bootApp() {
  await createApp();
  await startListening();
}

if (require.main === module) {
  bootApp();
} else {
  createApp();
}
