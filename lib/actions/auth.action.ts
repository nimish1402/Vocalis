'use server'
import { auth, db } from "@/Firebase/admin";
import { Auth } from "firebase-admin/auth";
import { cookies } from "next/headers";


const ONE_WEEK = 60 * 60 * 24 * 7; // seconds
export async function signUp(params: SignUpParams){
    const {uid, name, email} = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get(); 

        if(userRecord.exists){
            return {
                success: false,
                message: 'This user already exists. Please sign in.'
            }
        }
        
        await db.collection('users').doc(uid).set({
            name,
            email
        })

        return {
            success: true,
            message: 'User created successfully.'
        }

    }catch(e : any){
        console.error('error creating a user', e);

        if(e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: 'This eail is already registered.'
            }
        }
        return {
            success: false,
            message: 'failed to create an accouny'
        }
    }
}

export async function signIn(params: SignInParams){
    const {email, idToken} = params;

    try{

        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: 'This user does not exist. Please sign up.'
            }
        }
        
        await setSessionCookie(idToken);

    }catch(e){
        console.error(e);

        return{
            success: false,
            message: 'Failed to sign in. Please try again.'
        }
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK, // 7 days in milliseconds

    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })
}

export async function getCurrentUser(): Promise<User | null>{
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie){
        return null;
    }

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists){
            return null;
        }
        return{
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    }catch(e){
        console.log(e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}