module.exports = (cb) => (e) => {
    e.preventDefault();
    cb(e);
};
