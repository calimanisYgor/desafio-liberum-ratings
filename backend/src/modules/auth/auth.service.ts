import { AppDataSource } from "../../database/data-source";
import { User } from "../../entities/User";
import { AppError } from "../../shared/AppError";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export const register = async (
  userData: Omit<User, "id" | "role" | "createdAt" | "orders">
): Promise<Omit<User, "password">> => {
  const { email, password } = userData;

  const userExists = await userRepository.findOneBy({ email });
  if (userExists) {
    throw new AppError("Email already in use", 409);
  }

  const hashedPasword = await bcrypt.hash(password, 10);
  const newUser = userRepository.create({
    ...userData,
    password: hashedPasword,
  });

  await userRepository.save(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const login = async (credentials: Pick<User, "email" | "password">) => {
  const { email, password } = credentials;

  const user = await userRepository.findOneBy({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15min" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
