const fs = require("fs");

const FILE = "./data/organizations.json";

function loadOrganizations() {

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

function saveOrganizations(data) {

    fs.writeFileSync(
        FILE,
        JSON.stringify(data, null, 2)
    );

}
function createOrganization(guild) {

    const organizations = loadOrganizations();

    if (organizations[guild.id]) {
        return organizations[guild.id];
    }

    organizations[guild.id] = {

        guildId: guild.id,

        initialized: false,

        organizationName: guild.name,

        organizationType: "unconfigured",

        ownerId: guild.ownerId,

        prefix: "!",

        currency: "₦",

logo: guild.iconURL({

    extension: "png",

    size: 1024

}) || null,

createdAt: Date.now(),

        modules: {

            cafeteria: false,

            finance: false,

            staff: false,

            broadcast: false,

            cinema: false,

            hospital: false,

            security: false,

            custom: false

        },

        permissions: {

            financeRole: null,

            cafeteriaRole: null,

            hospitalRole: null,

            securityRole: null,

            executiveRole: null

        }

    };

    saveOrganizations(organizations);

    return organizations[guild.id];

}

function getOrganization(guildId) {

    const organizations = loadOrganizations();

    return organizations[guildId] || null;

}

function isInitialized(guildId) {

    const organization = getOrganization(guildId);

    if (!organization) return false;

    return organization.initialized;

}
function initializeOrganization(guildId, data = {}) {

    const organizations = loadOrganizations();

    if (!organizations[guildId]) return null;

    organizations[guildId].initialized = true;

    organizations[guildId].organizationName =
        data.organizationName ||
        organizations[guildId].organizationName;

    organizations[guildId].organizationType =
        data.organizationType ||
        organizations[guildId].organizationType;

    organizations[guildId].prefix =
        data.prefix ||
        organizations[guildId].prefix;

    organizations[guildId].currency =
        data.currency ||
        organizations[guildId].currency;

    saveOrganizations(organizations);

    return organizations[guildId];

}

function enableModule(guildId, moduleName) {

    const organizations = loadOrganizations();

    if (!organizations[guildId]) return false;

    organizations[guildId].modules[moduleName] = true;

    saveOrganizations(organizations);

    return true;

}

function disableModule(guildId, moduleName) {

    const organizations = loadOrganizations();

    if (!organizations[guildId]) return false;

    organizations[guildId].modules[moduleName] = false;

    saveOrganizations(organizations);

    return true;

}

function setPermissionRole(guildId, permission, roleId) {

    const organizations = loadOrganizations();

    if (!organizations[guildId]) return false;

    organizations[guildId].permissions[permission] = roleId;

    saveOrganizations(organizations);

    return true;

}

function setPrefix(guildId, prefix) {

    const organizations = loadOrganizations();

    if (!organizations[guildId]) return false;

    organizations[guildId].prefix = prefix;

    saveOrganizations(organizations);

    return true;

}

function setCurrency(guildId, currency) {

    const organizations = loadOrganizations();

    if (!organizations[guildId]) return false;

    organizations[guildId].currency = currency;

    saveOrganizations(organizations);

    return true;

}
module.exports = {

    loadOrganizations,

    saveOrganizations,

    createOrganization,

    getOrganization,

    isInitialized,

    initializeOrganization,

    enableModule,

    disableModule,

    setPermissionRole,

    setPrefix,

    setCurrency

};