'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
        username: 'themightylemon',
        password: '$321!pass!123$',
        bio: "i am cute and smart",
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },
down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};