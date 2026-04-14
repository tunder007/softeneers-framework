"use strict";

require("dotenv").config();

const shared = {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "monolith_demo_dev",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
};

module.exports = {
    development: { ...shared },
    test: {
        ...shared,
        database: process.env.DB_NAME_TEST || "monolith_demo_test",
    },
    production: {
        ...shared,
        database: process.env.DB_NAME_PROD || process.env.DB_NAME || "monolith_demo_prod",
    },
};
