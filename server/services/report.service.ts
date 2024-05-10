import { ObjectId } from "mongoose";
import ReportModel from '../models/report.model';


interface ICreateReport {
  quantity: number;
  warehouseId: ObjectId | string
}

interface IOptionCreateReport {
  type: string
}

export const createReportHandler = async (payload: ICreateReport[], options: IOptionCreateReport) => {
  const now = new Date();
  now.setHours(10);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  const dateStr = now.toString().split('T')[0];
  const timestamp = now.getTime();

  const payloadGroupByWarehouseId = payload.reduce((rs, item) => {
    const isExisted = rs.findIndex((itm) => itm.warehouseId?.toString() === item.warehouseId?.toString());
    if (isExisted) {
      rs[isExisted].quantity += item.quantity;
    } else rs.push(item);
    
    return rs;
  }, []);

  await Promise.all(payloadGroupByWarehouseId.map(async (item: ICreateReport): Promise<void> => {
    const hasExisted = await ReportModel.findOne({
      isDeleted: false,
      date: dateStr,
      warehouseId: item.warehouseId,
      type: options.type
    }).select('_id').lean();

    if (hasExisted) {
      await ReportModel.updateOne(
        { _id: hasExisted._id },
        {
          $set: {
            quantity: {
              $sum: [item.quantity, '$quantity']
            }
          }
        }
      )
    } else {
      await ReportModel.create({
        date: dateStr,
        type: options.type,
        quantity: item.quantity,
        warehouseId: item.warehouseId,
        timestamp
      })
    }
  }))
}