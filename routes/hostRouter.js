const express = require('express');
const hostRouter = express.Router();

hostRouter.get("/host/add-home", (req, res, next) => {
    res.send(`
        <h1> Welcome to Home Page</h1>
        <form action="/host/add-home" method="POST">
        <input type="text" name="houseName" placeholder="Enter house name" />
        <input type="submit" />
        </form>
        `);
});

hostRouter.post("/host/add-home", (req, res, next) => {
    console.log(req.body);
    res.send(`
        <h1> Home registered successfully</h1>
        <a href="/">Go to Home</a>
        `);
});

module.exports = hostRouter;