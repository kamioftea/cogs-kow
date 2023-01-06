import {Email} from "../lib/send-email";
import {User} from "./user";

export class ProcessRegistrationEmail implements Email {
    html: string;
    subject: string;
    to: string[];

    constructor(user: User) {
        this.subject = `${user.name}<${user.email}> has registered for COGS Kings of War.`;

        const processURL = new URL(`https://kow.c-o-g-s.org.uk/admin/user/process-registration/${user.email}`)

        this.html = `<p>You now need to <a href="${processURL}">process this request</a>.</p>`;
        this.to = [process.env.ADMIN_EMAIL ?? 'changeme@example.org'];
    }
}
