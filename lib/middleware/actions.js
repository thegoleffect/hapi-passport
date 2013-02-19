var actions = {};

actions.success = function (user, info) {

    this.success.apply(this, arguments);
};


actions.fail = function (challenge, status) {

    this.fail.apply(this, arguments);
};


actions.redirect = function (url, status) {

    this.redirect.apply(this, arguments);
};


actions.pass = function () {

    this.pass.apply(this, arguments);
};


actions.error = function (err) {

    this.error.apply(this, arguments);
};

module.exports = actions;