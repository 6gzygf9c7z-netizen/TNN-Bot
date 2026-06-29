const fs = require("fs");

const FILE = "./data/cafeteriaStock.json";

function loadStock() {

    if (!fs.existsSync(FILE)) {

        fs.writeFileSync(
            FILE,
            JSON.stringify({}, null, 2)
        );

    }

    return JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

}

function saveStock(data) {

    fs.writeFileSync(
        FILE,
        JSON.stringify(data, null, 2)
    );

}

function getItem(itemId) {

    const stock = loadStock();

    return stock[itemId] || null;

}

function createItem(itemId, price = 0) {

    const stock = loadStock();

    if (!stock[itemId]) {

        stock[itemId] = {

            stock: 0,

            available: true,

            price

        };

    }

    saveStock(stock);

    return stock[itemId];

}
function addStock(itemId, quantity = 1) {

    const stock = loadStock();

    if (!stock[itemId]) {

        stock[itemId] = {

            stock: 0,

            available: true,

            price: 0

        };

    }

    stock[itemId].stock += quantity;

    stock[itemId].available = stock[itemId].stock > 0;

    saveStock(stock);

    return stock[itemId];

}

function removeStock(itemId, quantity = 1) {

    const stock = loadStock();

    if (!stock[itemId]) {

        return false;

    }

    stock[itemId].stock = Math.max(
        0,
        stock[itemId].stock - quantity
    );

    stock[itemId].available = stock[itemId].stock > 0;

    saveStock(stock);

    return true;

}

function setPrice(itemId, price) {

    const stock = loadStock();

    if (!stock[itemId]) {

        stock[itemId] = {

            stock: 0,

            available: true,

            price

        };

    }

    stock[itemId].price = price;

    saveStock(stock);

    return stock[itemId];

}

function setAvailability(itemId, available) {

    const stock = loadStock();

    if (!stock[itemId]) {

        return false;

    }

    stock[itemId].available = available;

    saveStock(stock);

    return true;

}

function isAvailable(itemId) {

    const stock = loadStock();

    if (!stock[itemId]) {

        return false;

    }

    return stock[itemId].available;

}

module.exports = {

    loadStock,

    saveStock,

    getItem,

    createItem,

    addStock,

    removeStock,

    setPrice,

    setAvailability,

    isAvailable

};