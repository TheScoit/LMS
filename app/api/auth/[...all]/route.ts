import { auth } from "@/lib/auth";

import arcjet from "@/lib/arcjet";
import {  ArcjetDecision, BotOptions, detectBot, EmailOptions, protectSignup, ProtectSignupOptions, shield, slidingWindow, SlidingWindowRateLimitOptions} from "@arcjet/next"
import ip from '@arcjet/ip'
import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest } from "next/server";

const emailOptions = {
    mode: "LIVE",
    block: ["DISPOSABLE","INVALID","NO_MX_RECORDS"],
} satisfies EmailOptions;

// bot Protection
const botOptions = {
    mode: "LIVE",
    allow: [], // prevents bots from submitting the form 
} satisfies BotOptions;

const rateLimitOptions = {
    mode: "LIVE",
    interval: "2m", // counts requests over a 2 minute sliding window
    max: 5, // allows 5 submissions within the window
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
    email: emailOptions,
    bots: botOptions,
    rateLimit : rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;

async function protect(req: NextRequest) : Promise<ArcjetDecision> {
    const session = await auth.api.getSession({
        headers : req.headers,
    });


    // if the user is logged in we'll use their ID as the identifier. This allows
    // limits to be applied across all devices and sessions ( you could also use the session ID)
    // Otherwise, fall back to the IP address.

    let userId : string;
    if(session?.user.id){
        userId = session.user.id;
    } else {
        userId = ip(req) || "127.0.0.1"; // fall back to local Ip if none
    }

    // If this is a signup then use the special protectSignup rule 
    if ( req.nextUrl.pathname.startsWith("/api/auth/sign-up")){
        // Better auth reads the body , so we need to clone the request preemptively

        const body = await req.clone().json();


        //If the email is in the body of the req then we can run  the email verification checks as well.
        if(typeof body.email === "string"){
            return arcjet
            .withRule(protectSignup(signupOptions))
            .protect(req, { email : body.email , fingerprint: userId});
        } else { 
            return arcjet
            .withRule(detectBot(botOptions))
            .withRule(slidingWindow(rateLimitOptions))
            .protect(req, {fingerprint : userId});
        }
    } else {
        return arcjet.withRule(detectBot(botOptions)).protect(req, { fingerprint: userId});
    }
}

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

// wrap the POST handler with Arcjet Protections
export const POST = async(req : NextRequest) => {
    const decision = await protect(req);

    console.log("Arcjet Decision : " , decision);

    if(decision.isDenied()){
        if(decision.reason.isRateLimit()) { 
            return new Response(null, {status : 429});
        } else if (decision.reason.isEmail()){ 
            let message: string;

            if(decision.reason.emailTypes.includes("INVALID")) {
                message = "Email address format is invalid. Is there a typo?";
            } else if(decision.reason.emailTypes.includes("DISPOSABLE")){ 
                message = "We do not allow disposable email addresses. ";
            } else if(decision.reason.emailTypes.includes("NO_MX_RECORDS")){
                message = "Your email domain does not have an MX record. Is there a typo?";
            } else {
                // This is a catch all , but the above should be exhaustive based on the configured rules.
                message = "Invalid email.";
            }
            return Response.json({ message } , {status : 400});
        } else{ 
            return new Response(null, {status :403});
        }
    }
    return authHandlers.POST(req);
};