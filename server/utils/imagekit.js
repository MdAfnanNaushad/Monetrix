const ImageKit = require('imagekit');

let imagekit = null;

if (
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT
) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

const uploadToImageKit = async (fileBuffer, fileName) => {
  if (!imagekit) {
    // Fallback: If ImageKit credentials are not yet populated in .env,
    // generate a base64 data URI so uploads work out-of-the-box locally!
    return `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
  }

  const response = await imagekit.upload({
    file: fileBuffer,
    fileName: `monetrix_${Date.now()}_${fileName}`,
    folder: '/monetrix/profiles',
  });

  return response.url;
};

module.exports = { imagekit, uploadToImageKit };
