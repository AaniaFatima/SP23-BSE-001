const mongoose = require("mongoose");

// Define the Order Schema
const orderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product", // Reference to the Product model
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        shippingAddress: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["cash"], // Add more payment methods if necessary
            default: "cash",
        },
        orderTotal: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Order", orderSchema);
