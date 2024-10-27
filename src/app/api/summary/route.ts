import {NextRequest} from 'next/server';
import {HAC_ENVIRONMENT, USER_AGENT} from "@/environment";

function getCredentials(login_data: string): {username: string, password: string} {
    const decoded = atob(login_data);
    const split = decoded.split(':');
    if (split.length !== 2) {
        throw new Error('Invalid login data');
    }
    return {
        username: split[0],
        password: split[1]
    };
}

export async function GET(req: NextRequest): Promise<Response> {
    // Get request query params
    const loginData = req.nextUrl.searchParams.get('login_data');
    if (!loginData) {
        return new Response('Missing login data', {status: 400});
    }
    const {username, password} = getCredentials(loginData);

    const auth_result = await fetch(
        `https://homeaccesscenterapi.vercel.app/api/averages?link=${HAC_ENVIRONMENT}&user=${username}&pass=${password}`,
        {
            method: 'GET',
            headers: {
                'User-Agent': USER_AGENT
            }
        }
    )

    if (auth_result.ok) {
        const data = await auth_result.json();
        return Response.json({success: true, data: data});
    } else {
        return new Response('Invalid credentials', {status: 401});
    }
}