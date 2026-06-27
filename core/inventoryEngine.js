const fs = require("fs");

const FILE = "./data/inventories.json";

function loadInventories() {

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

function saveInventories(data) {

    fs.writeFileSync(
        FILE,
        JSON.stringify(data, null, 2)
    );

}
function createInventory(guildId, userId) {

    const inventories = loadInventories();

    if (!inventories[guildId]) {

        inventories[guildId] = {};

    }

    if (!inventories[guildId][userId]) {

        inventories[guildId][userId] = {};

    }

    saveInventories(inventories);

    return inventories[guildId][userId];

}

function getInventory(guildId, userId) {

    const inventories = loadInventories();

    if (
        !inventories[guildId] ||
        !inventories[guildId][userId]
    ) {

        return null;

    }

    return inventories[guildId][userId];

}
function addItem(guildId, userId, itemId, quantity = 1) {

    const inventories = loadInventories();

    if (!inventories[guildId]) {

        inventories[guildId] = {};

    }

    if (!inventories[guildId][userId]) {

        inventories[guildId][userId] = {};

    }

    if (!inventories[guildId][userId][itemId]) {

        inventories[guildId][userId][itemId] = {

            quantity: 0,

            lastPurchased: Date.now()

        };

    }

    inventories[guildId][userId][itemId].quantity += quantity;

    inventories[guildId][userId][itemId].lastPurchased = Date.now();

    saveInventories(inventories);

    return inventories[guildId][userId][itemId];

}

function removeItem(guildId, userId, itemId, quantity = 1) {

    const inventories = loadInventories();

    if (
        !inventories[guildId] ||
        !inventories[guildId][userId] ||
        !inventories[guildId][userId][itemId]
    ) {

        return false;

    }

    inventories[guildId][userId][itemId].quantity -= quantity;

    if (inventories[guildId][userId][itemId].quantity <= 0) {

        delete inventories[guildId][userId][itemId];

    }

    saveInventories(inventories);

    return true;

}
function hasItem(guildId, userId, itemId, quantity = 1) {

    const inventory = getInventory(guildId, userId);

    if (!inventory) return false;

    if (!inventory[itemId]) return false;

    return inventory[itemId].quantity >= quantity;

}

function getQuantity(guildId, userId, itemId) {

    const inventory = getInventory(guildId, userId);

    if (!inventory) return 0;

    if (!inventory[itemId]) return 0;

    return inventory[itemId].quantity;

}

function countItems(guildId, userId) {

    const inventory = getInventory(guildId, userId);

    if (!inventory) return 0;

    let total = 0;

    for (const item of Object.values(inventory)) {

        total += item.quantity;

    }

    return total;

}
module.exports = {

    loadInventories,

    saveInventories,

    createInventory,

    getInventory,

    addItem,

    removeItem,

    hasItem,

    getQuantity,

    countItems

};