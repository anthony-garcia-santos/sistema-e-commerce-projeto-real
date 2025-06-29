const cloudinary = require('../utils/cloudinary');   
const fs         = require('fs');

const UploadController = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'produtos',
    });

    fs.unlinkSync(req.file.path);               
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload' });
  }
};

module.exports = { UploadController };
