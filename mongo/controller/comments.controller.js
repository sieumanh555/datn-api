const commentsModel = require("../model/comment/comments.model");
const productModel = require("../model/products/product.model");
const userModel = require("../model/user/user.model");
const { Error } = require("mongoose");

module.exports = {
  deleteComment,
  getAllComments,
  getCommentById,
  insertComment,
  updateComment,
};

async function deleteComment(id) {
  try {
    const commentDel = await commentsModel.findByIdAndDelete(id);
    if (!commentDel) {
      throw new Error("Không tìm thấy bình luận");
    }
    return commentDel;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateComment(id, body) {
    try {
        const comment = await commentsModel.findById(id);
        if (!comment) {
            throw new Error("Không tìm thấy bình luận");
        }
        const {content, like, dislike } = body;
        const result = await commentsModel.findByIdAndUpdate(
            id,
            {
                content: content || comment.content,
                like: like || comment.like,
                dislike: dislike || comment.dislike,
            },
            { new: true }
        );
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    } 
}

async function insertComment(body) {
    try {
        const { user, product, content, like, dislike } = body;
        if (!product) {
            throw new Error("Thiếu thông tin sản phẩm");
        }
        if (!user) {
            throw new Error("Thiếu thông tin người dùng");
        }
        const productFind = await productModel.findById(product);
        const userFind = await userModel.findById(user);
        if (!productFind) {
            throw new Error("Không tìm thấy sản phẩm");
        }
        if (!userFind) {
            throw new Error("Không tìm thấy người dùng");
        }

        const randomCode = Array.from({ length: 5 }, () => 
          String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Random từ 'A' - 'Z'
        ).join('') + 
        Array.from({ length: 3 }, () => 
            Math.floor(Math.random() * 10) // Random số từ 0 - 9
        ).join('');

        const commentNew = new commentsModel({
            sky_id: randomCode,
            user: {
                userID: userFind._id,
                name: userFind.name,
            },
            product: {
                productID: productFind._id,
                productName: productFind.name,
            },
            content,
            like,
            dislike,
        });

        const result = await commentNew.save();
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getAllComments() {
  try {
    const result = await commentsModel.find().limit(10);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getCommentById(id) {
  try {
    const result = await commentsModel.findById(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
