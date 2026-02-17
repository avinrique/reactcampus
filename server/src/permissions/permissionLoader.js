const Permission = require('../models/Permission.model');
const { PERMISSIONS } = require('./permissionRegistry');
const logger = require('../config/logger');

const loadPermissions = async () => {
  let created = 0;
  for (const perm of PERMISSIONS) {
    const result = await Permission.findOneAndUpdate(
      { key: perm.key },
      perm,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (result.isNew) created++;
  }
  logger.info(`Permissions synced: ${PERMISSIONS.length} total, ${created} new`);
};

module.exports = { loadPermissions };
