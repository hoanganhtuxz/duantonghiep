import cloudinary from "cloudinary";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middieware/catchAsyncError";
import ProductModel from "../models/warehouse.model";
import { createProduct } from "../services/warehouse.service";
import { createReportHandler } from "../services/report.service";
import { REPORT_EXPORT_PRODUCT, REPORT_IMPORT_PRODUCT } from "../utils/constants";

///  interface  Product


export const uploadProduct = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as any;
      const name = data.name;
      const code = data.code;
      const categoryId = req.body.category;
      const avatar = data.avatar;
      const isNameAlreadyExist = await ProductModel.findOne({ name });

      if (isNameAlreadyExist) {
        return next(new ErrorHandler("Name Product already exists", 400));
      }

      if (!name) {
        return next(new ErrorHandler("Please enter name Product", 400));
      }
      if (!code) {
        return next(new ErrorHandler("Please enter code product", 400));
      }
      // if (!categoryId) {
      //   return next(new ErrorHandler("Plase chonse category product", 400));
      // }
      if (avatar) {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "product",
        });

        data.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      createProduct(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// eidt Product

export const editProduct = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const name = data.name;
      const categoryId = req.body.category;
      const avatar = data.avatar;
      const ProductId = req.params.id;
      const code = req.body.code;

      const updateData: { [key: string]: any } = {};

      if (avatar) {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: 'product',
        });
        updateData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (code) {
        const isCodeExist = await ProductModel.findOne({ code });
        if (isCodeExist) {
          return next(new ErrorHandler('Code already exists', 400));
        } else {
          updateData.code = code;
        }
      }

      if (name) {
        const isNameExist = await ProductModel.findOne({ name });
        if (isNameExist) {
          return next(new ErrorHandler('Name Product already exists', 400));
        } else {
          updateData.name = name;
        }
      }

      if (categoryId) {
        updateData.category = categoryId;
      } else {
        return next(new ErrorHandler('Please choose category product', 400));
      }

      const product = await ProductModel.findByIdAndUpdate(
        ProductId,
        { $set: updateData },
        { new: true }
      );

      res.status(201).json({ success: true, product });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all Product

interface QueryParams {
  keyword?: string;
  limit?: string;
  page?: string;
  code?:string,
  sort?: "asc" | "desc";
  date?: any;
  month?: any;
  year?: any;
  price?: "asc" | "desc";
  quantity?: "asc" | "desc";
  orderBy?: "asc" | "desc";
  sorter?: string;
}

export const getAllProduct = CatchAsyncError(
  async (
    req: Request<any, any, any, QueryParams>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      keyword,
      code,
      sort = 'desc',
      page = '1',
      date,
      month,
      year,
      price,
      quantity,
    } = req.query;
    let limit: any = req.query.limit;
    let query = ProductModel.find();

    // Keyword
    if (keyword) {
      query = query.find({ name: { $regex: keyword, $options: 'i' } });
    }

    // Code
    if (code) {
      query = query.find({ code: { $regex: code, $options: 'i' } });
    }

    // Tìm kiếm theo mốc thời gian chỉ định
    if (date || month || year) {
      const createdAtQuery: any = {};
      if (date) {
        createdAtQuery.$gte = new Date(date as string);
        createdAtQuery.$lt = new Date(
          new Date(createdAtQuery.$gte).getTime() + 24 * 60 * 60 * 1000
        );
      }
      if (month) {
        const monthNumber = parseInt(month as string, 10) - 1;
        const year = new Date().getFullYear();
        createdAtQuery.$gte = new Date(year, monthNumber, 1);
        createdAtQuery.$lt = new Date(year, monthNumber + 1, 1);
      }
      if (year) {
        createdAtQuery.$gte = new Date(parseInt(year as string, 10), 0, 1);
        createdAtQuery.$lt = new Date(
          parseInt(year as string, 10) + 1,
          0,
          1
        );
      }
      query = query.find({ createdAt: createdAtQuery });
    }

    // Sort
    let sortCriteria = '-createdAt';
    if (sort === 'asc') {
      sortCriteria = 'createdAt';
    } else if (price === 'asc') {
      sortCriteria = 'price';
    } else if (price === 'desc') {
      sortCriteria = '-price';
    } else if (quantity === 'asc') {
      sortCriteria = 'quantity';
    } else if (quantity === 'desc') {
      sortCriteria = '-quantity';
    }
    query = query.sort(sortCriteria);

    if (limit) {
      limit = parseInt(limit, 10);
      if (!isNaN(limit) && limit > 0) {
        const pageAsNumber = parseInt(page, 10) || 1;
        const skip = (pageAsNumber - 1) * limit;
        const totalData = await ProductModel.countDocuments(query.getFilter());
        query = query.skip(skip).limit(limit);
        const products = await query;
        return res.status(200).json({
          success: true,
          count: products.length,
          totalPages: Math.ceil(totalData / limit),
          currentPage: pageAsNumber,
          products,
        });
      }
    }

    // Nếu không có limit, trả về tất cả dữ liệu
    const product = await query;
    const productSchema = ProductModel.schema.paths;
    const hasCodeField = productSchema.hasOwnProperty('code');

    if (!hasCodeField) {
      const productsWithDefaultCode = product.map((p) => ({
        ...p.toObject(),
        code: '',
      }));
      res.status(200).json({
        success: true,
        count: productsWithDefaultCode.length,
        product: productsWithDefaultCode,
      });
    } else {
      res.status(200).json({ success: true, count: product.length, product });
    }
  }
);

