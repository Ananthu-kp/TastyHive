import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        subcategories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            default: []
        }],
        price: {
            type: Number,
            required: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        isSubItem: {
            type: Boolean,
            default: false
        },
        parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" } // For subcategories
    });

export default mongoose.model("Menu", MenuSchema);