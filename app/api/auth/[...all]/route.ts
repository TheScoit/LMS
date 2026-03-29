import { auth } from "@/lib/auth";

import arcjet ,{  ArcjetDecision, BotOptions, EmailOptions, ProtectSignupOptions, shield, SlidingWindowRateLimitOptions} from "@arcjet/next"

import { toNextJsHandler } from "better-auth/next-js"
import { NextRequest } from "next/server";

const emailOptions = {
    mode: "LIVE",
    block: ["DISPOSABLE","INVALID","NO_MX_RECORDS"],
} satisfies EmailOptions;

// bot Protection
const botOptions = {
    mode: "LIVE",
    allow: [],
} satisfies BotOptions;

const rateLimitOptions = {
    mode: "LIVE",
    interval: "2m",
    max: 5,
} satisfies SlidingWindowRateLimitOptions<[]>;