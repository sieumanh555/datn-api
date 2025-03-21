var express = require('express');
var router = express.Router();
const productController = require('../mongo/controller/product.controller')
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const middlewareController = require('../mongo/middlewareController');


const checkfile = (req, file, cb) => {
    const filetypes = /jpeg|jpg|webp|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        // Filename with date and time
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage, fileFilter: checkfile });


/* GET home page. */


router.post('/', upload.single('image'), async (req,res) => {
  try {
    const body = req.body
    body.image = req.file
    const proNew = await productController.insert(body)
    return res.status(200).json(proNew)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.get('/', async (req,res,next) => {
  try {
    const result = await productController.getProduct()
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.put('/:id', upload.single('image'), async (req,res,next) => {
  try {
    const {id} = req.params
    const body = req.body
    if(req.file){
      body.image = req.file.originalname
    }
    else {
      delete body.image
    }
    const proUpdate = await productController.updatePro(id, body)
    return res.status(200).json({status:true, proUpdate, mess: 'Cập nhật thành công'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})

router.get('/category=:id', async (req, res, next) => {
  try {
      const categoryId = req.params.id;
      const result = await productController.getProductsByCategory(categoryId);
      return res.status(200).json(result);
  } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
  }
});


router.get('/findproduct', async (req, res) => {
  try {
      const keywordProduct = decodeURIComponent(req.query.keyword);
      
      const products = await productController.getProductByName(keywordProduct);
      return res.status(200).json(products);
  } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, mess: 'Lỗi hệ thống' });
  }
});


router.delete('/:id', async (req,res,next) => {
  try {
    const {id} = req.params
    const result = await productController.deletePro(id)
    return res.status(200).json({status:true, result, mess: 'Xóa thành công'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})
router.get('/:id/variants', async (req,res) => {
  try {
    const {id} = req.params
    const result = await productController.getProductVariants(id)
    return res.status(200).json({status:true, result, mess: 'Lấy thành công'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
});
router.get('/:key/:value', async (req,res,next) => {
  try {
    const {key, value} = req.params
    const result = await productController.getByKey(key, value)
    return res.status(200).json({status:true, result, mess: 'Xóa thành công'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
})


router.get('/:id', async (req,res,next) => {
  try {
    const {id} = req.params
    const result = await productController.getIdPro(id)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:false, mess:'Lỗi hệ thống'})
  }
});


// Lấy danh sách màu theo size
router.get("/colors/:size", async (req, res) => {
  try {
    const { size } = req.params;
    const colors = await productController.getColor(size); // Truyền tham số size
    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách size theo màu
router.get("/sizes/:color", async (req, res) => {
  try {
    const { color } = req.params;
    const sizes = await productController.getSize(color); // Truyền tham số color
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy biến thể theo màu & size
router.get("/variant/:color/:size", async (req, res) => {
  try {
    const { color, size } = req.params;
    const variant = await productController.getSizeColor(color, size); // Truyền tham số color, size
    if (!variant) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/view/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await productController.increaseView(productId);
    if (!updatedProduct) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    res.json({ message: "View đã được cập nhật", views: updatedProduct.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
