import mongoose, { Document, Model, Schema } from "mongoose";
import { iCategory } from "./categories.model";
import { iStatus } from "./status.model";
import { iClassification } from "./classification.model";
import { iCondition } from './condition.model';

export interface iWarehouse extends Document {
  name: string;
  code: string,
  description: string;
  quantity: number;
  price: number;
  category: iCategory["_id"];
  status: iStatus["_id"];
  classification: iClassification["_id"];
  condition: iCondition["_id"];
  images: string[];
}

const warehouseSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      index:true,
      required: [true, "Please enter the product name"],
    },
    description: {
      type: String,
      required: [false, "Please enter the product description"],
    },
    quantity: {
      type: Number,
      index:true,
      required: [false, "Please enter the product quantity"],
    },
    price: {
      type: Number,
      index:true,
      required: [false, "Please enter the product price"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index:true,
      required: [false, "Please enter the product category"],
    },
    code: {
      type: String,
      unique: true,
      index:true,
      required: [true, "Please enter the product code"],
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: "Status",
      index:true,
      required: [false, "Please enter the product status"],
    },
    classification: {
      type: Schema.Types.ObjectId,
      ref: "Classification",
      index:true,
      required: [false, "Please enter the product classification"],
    },
    condition: {
      type: Schema.Types.ObjectId,
      ref: "Condition",
      index:true,
      required: [false, "Please enter the product condition"],
    },

    images: [
      {
        public_id: {
          type: String,
          required: false
        },
        url: {
          type: String,
          required: false
        }
      },
    ],
    createdBy: {
      _id: Schema.Types.ObjectId,
      name: String,
      email: String
    },
    updatedBy: {
      _id: Schema.Types.ObjectId,
      name: String,
      email: String
    },
  },
  { timestamps: true }
);
const Warehouse: Model<iWarehouse> = mongoose.model<iWarehouse>(
  "Warehouse",
  warehouseSchema
);

export default Warehouse;
