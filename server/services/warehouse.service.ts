import { Response, NextFunction, Request } from "express";
import { CatchAsyncError } from "../middieware/catchAsyncError";
import ProductModel from "../models/warehouse.model";
import { createReportHandler } from "./report.service";
import { REPORT_IMPORT_PRODUCT } from "../utils/constants";
import { Schema } from "mongoose";

/// create product

export const createProduct = CatchAsyncError(
  async (data: any, res: Response) => {
    const product = await ProductModel.create(data);
    const dataCreateRp = {
      quantity: product.quantity,
      warehouseId: product._id as Schema.Types.ObjectId
    }
    createReportHandler([dataCreateRp], { type: REPORT_IMPORT_PRODUCT, user: data.createdBy })
    res.status(201).json({
      success: true,
      product,
    });
  }
);
