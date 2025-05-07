import { User } from "./user";

export type Role = 4001 | 5002 | 6003 | 7004;

export interface Auth {
  accessToken?: string;
  roles?: Role[];
  user?: Partial<User>;
}
