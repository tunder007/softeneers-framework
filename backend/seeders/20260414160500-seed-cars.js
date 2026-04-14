"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("cars", [
            {
                brand: "Dacia",
                model: "Duster",
                year: 2021,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                brand: "Volkswagen",
                model: "Golf 7",
                year: 2019,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                brand: "Tesla",
                model: "Model 3",
                year: 2023,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("cars", null, {});
    },
};
