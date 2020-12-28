const moongose = require("mongoose");

require("dotenv").config();
moongose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.log(err);
  });
