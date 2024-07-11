import mongoose, { Document, Model, Schema } from "mongoose";

export interface iCategory extends Document {
  name: string;
  description: string;
  avatar:string
}

const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      minlength: [6, "Name must be at least 6 characters long"],
      required: [true, "Please enter the name"],
    },
    description: {
      type: String,
      // required: [true, 'Please enter the category description']
    },
    avatar: {
        public_id: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: false
        }
    },
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

const Category: Model<iCategory> = mongoose.model<iCategory>(
  "Category",
  categorySchema
);

export default Category;
