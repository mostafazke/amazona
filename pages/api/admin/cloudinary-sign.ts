import cloudinary from 'cloudinary';
import { NextApiRequest, NextApiResponse } from 'next';

export default function signature(req: NextApiRequest, res: NextApiResponse) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_SECRET || 'as'
  );

  res.statusCode = 200;
  res.json({ signature, timestamp });
}
