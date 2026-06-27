const fs = require("fs");

const FILE = "./data/stock.json";

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

function saveStock(stock) {

    fs.writeFileSync(
        FILE,
        JSON.stringify(stock, null, 2)
    );

}
function createItemStock(guildId, itemId, options = {}) {

    const stock = loadStock();

    if (!stock[guildId]) {

        stock[guildId] = {};

    }

    if (!stock[guildId][itemId]) {

        stock[guildId][itemId] = {

            currentStock: options.maximumStock || 100,

            maximumStock: options.maximumStock || 100,

            restockAmount: options.restockAmount || 25,

            restockInterval: options.restockInterval || 21600000,

            lastRestocked: Date.now()

        };

    }

    saveStock(stock);

    return stock[guildId][itemId];

}

function getItemStock(guildId, itemId) {

    const stock = loadStock();

    if (
        !stock[guildId] ||
        !stock[guildId][itemId]
    ) {

        return null;

    }

    return stock[guildId][itemId];

}
function removeStock(guildId, itemId, quantity = 1) {

    const stock = loadStock();

    if (
        !stock[guildId] ||
        !stock[guildId][itemId]
    ) {

        return false;

    }

    if (stock[guildId][itemId].currentStock < quantity) {

        return false;

    }

    stock[guildId][itemId].currentStock -= quantity;

    saveStock(stock);

    return true;

}

function restockItem(guildId, itemId) {

    const stock = loadStock();

    if (
        !stock[guildId] ||
        !stock[guildId][itemId]
    ) {

        return false;

    }

    const item = stock[guildId][itemId];

    item.currentStock = Math.min(

        item.maximumStock,

        item.currentStock + item.restockAmount

    );

    item.lastRestocked = Date.now();

    saveStock(stock);

    return item;

}
function isOutOfStock(guildId, itemId) {

    const item = getItemStock(guildId, itemId);

    if (!item) return true;

    return item.currentStock <= 0;

}

function getRemainingRestockTime(guildId, itemId) {

    const item = getItemStock(guildId, itemId);

    if (!item) return 0;

    const nextRestock =

        item.lastRestocked +

        item.restockInterval;

    return Math.max(

        0,

        nextRestock - Date.now()

    );

}

function getStockPercentage(guildId, itemId) {

    const item = getItemStock(guildId, itemId);

    if (!item) return 0;

    return Math.round(

        (item.currentStock / item.maximumStock) * 100

    );

}
module.exports = {

    loadStock,

    saveStock,

    createItemStock,

    getItemStock,

    removeStock,

    restockItem,

    isOutOfStock,

    getRemainingRestockTime,

    getStockPercentage

};