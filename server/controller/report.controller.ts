import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middieware/catchAsyncError';
import { REPORT_TYPES } from '../utils/constants';
import ErrorHandler from '../utils/ErrorHandler';
import { getTimestampNumber, handlePaginate } from '../utils/handlers';
import ReportModel from '../models/report.model';

/**
 * xử lý lấy thông tin group cho aggregate lấy dữ liệu
 * @param groupBy any ==> string
 * @returns Object
 */
const getGroupBy = (groupBy: any): any => {
  // mặc định là date
  const result = {
    _id: '$date',
    totalQuantity: {
      $sum: '$quantity',
    },
  };

  switch (groupBy) {
    case 'warehouseId':
      result._id = '$warehouseId';
      break;

    default:
      break;
  }

  return result;
};

export const getReportController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      startDate,
      endDate,
      pageIndex = 1,
      totalItem = 10,
      type = '',
      groupBy,
    } = req.query;

    if (typeof type !== 'string' || !REPORT_TYPES.includes(type)) {
      return next(new ErrorHandler('Invalid type.', 400));
    }

    const conditionFilter = { isDeleted: false, type };

    // mặc định sẽ lấy 7 ngày gần nhất
    if (
      typeof startDate !== 'string' ||
      typeof endDate !== 'string' ||
      new Date(startDate).toString() === 'Invalid Date' ||
      new Date(endDate).toString() === 'Invalid Date'
    ) {
      const now = new Date();
      now.setDate(now.getDate() - 7);
      Object.assign(conditionFilter, {
        timestamp: {
          $gte: getTimestampNumber(now),
          $lte: getTimestampNumber(),
        },
      });
    } else {
      Object.assign(conditionFilter, {
        timestamp: {
          $gte: getTimestampNumber(startDate),
          $lte: getTimestampNumber(endDate),
        },
      });
    }

    const resultData = await ReportModel.aggregate([
      { $match: conditionFilter },
      {
        $group: getGroupBy(groupBy),
      },
    ]);

    return res.status(200).json({
      success: true,
      total: resultData.length,
      data: handlePaginate(
        resultData,
        Number(totalItem) || 10,
        Number(pageIndex) || 1,
      ),
    });
  },
);
