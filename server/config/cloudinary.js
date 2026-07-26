import cloudinaryPkg from 'cloudinary';
const cloudinary = cloudinaryPkg.v2;

// Lazily configure Cloudinary on first import so env vars can be injected
// by the Cloudflare Worker runtime before this module loads
const configure = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

configure();

export default cloudinary;
export { configure };
