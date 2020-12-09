'use strict';
var bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    validPassword(pendingPassword) {
      bcrypt.compareSync(pendingPassword, this.password);
    } 

    //this will be used in the routes 
    toJSON() {
      var userData = this.get(); //this parses data and stores in variable
      delete userData.password; 
      return userData;
    };
  };

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (pendingUser, options) => {
        if (pendingUser && pendingUser.password) {
          const hash = bcrypt.hashSync(pendingUser.password, 10);
          pendingUser.password = hash;
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  
  return User;
};