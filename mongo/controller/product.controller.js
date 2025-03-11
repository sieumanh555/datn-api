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
};

async function insert(body) {
  try {
    const { name, price, mota, hinhanh, image, category, variants } = body;

    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục");
    }
    const proNew = new productModel({
      name,
      price,
      mota,
      image,
      hinhanh,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
    });
    const savedProduct = await proNew.save();
    // Nếu có biến thể, tạo danh sách Variant
    if (variants && variants.length > 0) {
      const variantDocs = variants.map((v) => ({
        productId: savedProduct._id,
        size: v.size,
        color: v.color,
        price: v.price,
        stock: v.stock,
        images: v.images,
      }));

      // Thêm biến thể vào DB
      const insertedVariants = await productVariant.insertMany(variantDocs);

      // Cập nhật danh sách ID của Variant vào Product
      savedProduct.variants = insertedVariants.map((v) => v._id);
      await savedProduct.save();
    }
    return savedProduct;
  } catch (error) {
    console.log(error);
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

      const { name, price, mota, image, category, hinhanh, variants } = body;
      
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

      // Cập nhật từng variant nếu có
      let updatedVariantIds = [];
      if (variants && variants.length > 0) {
          for (const variant of variants) {
              const { _id, size, color, price, stock, images } = variant;

              if (_id) {
                  // Cập nhật nếu variant đã tồn tại
                  const updatedVariant = await productVariant.findByIdAndUpdate(
                      _id, 
                      { size, color, price, stock, images }, 
                      { new: true }
                  );
                  if (updatedVariant) {
                      updatedVariantIds.push(updatedVariant._id);
                  }
              } else {
                  // Tạo mới nếu variant chưa có
                  const newVariant = new productVariant({
                      productId: id, 
                      size, 
                      color, 
                      price, 
                      stock, 
                      images
                  });
                  const savedVariant = await newVariant.save();
                  updatedVariantIds.push(savedVariant._id);
              }
          }
      } else {
          // Nếu không có variants mới, giữ nguyên danh sách cũ
          updatedVariantIds = pro.variants;
      }

      // Cập nhật product
      const updatedProduct = await productModel.findByIdAndUpdate(
          id,
          { 
              name, 
              price, 
              mota, 
              image, 
              hinhanh, 
              category: categoryUpdate, 
              variants: updatedVariantIds // Gán danh sách variant vào product
          },
          { new: true }
      ).populate("variants"); // Lấy thông tin chi tiết của variants

      return updatedProduct;
  } catch (error) {
      console.log(error);
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
    const result = await productModel.findById(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
