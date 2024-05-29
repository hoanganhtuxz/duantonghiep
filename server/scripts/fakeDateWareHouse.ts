import ProductModel from "../models/warehouse.model";
import { getRandomDate } from '../utils/handlers';

export const fakeDateCreateProduct = async (startDate, endDate) => {
  const products = await ProductModel.find({}).lean();

  console.log(products.length)

  for (let idx = 0; idx < products.length; idx += 1) {
    const product = products[idx];
    const { _id, __v, ...newCate } = product;
    const createdAt = getRandomDate(startDate, endDate)
    const updatedAt = getRandomDate(createdAt, endDate)
    Object.assign(newCate,
      {
        createdAt,
        updatedAt
      }
    )

    await ProductModel.deleteOne({ _id })
    await ProductModel.create([newCate], { timestamps: false })
  }

  console.log('DONE')
}