const getSortString = (sorter: string, orderBy = 'desc') => {
  let result = `-${sorter}`;
  if (orderBy === 'asc') result = sorter;
  return result;
}

export const getStatisticProduct = CatchAsyncError(async (
  req: Request<any, any, any, QueryParams>,
  res: Response,
) => {
  const {
    keyword,
    orderBy = 'desc',
    sorter = 'createdAt',
    page = 1,
    limit = 10,
    date,
    month,
    year,
  } = req.query;

  const condition = {}

  if (keyword) {
    Object.assign(condition, {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { code: { $regex: keyword, $options: 'i' } }
      ]
    })
  }

  // Tìm kiếm theo mốc thời gian chỉ định
  if (date || month || year) {
    const createdAtQuery: any = {};
    if (date) {
      createdAtQuery.$gte = new Date(date as string);
      createdAtQuery.$lt = new Date(
        new Date(createdAtQuery.$gte).getTime() + 24 * 60 * 60 * 1000
      );
    }
    if (month) {
      const monthNumber = parseInt(month as string, 10) - 1;
      const year = new Date().getFullYear();
      createdAtQuery.$gte = new Date(year, monthNumber, 1);
      createdAtQuery.$lt = new Date(year, monthNumber + 1, 1);
    }
    if (year) {
      createdAtQuery.$gte = new Date(parseInt(year as string, 10), 0, 1);
      createdAtQuery.$lt = new Date(
        parseInt(year as string, 10) + 1,
        0,
        1
      );
    }

    Object.assign(condition, { createdAt: createdAtQuery })
  }

  // Nếu không có limit, trả về tất cả dữ liệu
  const [product, count] = await Promise.all(['data', 'count'].map(async (key) => {
    if (key === 'data') {
      const newLimit = Number(limit) || 10;
      const skip = newLimit * ((Number(page) || 1) - 1)
      const productResult = await ProductModel.find(condition)
        .sort(getSortString(sorter, orderBy))
        .limit(newLimit)
        .skip(skip)
        .populate({
          path: 'classification',
          select: 'name description'
        })
        .populate({
          path: 'condition',
          select: 'name description'
        })
        .populate({
          path: 'category',
          select: 'name description avatar'
        })
        .populate({
          path: 'status',
          select: 'name description'
        })
        .lean();
      return productResult;
    } else if (key === 'count') {
      return await ProductModel.countDocuments(condition);
    }
  }))

  return res.status(200).json({
    success: true,
    count,
    product,
  });
})

