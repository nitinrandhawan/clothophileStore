import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(`Saving file for fieldname: ${file.fieldname}`);
    cb(null, './public/temp'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); 
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

export const upload = multer({ storage });
