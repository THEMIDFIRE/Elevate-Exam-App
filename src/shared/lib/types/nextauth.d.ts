import { UserInfo } from "./user";

declare module "next-auth" {
  interface User {
    user: UserInfo;
    accessToken: string;
  }

  interface Session {
    user: UserInfo;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserInfo;
    accessToken: string;
  }
}