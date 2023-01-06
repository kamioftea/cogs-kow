import {Email} from "../lib/send-email";
import {UserResponse} from "./user";

export class VerifyAccountEmail implements Email {
    html: string;
    subject: string;
    to: string[];

    constructor(user: UserResponse, resetKey: string, event?: string) {
        this.subject = `Thank you for signing up for ${event ?? 'COGs Kings of War'}.`;

        const verifyURL = new URL(`https://kow.c-o-g-s.org.uk/user/verify/`)
        verifyURL.searchParams.set('token', resetKey)

        this.html = `
<p>Hi ${user.name}</p>
<p>
    You are recieving this because you (or someone pretending to be you) signed up for ${event ?? 'Kings of War'} at 
    Chesterfield Open Gaming Society,
</p>
<p>
    If this was you, please <a href="${verifyURL}">verify your email by following this link</a>. If it wasn't, you can 
    ignore this email,
</p>
<p>
    Thanks, and welcome,<br />
    Chesterfield Open Gaming Society.
</p>
`;
        this.to = [user.email];
    }
}

