const moongose = require("mongoose");

require("dotenv").config();
moongose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.SERVER_PW}@${process.env.CLUSTER_NAME}.mq7d0.mongodb.net/Cluster0?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.log(err);
  });
