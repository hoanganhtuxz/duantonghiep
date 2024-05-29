import Report from "../models/report.model";
import ProductModel from "../models/warehouse.model";
import { createReportHandler } from "../services/report.service";
import { REPORT_EXPORT_PRODUCT, REPORT_IMPORT_PRODUCT } from "../utils/constants";
import { generateRandomNumber } from "../utils/handlers";

export const fakeDataImportReport = async () => {
  await Report.deleteMany({ type: REPORT_IMPORT_PRODUCT });
  const products = await ProductModel.find({}).lean();

  console.log(products.length)

  await Promise.all(products.map(async (product) => {
    const createdAt = new Date(product.createdAt);
    const updatedAt = new Date(product.updatedAt);

    const dateRange = (updatedAt.getTime() - createdAt.getTime()) / 1000 / 60 / 60 / 24;
    for (let idx = 1; idx <= dateRange; idx += 1) {
      const date = new Date(createdAt);
      date.setTime(date.getTime() + (idx * 1000 * 60 * 60 * 24))
      await createReportHandler([{
        quantity: generateRandomNumber(2, 3),
        warehouseId: product._id
      }], {
        type: REPORT_IMPORT_PRODUCT,
        date
      })
    }
  }))

  console.log('DONE')
}

// REPORT_EXPORT_PRODUCT

export const fakeDataExportReport = async () => {
  await Report.deleteMany({ type: REPORT_EXPORT_PRODUCT });
  const products = await ProductModel.find({}).lean();

  console.log(products.length)

  await Promise.all(products.map(async (product) => {
    const createdAt = new Date(product.createdAt);
    const updatedAt = new Date(product.updatedAt);

    const dateRange = (updatedAt.getTime() - createdAt.getTime()) / 1000 / 60 / 60 / 24;
    for (let idx = 1; idx <= dateRange; idx += 1) {
      const date = new Date(createdAt);
      date.setTime(date.getTime() + (idx * 1000 * 60 * 60 * 24))
      await createReportHandler([{
        quantity: generateRandomNumber(2, 3),
        warehouseId: product._id
      }], {
        type: REPORT_EXPORT_PRODUCT,
        date
      })
    }
  }))

  console.log('DONE')
}