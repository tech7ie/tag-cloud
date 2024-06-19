import { Request, Response, NextFunction } from 'express';

function checkToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];
  console.log(token)

  if (!token || token !== process.env.ACCES_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  next();
}

export default checkToken