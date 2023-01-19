const dotenv = require("dotenv")

dotenv.config();


const connectDB = require("./db/connect");
const Product = require("./models/products");
const jsonProducts = require("./products.json");



const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log("Connected to the database");

        // First deleting all the products
        await Product.deleteMany();
        console.log("All products deleted");

        // Now inserting all the products
        await Product.create(jsonProducts);
        console.log("All products inserted ");

        process.exit(0);

    }
    catch (error) {
        console.log("Error : ", error);
        process.exit(1);
    }
}


start();
