import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ConnectDB } from "./db/ConnectDB";
import AdminModel from "./models/AdminModel";
 
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Enter username",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }
 
                try {
                    // Fetch the user by username and use type assertion with lean()
                    console.log(credentials.username)
                    await ConnectDB();
                   
                    const user = await AdminModel.findOne({ username: credentials.username }).lean();
                    console.log(user)
 
                    if (!user) {
                        console.error("User not found");
                        return null;
                    }
 
                    // Compare the hashed password
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
 
                    if (isPasswordValid) {
                        // Return the user object in the structure expected by NextAuth
                        return {
                            id: user._id, // ObjectId is already string when using lean()
                            name: user.username,
                        };
                    } else {
                        console.error("Invalid password");
                        return null;
                    }
                } catch (error) {
                    console.error("Error during authorization:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    pages: {
        signIn: "/signin",
        error: "/signin?error=true",
    },
 
};