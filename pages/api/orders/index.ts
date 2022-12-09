import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Order } from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  const { user } = session;

  if (req.method === 'POST') {
    return createOrder(req, res, user.id);
  } else if (req.method == 'GET') {
    return getOrders(req, res, user.id);
  }
  res.status(404).send('not emplimented');
};

const createOrder = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  await db.connect();

  const newOrder = new Order({
    ...req.body,
    user: userId,
  });

  const order = await newOrder.save();
  res.status(201).send(order);
};
const getOrders = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  await db.connect();
  const orders = await Order.find({ user: userId });
  res.status(200).send(orders);
};

export default handler;
