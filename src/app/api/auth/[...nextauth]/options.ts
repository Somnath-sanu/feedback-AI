import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { JWT } from "next-auth/jwt";

export interface session extends Session {
  user: {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  };
}

interface token extends JWT {
  _id?: string;
  isVerified?: boolean;
  isAcceptingMessages?: boolean;
  username?: string;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Password", type: "password", placeholder: "" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            console.error("No user found with this email");
            throw new Error("No user found with this email");
            return null;

          }

          if (!user.isVerified) {
            console.log("Please verify your account before login");
            
            throw new Error("Please verify your account before login");
            return null;

          }

          const isPasswordOk = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordOk) {
            return user;
          } else {
            console.log("Incorrect Password");
            throw new Error("Incorrect Password");

            return null;
          }
        } catch (error: any) {
          console.log(error);
          throw new Error(error);
          return null;
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  callbacks: {
    session: async ({ session, token }) => {
      const newSession: session = session as session;

      console.log("NewSession", newSession);

      if (token._id && newSession.user) {
        newSession.user._id = token._id;
        newSession.user.isVerified = token.isVerified;
        newSession.user.isAcceptingMessages = token.isAcceptingMessages;
        newSession.user.username = token.username;
      }
      return newSession;
    },
    jwt: async ({ token, user, profile }): Promise<JWT> => {
      console.log("Token", token);
      console.log("Profile", profile);
      console.log("User", user);

      const newToken: token = token as token;

      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }

      return newToken;
    },
  },
  // pages: {
  //   signIn: "/sign-in",
  // },
} satisfies NextAuthOptions;

//!By throwing specific errors in the authorize function and catching them in the client-side signIn function, you can display custom error messages to the user.
