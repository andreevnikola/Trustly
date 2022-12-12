const Login =  require("./login").Login;
const Register =  require("./register").Register;
const Edit =  require("./edit").Edit;
const checkLoged = require("./checkLoged").checkLoged;
const checkNameExistense = require("./checkNameExistense").checkNameExistense;
const checkMail = require("./checkMail").checkMail;
const activateMail = require("./activateMail").activateMail;

module.exports = {
    Register,
    Login,
    Edit,
    checkLoged,
    checkNameExistense,
    checkMail,
    activateMail
  };