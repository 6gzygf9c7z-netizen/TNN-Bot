const PERMISSIONS = {

    owner: ["*"],

    ceo: ["*"],

    finance: [

        "finance",

        "salary",

        "clearBills"

    ],

    chef: [

        "cook",

        "restock",

        "inventory"

    ],

    manager: [

        "manage",

        "inventory"

    ],

    staff: [

        "buy",

        "eat",

        "drink",

        "smoke"

    ]

};

const STATUS_ROLES = [

    "Tipsy",

    "Drunk",

    "Wasted",

    "Blacked Out",

    "High",

    "Crossfaded",

    "Sleeping",

    "Hospitalized"

];
function normalizeRoles(member) {

    return member.roles.cache.map(

        role => role.name.toLowerCase()

    );

}

function hasPermission(member, permission) {

    const roles = normalizeRoles(member);

    for (const role of roles) {

        const permissions = PERMISSIONS[role];

        if (!permissions) continue;

        if (

            permissions.includes("*") ||

            permissions.includes(permission)

        ) {

            return true;

        }

    }

    return false;

}
async function removeStatusRoles(member) {

    const roles = member.guild.roles.cache.filter(

        role =>

            STATUS_ROLES.includes(role.name)

    );

    for (const role of roles.values()) {

        if (

            member.roles.cache.has(role.id)

        ) {

            await member.roles.remove(role);

        }

    }

}
async function updateStatusRole(

    member,

    state

) {

    await removeStatusRoles(member);

    if (!state) {

        return;

    }

    const role =

        member.guild.roles.cache.find(

            r =>

                r.name.toLowerCase() ===

                state.toLowerCase()

        );

    if (!role) {

        return;

    }

    await member.roles.add(role);

}
function canBuy(member) {

    return hasPermission(

        member,

        "buy"

    );

}

function canCook(member) {

    return hasPermission(

        member,

        "cook"

    );

}

function canRestock(member) {

    return hasPermission(

        member,

        "restock"

    );

}

function canClearBills(member) {

    return hasPermission(

        member,

        "clearBills"

    );

}

function isExecutive(member) {

    return hasPermission(

        member,

        "*"

    );

}
module.exports = {

    hasPermission,

    updateStatusRole,

    removeStatusRoles,

    canBuy,

    canCook,

    canRestock,

    canClearBills,

    isExecutive

};