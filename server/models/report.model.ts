import mongoose, { Document, Model, Schema } from "mongoose";
import { iWarehouse } from './warehouse.model';
import { REPORT_TYPES } from "../utils/constants";

export interface iReport extends Document {
  date: string;
  quantity: number;
  timestamp: number;
  warehouseId: iWarehouse['_id'],
  type: string;
  isDeleted: boolean;
}

const reportSchema: Schema = new Schema(
  {
    date: {
      type: String,
      index: true
    }, // cái này để hiển thị và group dữ liệu
    quantity: Number,
    timestamp: {
      type: Number,
      index: true,
    }, // cái này để hiển thị và group dữ liệu, hỗ trợ filter
    warehouseId: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      index: true
    },
    type: {
      type: String,
      enum: REPORT_TYPES,
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Report: Model<iReport> = mongoose.model<iReport>(
  "report",
  reportSchema
);

export default Report;
