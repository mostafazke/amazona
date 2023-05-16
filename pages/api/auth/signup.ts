import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models';
import db from '../../../utils/db';
import bcryptjs from 'bcryptjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.match(
      /^([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9_\-\\.]+)\.([a-zA-Z]{2,5})$/
    ) ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();
  res.status(201).json(user);
};

export default handler;
