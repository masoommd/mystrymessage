import {NextAuthOptions, User} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect  from "@/lib/dbConnect";
import UserModel from "@/models/User";




export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                identifier:{label:"Email", type:"text"},
                password:{label:"Password", type:"password"}
            },
            async authorize(credentials: Record<"identifier" | "password", string> | undefined): Promise<User | null> {
                await dbConnect();
                try {
                    if (!credentials?.identifier || !credentials?.password) {
                        throw new Error("Missing credentials");
                      }
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("User not found with this email");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        return  {
                            id:user._id as string,
                            _id: user._id as string,
                            username: user.username,
                            isVerified: user.isVerified,
                            isAcceptingMessages: user.isAcceptingMessages,
                          };
                    } else{
                        throw new Error("Incorrect Password")
                    }
                } catch (err) {
                    throw new Error(err instanceof Error ? err.message : "An error occurred");
                }
            }
        }),
        
    ],
    callbacks:{
        async jwt({token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session;
        },
        

    },
    pages:{
        signIn: '/sign-in',
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET
}