import jwt from "jsonwebtoken";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const getUser = (token: string) => {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as User;
  } catch (err) {
    return null;
  }
};