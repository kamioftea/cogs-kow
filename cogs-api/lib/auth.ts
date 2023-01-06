import Iron from '@hapi/iron';
import {serialize, parse} from 'cookie';
import {NextFunction, Request, Response} from "express";
import {findUserByEmail, UserResponse} from "../users/user";
import {Forbidden, isHttpStatusError, Unauthenticated} from "../error-handling/http-status-error";

const TOKEN_NAME = 'kow-auth'
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'change-me-to-a-32-character-or-longer-string'

export enum Role {
    ADMIN = "Admin",
    PLAYER = "Player",
}

export const MAX_AGE = 60 * 60 * 8 // 8 hours

export interface Session {
    user: UserResponse
}

interface SessionStore {
    email: string,
    maxAge: number,
    createdAt: number,
}

export interface AuthenticatedLocals extends Record<string, any> {
    user?: UserResponse
}

export function setTokenCookie(res: Response, token: string) {
    const cookie = serialize(TOKEN_NAME, token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
    })

    res.setHeader('Set-Cookie', cookie)
}

export function removeTokenCookie(res: Response) {
    const cookie = serialize(TOKEN_NAME, '', {
        maxAge: -1,
        path: '/',
    })

    res.setHeader('Set-Cookie', cookie)
}

export function parseCookies(req: Request) {
    // For API Routes we don't need to parse the cookies.
    if (req.cookies) return req.cookies

    // For pages, we do need to parse the cookies.
    const cookie = req.headers?.cookie
    return parse(cookie || '')
}

export function getTokenCookie(req: Request) {
    const cookies = parseCookies(req)
    return cookies[TOKEN_NAME]
}

export async function setLoginSession(res: Response, session: Session) {
    const createdAt = Date.now()
    // Create a session object with a max age that we can validate later
    const obj: SessionStore = {email: session.user.email, createdAt, maxAge: MAX_AGE}
    const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults)

    setTokenCookie(res, token)
}

export async function getLoginSession(req: Request, roles?: Role | Role[]): Promise<Session> {
    const token = getTokenCookie(req)
    if (!token) {
        throw Unauthenticated("Please log in")
    }

    const session = await Iron.unseal(token, TOKEN_SECRET, Iron.defaults) as SessionStore
    const expiresAt = session.createdAt + session.maxAge * 1000

    // Validate the expiration date of the session
    if (Date.now() > expiresAt) {
        throw new Error('Session expired')
    }

    const user = await findUserByEmail(session.email)

    if (!user) {
        throw Unauthenticated("Please log in")
    }

    if (roles != undefined) {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        if (!roles.find(r => (user.roles ?? []).includes(r))) {
            throw Forbidden("You don't have permission to access this resource")
        }
    }

    return {user}
}

export async function getResetKey(user: UserResponse): Promise<string> {
    return await Iron.seal({email: user.email, createdAt: Date.now()}, TOKEN_SECRET, Iron.defaults);
}

export const Authenticated = (roles?: Role | Role[]) =>
    async (req: Request, res: Response<any, AuthenticatedLocals>, next: NextFunction) => {
        try {
            const session = await getLoginSession(req, roles)
            res.locals.user = session.user
            next()
        } catch (error) {
            console.log(error);
            isHttpStatusError(error)
                ? res.status(error.status).send(error)
                : res.status(500).json(error)
        }
    }
