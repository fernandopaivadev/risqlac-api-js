import { Request, Response } from 'express'

import { CustomRequest } from '@types'

export default async (err: Error, req: Request | CustomRequest, res: Response) => {
  res.status(500).json({ error: err })
}
