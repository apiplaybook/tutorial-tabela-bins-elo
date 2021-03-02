import { Schema, Document } from 'mongoose'

export interface IBin extends Document {
  numberBin: string,
  issuer: { name: string },
  product: { name: string },
  allowedCaptures: [
    { name: string, code: number },
  ],
  usages: [
    { name: string, code: number },
  ],
  services: [
    { name: string, isExchangeableOffer: boolean }
  ]
}

export const BinShema: Schema = new Schema({
  numberBin: { type: String, required: true },
  issuer: {
    name: { type: String, required: true }
  },
  product: {
    name: { type: String, required: true }
  },
  allowedCaptures: [
    {
      name: { type: String },
      code:  { type: Number }
    },
  ],
  usages: [
    {
      name: { type: String },
      code:  { type: Number }
    },
  ],
  services: [
    {
      name: { type: String },
      isExchangeableOffer: { type: Boolean }
    }
  ]
})