import { model } from 'mongoose'

import { BinShema, IBin } from '../models/Bin'

export default model<IBin>('Bin', BinShema);