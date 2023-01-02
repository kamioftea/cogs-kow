import Iron from '@hapi/iron';
import { serialize, parse } from 'cookie';
import {Request, Response} from "express";
import {UserResponse} from "../model/user";

const TOKEN_NAME = 'kow-auth'
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'change-me-to-a-32-character-or-longer-string'


export const MAX_AGE = 60 * 60 * 8 // 8 hours

export interface Session {
    user: UserResponse
}

interface SessionStore {
    email: string,
    maxAge: number,
    createdAt: number,
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
