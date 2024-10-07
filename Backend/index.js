import { connectDb } from "./DB/index.js";
import dotenv from 'dotenv'
import { app } from "./app.js";


dotenv.config()

const port = process.env.PORT || 3000


connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log("⚙️  Server started on Port:", port);
    });
  })
  .catch((err) => console.log(err));

