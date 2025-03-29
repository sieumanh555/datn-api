const productModel = require("../model/products/product.model");
const productVariant = require("../model/products//productVariant.model");
const categoryModel = require("../model/category/category.model");
const { Error } = require("mongoose");

module.exports = {
  insert,
  getProduct,
  updatePro,
  deletePro,
  getByKey,
  getIdPro,
  getProductsByCategory,
  getProductByName,
  getColor,
  getSize,
  increaseView,
  getSizeColor,
  getProductVariants
};

async function insert(body) {
  try {
    const { name, price, pricePromo, hinhanh, mota, quantity, category, variants, location } = body;

    if (!name || !price || !category) {
      throw new Error("Thiếu thông tin bắt buộc: name, price hoặc category.");
    }
  
    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục.");
    }
    const randomCode = 
    Math.floor(1000 + Math.random() * 9000).toString() + // Random 4 số (1000 - 9999)
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) + // Random chữ cái A-Z
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26));
  
    const proNew = new productModel({
      sku_id: randomCode,
      name,
      price,
      pricePromo: pricePromo || price, // Nếu không có, mặc định bằng price
      mota,
      hinhanh,
      quantity: quantity || 0, // Nếu không có, mặc định là 0
      location,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
    });

    const savedProduct = await proNew.save();

    // Nếu có biến thể (variants), thêm vào DB
    if (variants && variants.length > 0) {
      const variantDocs = variants.map((v) => ({
        productId: savedProduct._id,
        size: v.size,
        color: v.color,
        price: v.price,
        stock: v.stock,
        images: v.images || [],
        status: v.status
      }));

      const insertedVariants = await productVariant.insertMany(variantDocs);

      // Cập nhật danh sách biến thể vào sản phẩm
      savedProduct.variants = insertedVariants.map((v) => v._id);
      await savedProduct.save();
    }

    return savedProduct;
  } catch (error) {
    console.log("Lỗi khi thêm sản phẩm:", error.message);
    throw error;
  }
}



async function getProduct() {
  try {
    const result1 = await productModel.find().sort({ _id: 1 }).populate("variants");
    // select name, price where price > 2000
    // const result2 = await productModel.find({
    //     price: {$gt:2000}
    // },{name:1, price:1})
    // //select * where price > 2000 and quanlity < 50
    // const result3 = await productModel.find({
    //     $and: [
    //         {price: {$gt:2000}},
    //         // {quanlity: {$gt:2000}}
    //     ]

    // },{name:1, price:1})
    // //
    // const result4 = await productModel.find({
    //     name: {
    //         $regex: 'o'+'.*',
    //         // $option: 'i'
    //         // i không phân biệt hoa thường
    //     }

    // })
    return result1;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updatePro(id, body) {
  try {
    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    const { name, price, pricePromo, mota, image, quantity, hot, view, status, category, variants } = body;
    // Cập nhật danh mục nếu có thay đổi
    let categoryUpdate = pro.category;
    if (category) {
      const categoryFind = await categoryModel.findById(category);
      if (!categoryFind) {
        throw new Error("Không tìm thấy danh mục");
      }
      categoryUpdate = {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      };
    }

    let updatedVariantIds = [...pro.variants]; // Giữ lại danh sách cũ
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const { _id, size, color, price, stock, images, status } = variant;

        if (_id) {
          // Nếu variant đã có, cập nhật
          const updatedVariant = await productVariant.findByIdAndUpdate(
            _id,
            { size, color, price, stock, images, status },
            { new: true }
          );
          if (updatedVariant) {
            const index = updatedVariantIds.findIndex(v => v.toString() === _id);
            if (index !== -1) {
              updatedVariantIds[index] = updatedVariant._id;
            } else {
              updatedVariantIds.push(updatedVariant._id);
            }
          }
        } else {
          // Nếu variant mới, tạo mới
          const newVariant = new productVariant({
            productId: id,
            size,
            color,
            price,
            stock,
            images,
            status
          });
          const savedVariant = await newVariant.save();
          updatedVariantIds.push(savedVariant._id);
        }
      }
    }

    // Cập nhật sản phẩm
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name: name || pro.name,
        price: price || pro.price,
        pricePromo: pricePromo !== undefined ? pricePromo : pro.pricePromo, // Nếu có giá KM thì cập nhật
        mota: mota || pro.mota,
        image: image || pro.image,
        hot: hot || pro.hot,
        view: view || pro.view,
        quantity: quantity !== undefined ? quantity : pro.quantity, // Nếu không có thì giữ nguyên
        status: status || pro.status,
        category: categoryUpdate,
        variants: updatedVariantIds, // Cập nhật danh sách variants mới
      },
      { new: true }
    ).populate("variants"); // Lấy thông tin chi tiết của variants

    return updatedProduct;
  } catch (error) {
    console.log("Lỗi khi cập nhật sản phẩm:", error.message);
    throw error;
  }
}
async function deletePro(id) {
  try {
    const proDel = await productModel.findByIdAndDelete(id);
    if (!proDel) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    return proDel;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getByKey(key, value) {
  try {
    const result = await productModel.findOne({ [key]: value });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getProductsByCategory(categoryId) {
  try {
    const products = await productModel.find({
      "category.categoryId": categoryId,
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by categoryId:", error);
    throw error;
  }
}
async function getProductByName(keyword) {
  try {
    const products = await productModel.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });
    if (products.length === 0) {
      return { status: false, mess: "Không tìm thấy sản phẩm." };
    }
    return products;
  } catch (error) {
    console.error("Lỗi khi tìm sản phẩm theo tên:", error);
    throw error;
  }
}

async function getIdPro(id) {
  try {
    const result = await productModel.findById(id).populate("variants");
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getProductVariants(id) {
  try {
    const result = await productVariant.findById(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


async function getColor(size) {
  try {
    const result = await ProductVariant.find({ size }).distinct("color");
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Lấy danh sách size theo màu
async function getSize(color) {
  try {
    const result = await ProductVariant.find({ color }).distinct("size");
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Lấy biến thể theo màu & size
async function getSizeColor(color, size) {
  try {
    const result = await ProductVariant.findOne({ color, size });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function increaseView(productId) {
  try {
    const product = await ProductVariant.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } },
      { new: true }
    );
    return product;
  } catch (error) {
    console.error(error);
    throw error;
  }
}