const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const config = require("./src/configs/db.config")
const sql = require("mssql")
const app = express();

const port = process.env.PORT || 3333;
app.use(express.json());


async function getProduct() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query("select * from Products");
        return products;
    }
    catch (error) {
        console.log(error);
    }
};
app.get("/", (req, res) => {
    res.send({
        getAllProduct: `http:/127.0.0.1:${port}/get-all-product`,
    });
});

app.get("/get-all-product", async (req, res) => {
    let products = await getProduct().then(result => result.recordsets)
    res.status(404).json({
        message: "success",
        products: products,
    })
})
app.get("*", (req, res) => {
    res.status(404).json({
        message: "404 Page not found",
    })
})


app.get("/api", require("./src/routes/router").default);


app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});