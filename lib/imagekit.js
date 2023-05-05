const ImageKit = require("imagekit")

var imagekit = new ImageKit({
    publicKey: "public_kyHa/R4KD43YJsbqD00VuOcZbzs=",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
    privateKey: "private_4TTdwQNDJ7uYYtjtytGZMDY0yoo=",
});

module.exports = imagekit;