const categoryModel = require("../model/category/category.model");
const newsModel = require("../model/news/news.model");
const { Error } = require("mongoose");

module.exports = {
  deleteNews,
  getAllNews,
  getNewsById,
  insertNews,
  updateNews,
};

async function deleteNews(id) {
  try {
    const newsDel = await newsModel.findByIdAndDelete(id);
    if (!newsDel) {
      throw new Error("Không tìm thấy tin tức");
    }
    return newsDel;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateNews(id, body) {
  try {
    const news = await newsModel.findById(id);
    if (!news) {
      throw new Error("Không tìm thấy tin tức");
    }
    const { title, content, image, imageChild } = body;

    const result = await newsModel.findByIdAndUpdate(
      id,
      { title, content, image, imageChild },
      { new: true }
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function insertNews(body) {
  try {
    const { title, content, image, imageChild, category } = body;

    // Kiểm tra nếu category có tồn tại trong body không
    if (!category) {
      throw new Error("Thiếu thông tin danh mục");
    }

    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục");
    }
    const randomCode =
      Array.from(
        { length: 6 },
        () => String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("") + Math.floor(Math.random() * 10); 

    const newsNew = new newsModel({
      sku_id: randomCode,
      title,
      content,
      image,
      imageChild,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
    });

    // Lưu dữ liệu vào database
    const savedNews = await newsNew.save();
    return savedNews;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getAllNews() {
  try {
    const result = await newsModel.find().limit(10);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getNewsById(id) {
  try {
    const result = await newsModel.findById(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
