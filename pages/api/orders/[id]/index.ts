import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Order } from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  await db.connect();

  const order = await Order.findById(req.query.id);
  db.disconnect();

  res.status(200).send(order);
};

export default handler;
