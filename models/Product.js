const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
    name:{type: String, required:true, unique:true},
    description:{type:String},
    price:{type: Number,required:true},
    size:{type:String, enum:['Small','Medium','Large'], default:'Small'},
    isAvailable:{type: Boolean, default:true, required:true},
    category:{
        type:mongoose.Schema.ObjectId,
        ref:"Category",
        required: true,
    }

},
)

module.exports = mongoose.model("Product", productSchema)