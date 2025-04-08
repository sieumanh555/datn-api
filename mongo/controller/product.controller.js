const productModel = require("../model/products/product.model");
const productVariant = require("../model/products//productVariant.model");
const categoryModel = require("../model/category/category.model");
const { Error } = require("mongoose");
const productVariantModel = require("../model/products//productVariant.model");

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
  insertVariants,
  updateVariant,
  deleteVariant,
  getProductVariants
};

async function insert(body) {
  try {
    const { name, price, pricePromo, hinhanh, mota, quantity, category, status, location } = body;

    if (!name || !price || !category) {
      throw new Error("Thiếu thông tin bắt buộc: name, price hoặc category.");
    }

    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục.");
    }

    const randomCode =
      Math.floor(1000 + Math.random() * 9000).toString() + // 4 số
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) + // 4 chữ cái A-Z
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26));

    const proNew = new productModel({
      sku_id: randomCode,
      name,
      price,
      pricePromo: pricePromo || price,
      mota,
      hinhanh,
      quantity: quantity || 0,
      location,
      status,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
    });

    const savedProduct = await proNew.save();
    return savedProduct;
  } catch (error) {
    console.log("Lỗi khi thêm sản phẩm:", error.message);
    throw error;
  }
}


async function insertVariants(id, body) {
  try {
    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const { variants } = body;
    if (variants && variants.length > 0) {
      const variantDocs = variants.map((v) => ({
        productId: id,
        size: v.size,
        color: v.color,
        price: v.price,
        stock: v.stock,
        images: v.images || [],
        status: v.status,
      }));

      const insertedVariants = await productVariant.insertMany(variantDocs);

      // Cộng dồn danh sách biến thể vào sản phẩm
      pro.variants = [...(pro.variants || []), ...insertedVariants.map((v) => v._id)];
      const savedProduct = await pro.save();
      return savedProduct;
    }
    return pro;
  } catch (error) {
    console.log("Lỗi khi thêm biến thể:", error.message);
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
    const { name, price, pricePromo, mota, hinhanh, quantity, hot, view, status, category, variants } = body;

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

    // Cập nhật thông tin sản phẩm chính
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name: name || pro.name,
        price: price || pro.price,
        pricePromo: pricePromo !== undefined ? pricePromo : pro.pricePromo,
        mota: mota || pro.mota,
        hinhanh: hinhanh || pro.hinhanh,
        hot: hot || pro.hot,
        view: view || pro.view,
        quantity: quantity !== undefined ? quantity : pro.quantity,
        status: status || pro.status,
        category: categoryUpdate,
      },
      { new: true }
    );

    // Cập nhật variants
    if (variants && variants.length > 0) {
      updatedProduct.variants = await updateVariants(id, variants, pro.variants);
      await updatedProduct.save(); // save the product to update the variant list.
    }

    return await productModel.findById(id).populate("variants"); // Lấy thông tin chi tiết của variants sau khi cập nhật
  } catch (error) {
    console.log("Lỗi khi cập nhật sản phẩm:", error.message);
    throw error;
  }
}
async function updateVariant(id, body) {
  try {
    // Tìm variant theo id
    const variant = await productVariant.findById(id);
    if (!variant) {
      throw new Error("Không tìm thấy Variant");
    }

    // Cập nhật dữ liệu variant
    const { size, color, price, stock, images, status } = body;
    const updatedVariant = await productVariant.findByIdAndUpdate(
      id,
      { size, color, price, stock, images, status },
      { new: true }
    );

    return updatedVariant;
  } catch (error) {
    console.log("Lỗi khi cập nhật variant:", error.message);
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
async function deleteVariant(id) {
  try {
    const proDel = await productVariantModel.findByIdAndDelete(id);
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