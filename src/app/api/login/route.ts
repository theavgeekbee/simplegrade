import {NextRequest} from 'next/server';
import {HAC_ENVIRONMENT, USER_AGENT} from "@/environment";

// This function removes whitespace and attempted XSS/SQL injection from a string. Special characters are allowed.
function removeInvalid(str: string): string {
    str = str.trim();
    str = str.replace(/\s+/g, ''); // Removes whitespace
    str = str.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    str = str.replace(/['";]/g, ''); // Remove single quotes, double quotes, and semicolons

    return str;
}

function validateCredentials(credentials: {username: string, password: string}): {username: string, password: string} {
    return {
        username: removeInvalid(credentials.username),
        password: removeInvalid(credentials.password)
    };
}

export async function POST(req: NextRequest): Promise<Response> {
    const body = await req.json();

    // Check if the username and password exist
    if (!body.username || !body.password) {
        return new Response('Missing username or password', {status: 400});
    }

    const {username, password} = validateCredentials(body);

    const auth_result = await fetch(
        `https://homeaccesscenterapi.vercel.app/api/name?link=${HAC_ENVIRONMENT}&user=${username}&pass=${password}`,
        {
            method: 'GET',
            headers: {
                'User-Agent': USER_AGENT
            }
        }
    )

    if (auth_result.ok) {
        return Response.json({success: true});
    } else {
        return new Response('Invalid credentials', {status: 401});
    }
}