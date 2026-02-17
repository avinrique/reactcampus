const config = require('../config');
const connectDB = require('../config/db');
const logger = require('../config/logger');
const seedPermissions = require('./permissions.seed');
const seedRoles = require('./roles.seed');
const seedAdmin = require('./admin.seed');
const seedColleges = require('./colleges.seed');
const seedContentSections = require('./contentSections.seed');
const seedPages = require('./pages.seed');

const run = async () => {
  await connectDB();
  await seedPermissions();
  await seedRoles();
  await seedAdmin();
  await seedColleges();
  await seedContentSections();
  await seedPages();
  logger.info('All seeds completed');
  process.exit(0);
};

run().catch((err) => {
  logger.error('Seed failed', err);
  process.exit(1);
});
