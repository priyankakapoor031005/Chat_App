// DELETE IMAGE FUNCTION
const path = require("path");
const fs = require("fs")
const unlinkImage = (images) => {
    const uploadImage = path.join(__dirname, "..", "..", "public", "productsimg");

    for (const [key, imagename] of Object.entries(images)) {
        if (!imagename) continue;

        const imagePath = path.join(uploadImage, imagename);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
};

module.exports = { unlinkImage };