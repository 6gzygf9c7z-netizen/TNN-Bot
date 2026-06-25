const fs = require("fs");

module.exports = {
    name: "wallet",

    execute(message) {

        const debts = JSON.parse(
            fs.readFileSync("./data/debts.json", "utf8")
        );

        const inventory = JSON.parse(
            fs.readFileSync("./data/inventory.json", "utf8")
        );

        const userId = message.author.id;

        const debt = debts[userId]?.debt || 0;

        const items =
            inventory[userId]
                ? inventory[userId].length
                : 0;

        message.reply(
`💼 TNN STAFF FINANCIAL RECORD

👤 Staff: ${message.author.username}

💳 Outstanding Debt: ₦${debt.toLocaleString()}

📦 Inventory Items: ${items}

📅 Next Salary Deduction:
₦${debt.toLocaleString()}

⚠ Finance Department has been notified.`
        );
    }
};