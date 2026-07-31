import { Request, Response, NextFunction } from "express";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const providedKey = req.header("x-admin-key");
  const expectedKey = process.env.ADMIN_SECRET;

  if (!expectedKey || !providedKey || providedKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required.",
    });
  }

  next();
};

export default requireAdmin;
