import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../../models';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();

  if (!product) {
    return res.status(404).send('Not found');
  }

  res.status(200).json(product);
};

export default handler;
