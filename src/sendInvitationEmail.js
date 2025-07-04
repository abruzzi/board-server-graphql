"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitationEmail = sendInvitationEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendInvitationEmail(to, boardName, invitationLink) {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // use TLS
        auth: {
            user: process.env.INVITE_EMAIL_USER,
            pass: process.env.INVITE_EMAIL_PASS,
        },
    });
    const info = await transporter.sendMail({
        from: `"Board Collaboration" <${process.env.INVITE_EMAIL_USER}>`,
        to: to,
        subject: "Invitation to collaborate on a board",
        text: `You have been invited to collaborate on the board "${boardName}". Click the link to join: ${invitationLink}`,
    });
    console.log("Message sent: %s", info.messageId);
}
