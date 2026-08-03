import { Schema } from "mongoose";

export function mongooseSerializePlugin(schema: Schema) {
  const transform = (_doc: any, ret: any) => {
    delete ret.password;
    delete ret._id;
    delete ret.__v;

    return ret;
  };

  schema.set("toJSON", {
    virtuals: true,
    transform,
  });

  schema.set("toObject", {
    virtuals: true,
    transform,
  });
}
