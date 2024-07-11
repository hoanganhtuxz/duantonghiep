import { ObjectId } from "mongoose";
import ReportModel from '../models/report.model';
import { UserDocument } from "../models/user.model";


interface ICreateReport {
  quantity: number;
  warehouseId: ObjectId | string,
}

interface IOptionCreateReport {
  type: string,
  user: UserDocument
}

export const createReportHandler = async (payload: ICreateReport[], options: IOptionCreateReport) => {
  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(1);
  const dateStr = now.toISOString().split('T')[0];
  const timestamp = now.getTime();

  const payloadGroupByWarehouseId = payload.reduce((rs, item) => {
    const isExisted = rs.findIndex((itm) => itm.warehouseId?.toString() === item.warehouseId?.toString());
    if (isExisted !== -1) {
      rs[isExisted].quantity += item.quantity;
    } else rs.push(item);

    return rs;
  }, []);

  const createdBy = {
    _id: options.user._id,
    email: options.user.email,
    name: options.user.name
  }

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
        [
          {
            $set: {
              quantity: {
                $sum: [item.quantity, '$quantity']
              },
              updatedBy: createdBy
            }
          }
        ]
      )
    } else {
      await ReportModel.create({
        date: dateStr,
        type: options.type,
        quantity: item.quantity,
        warehouseId: item.warehouseId,
        timestamp,
        createdBy,
        updatedBy: createdBy
      })
    }
  }))
}