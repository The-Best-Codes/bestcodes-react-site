import { csrf } from 'next-csrf';

const handler = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

export default csrf(handler);