
import 'next-auth'
import { DefaultSession } from 'next-auth';


declare module 'next-auth' {
    interface User {
        _id?: string;
        username?: string;
        isAcceptingMessage?: boolean;
        isVerified?: boolean;
    }
    interface Session {
        user: User &  DefaultSession["User"] 
    }
    interface JWT {
        _id?: string;
        username?: string;
        isAcceptingMessage?: boolean;
        isVerified?: boolean;
    }
}

