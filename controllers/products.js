const Product = require("../models/products");


const getAllProductsStatic = async (req, res) => {

    const search = "ab"
    const products = await Product.find({}).sort("name");

    // const products = await Product.find({
    //     name:"vase table"
    // });
    res.status(200).json({
        length: products.length,
        products
    })
};

const getAllProducts = async (req, res) => {

    // 1).Displaying the query object
    // 2).Now we have to factor it because page and other properties we dont have to pass to the find method
    console.log("Query : ", req.query);

    const { featured, company, name, sort, fields, numericFilters } = req.query

    // Preparing the query object
    const queryObject = {}

    if (featured) {
        queryObject.featured = featured;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        // Looking for the products where e is in the name
        queryObject.name = { $regex: name, $options: "i" }
    }

    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte"
        }

        const $regEx = /\b(<|>|>=|=|<|<=)\b/g

        let filters = numericFilters.replace(regEx, (match) => {
            ` `
        })
        console.log("Numeric : ", numericFilters);
    }

    // After adding all the properties which we wanted
    console.log("Query Obj : ", queryObject);

    // Now executing the query
    let result = Product.find(queryObject)

    // If sort property provided chain it
    if (sort) {
        // Removing commas from the query
        const sortList = sort.split(",").join(" ");
        // Chaining the query
        result = result.sort(sortList);
    }
    else {
        // Chaining the query
        result = result.sort("createdAt")
    }

    if (fields) {
        // Removing commas from the fields
        const fieldsList = fields.split(",").join(" ");

        // Chaining the query
        result = result.select(fieldsList)
    }

    // Skip some products so we have implemented this logic
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Chaining the query
    result = result.skip(skip).limit(limit)

    // At the end waiting for the query to execute
    const products = await result;
    res.status(200).json({
        length: products.length,
        products
    })
};

module.exports = {
    getAllProducts,
    getAllProductsStatic
}