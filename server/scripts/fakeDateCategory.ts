import CategoryModel from "../models/categories.model";
import { getRandomDate } from '../utils/handlers';

export const fakeDateCreateCategory = async (startDate, endDate) => {
  const listCategory = await CategoryModel.find({}).lean();

  console.log(listCategory.length)

  for (let idx = 0; idx < listCategory.length; idx += 1) {
    const category = listCategory[idx];
    const { _id, __v, ...newCate } = category;
    const createdAt = getRandomDate(startDate, endDate)
    const updatedAt = getRandomDate(createdAt, endDate)
    Object.assign(newCate,
      {
        createdAt,
        updatedAt
      }
    )

    console.log(newCate);

    await CategoryModel.deleteOne({ _id })
    await CategoryModel.create([newCate], { timestamps: false })

    // console.log(category._id.get)
    // const a = 
    // category.createdAt = a
    // category.updatedAt = getRandomDate(category.createdAt, endDate)
    // await category.save({ timestamps: false, overwriteDiscriminatorKey: true })
    // console.log(a, category)
    // const d = await CategoryModel.findOneAndUpdate(
    //   { _id: category._id },
    //   { $set: { createdAt, updatedAt } },
    //   { new: true, timestamps: false }
    // )
    // console.log(createdAt, updatedAt, d)
    // await category.save({ timestamps: false })
  }
}