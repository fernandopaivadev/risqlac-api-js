import { Response } from 'express'
import path from 'path'

import { CustomRequest } from '@types'

export default {
  data: async (req: CustomRequest, res: Response): Promise<void> => {
    const symbol = req.query?.symbol

    if (symbol) {
      const filePath = path.join(
        __dirname,
        `../../assets/${String(symbol).split('.')[0].toUpperCase()}.png`
      )
      res.status(200).sendFile(filePath)
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  }
}
