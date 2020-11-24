const profile = require('./model/profile.js');
const profileContent = require('./model/profileContent.js');
const profileUser = require('./model/profileUser.js');
const profileFull = require('./model/profileFull.js');

module.exports = app => {
  const models = {
    profile,
    profileContent,
    profileUser,
    profileFull,
  };
  return models;
};
