const express = require("express");
const dotenv = require("dotenv")
require("express-async-errors");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

dotenv.config();

// Initializing our app
const app = express();

// Parsing the json
app.use(express.json());

// Basic dummy route
app.get("/", (req, res) => {
    res.send(`<h1>Store Api <a href="/api/v1/products"> products route </a> </h1>`);
})

app.use("/api/v1/products", productsRouter)

// If the route that is passed not exists
app.use(notFoundMiddleware);

// If something wrong , error middleware will be called
app.use(errorMiddleware);

// Initializing the port number
const port = process.env.PORT | 3000;

// Starting the server and connecting to the db
const start = async () => {
    try {

        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log("Server listening on the port"));
    }
    catch (error) {
        console.log("Error : ", error)
    }
}


start();