// get one Product by ID
export const getProductById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ProductId = req.params.id;
      const Product = await ProductModel.findById(ProductId);

      if (!Product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      res.status(200).json({
        success: true,
        Product,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete byid

export const deleteProductById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ProductId = req.params.id;
      const Product = await ProductModel.findByIdAndDelete(ProductId);

      if (!Product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Product has been deleted",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

const validateImportProduct = (payload: any[]) => {
  let result = '';
  for (let idx = 0; idx < payload.length; idx += 1) {
    const item = payload[idx]
    if (!item || typeof item !== 'object' || !Object.keys(item).length) {
      result = `Invalid payload (${idx}).`;
      break;
    }

    if (!item.code) {
      result = `Invalid product code (${idx}).`;
      break;
    }

    if (!Number(item.quantity) || !Number.isInteger(item.quantity) || Number(item.quantity) <= 0) {
      result = `Invalid quantity of product ${item.code} (${idx}).`
      break;
    }

    if (!Number(item.price)) {
      result = `Invalid price of product ${item.code} (${idx}).`
      break;
    }
  }

  return result;
}

export const importProductController = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const payload: any[] = req.body;

  if (!payload.length) {
    return next(new ErrorHandler('Invalid payload.', 400))
  }

  const hasErrorMsg = validateImportProduct(payload);

  if (hasErrorMsg) {
    return next(new ErrorHandler(hasErrorMsg, 400))
  }

  const countByCode = await ProductModel.countDocuments({ code: { $in: payload.map((i) => i.code) }})
  if (countByCode !== payload.length) {
    return next(new ErrorHandler('Some product could not found. Please check again.', 400))
  }

  const payloadCreateImportReport = [];

  await Promise.all(payload.map(async (item: any) => {
    const productUpdated = await ProductModel.findOneAndUpdate(
      { code: item.code },
      [{
        $set: {
          price: Number(item.price),
          quantity: {
            $sum: ['$quantity', Number(item.quantity)]
          }
        }
      }],
      { new: true }
    );

    // const productFound = await ProductModel.findOne({ code: item.code });

    payloadCreateImportReport.push({
      warehouseId: productUpdated._id,
      quantity: Number(item.quantity),
    });
  }));

  // không cần await vì cho nó chạy ngầm để giảm thời gian response
  createReportHandler(payloadCreateImportReport, { type: REPORT_IMPORT_PRODUCT })
  return res.status(200).json({
    success: true,
    message: 'Import product successfully.'
  })
});

const validateExportProduct = (payload: any[]) => {
  let result = '';
  for (let idx = 0; idx < payload.length; idx += 1) {
    const item = payload[idx]
    if (!item || typeof item !== 'object' || !Object.keys(item).length) {
      result = `Invalid payload (${idx}).`;
      break;
    }

    if (!item.code) {
      result = `Invalid product code (${idx}).`;
      break;
    }

    if (!Number(item.quantity) || !Number.isInteger(item.quantity) || Number(item.quantity) <= 0) {
      result = `Invalid quantity of product ${item.code} (${idx}).`
      break;
    }
  }

  return result;
}

export const exportProductController = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const payload: any[] = req.body;

  if (!payload.length) {
    return next(new ErrorHandler('Invalid payload.', 400))
  }

  const hasErrorMsg = validateExportProduct(payload);

  if (hasErrorMsg) {
    return next(new ErrorHandler(hasErrorMsg, 400))
  }

  const countByCode = await ProductModel.countDocuments({ code: { $in: payload.map((i) => i.code) }})
  if (countByCode !== payload.length) {
    return next(new ErrorHandler('Some product could not found. Please check again.', 400))
  }

  const payloadCreateExportReport = [];
  const productsNotUpdate = [];

  await Promise.all(payload.map(async (item: any) => {
    const productUpdated = await ProductModel.findOneAndUpdate(
      { code: item.code, quantity: { $gte: Number(item.quantity) } },
      [{
        $set: {
          quantity: {
            $subtract: ['$quantity', Number(item.quantity)]
          }
        }
      }],
      { new: true }
    );

    if (!productUpdated) {
      productsNotUpdate.push(item.code);
      return;
    }

    payloadCreateExportReport.push({
      warehouseId: productUpdated._id,
      quantity: Number(item.quantity),
    });
  }));

  if (payloadCreateExportReport.length) {
    // không cần await vì cho nó chạy ngầm để giảm thời gian response
    createReportHandler(payloadCreateExportReport, { type: REPORT_EXPORT_PRODUCT })
  } else {
    return next(new ErrorHandler('No product has been exported.', 400))
  }

  if (productsNotUpdate.length) {
    return res.status(200).json({
      success: true,
      message: `Export product successfully. But there are a few products that cannot be exported, please check the following product codes: ${productsNotUpdate.join(', ')}.`,
      data: productsNotUpdate
    })
  }

  return res.status(200).json({
    success: true,
    message: 'Export product successfully.'
  })
})
