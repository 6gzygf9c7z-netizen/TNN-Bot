const fs = require("fs");
const path = require("path");

const STOCK_FILE = path.join(
    __dirname,
    "../data/cafeteriaStock.json"
);

function loadStock() {

    if (!fs.existsSync(STOCK_FILE)) {

        return {
            foods: {},
            drinks: {},
            alcohol: {},
            cannabis: {},
            cigarettes: {}
        };

    }

    return JSON.parse(
        fs.readFileSync(
            STOCK_FILE,
            "utf8"
        )
    );

}

function saveStock(stock) {

    fs.writeFileSync(
        STOCK_FILE,
        JSON.stringify(
            stock,
            null,
            4
        )
    );

}
function getItem(category, itemId) {

    const stock = loadStock();

    if (!stock[category]) {

        return null;

    }

    return stock[category][itemId] || null;

}

function getPrice(category, itemId) {

    const item = getItem(
        category,
        itemId
    );

    if (!item) {

        return null;

    }

    return item.price;

}

function isAvailable(category, itemId) {

    const item = getItem(
        category,
        itemId
    );

    if (!item) {

        return false;

    }

    return (
        item.available === true &&
        item.stock > 0
    );

}

function getStock(category, itemId) {

    const item = getItem(
        category,
        itemId
    );

    if (!item) {

        return 0;

    }

    return item.stock;

}
function addStock(category, itemId, quantity, restockedBy = null) {

    const stock = loadStock();

    if (!stock[category]) {

        stock[category] = {};

    }

    if (!stock[category][itemId]) {

        stock[category][itemId] = {

            stock: 0,

            available: true,

            price: 0,

            restockedBy: null,

            lastRestocked: null

        };

    }

    stock[category][itemId].stock += quantity;

    stock[category][itemId].available = stock[category][itemId].stock > 0;

    stock[category][itemId].restockedBy = restockedBy;

    stock[category][itemId].lastRestocked = Date.now();

    saveStock(stock);

    return stock[category][itemId];

}

function removeStock(category, itemId, quantity = 1) {

    const stock = loadStock();

    const item = stock?.[category]?.[itemId];

    if (!item) {

        return false;

    }

    item.stock = Math.max(

        0,

        item.stock - quantity

    );

    item.available = item.stock > 0;

    saveStock(stock);

    return true;

}

function setPrice(category, itemId, price) {

    const stock = loadStock();

    const item = stock?.[category]?.[itemId];

    if (!item) {

        return false;

    }

    item.price = price;

    saveStock(stock);

    return true;

}

function setAvailability(category, itemId, available) {

    const stock = loadStock();

    const item = stock?.[category]?.[itemId];

    if (!item) {

        return false;

    }

    item.available = available;

    saveStock(stock);

    return true;

}

module.exports = {

    loadStock,

    saveStock,

    getItem,

    getPrice,

    isAvailable,

    getStock,

    addStock,

    removeStock,

    setPrice,

    setAvailability

};