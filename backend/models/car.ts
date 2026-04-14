import { DataTypes, Model, Optional, Sequelize } from "sequelize";

const environment = process.env.NODE_ENV ?? "development";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dbConfig = require("../config/config.cjs")[environment];

const sequelize = new Sequelize({
    dialect: "mysql",
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    logging: false,
});

type CarAttributes = {
    id: number;
    brand: string;
    model: string;
    year: number;
    createdAt?: Date;
    updatedAt?: Date;
};

type CarCreationAttributes = Optional<CarAttributes, "id" | "createdAt" | "updatedAt">;

class Car extends Model<CarAttributes, CarCreationAttributes> implements CarAttributes {
    declare id: number;
    declare brand: string;
    declare model: string;
    declare year: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Car.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1886,
                max: 3000,
            },
        },
    },
    {
        sequelize,
        modelName: "Car",
        tableName: "cars",
    }
);

export type { CarAttributes, CarCreationAttributes };
export { sequelize };
export default Car;
