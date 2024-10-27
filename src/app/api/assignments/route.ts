import {NextRequest} from 'next/server';
import {HAC_ENVIRONMENT, USER_AGENT} from "@/environment";
import {Assignment} from "@/lib/utils";

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

function extractCategoryDict(categories_list: [[string]]) {
    const categories: {[key: string]: number} = {};

    const header = categories_list[0];
    const name_index = header.indexOf("Category");
    const weight_index = header.indexOf(" CategoryWeight"); // The space is important

    for (let i = 1; i < categories_list.length; i++) {
        const category = categories_list[i];
        const name = category[name_index];
        categories[name] = parseFloat(category[weight_index]);
    }

    return categories;
}

export async function GET(req: NextRequest): Promise<Response> {
    // Get request query params
    const loginData = req.nextUrl.searchParams.get('login_data');
    if (!loginData) {
        return new Response('Missing login data', {status: 400});
    }
    const {username, password} = getCredentials(loginData);

    const auth_result = await fetch(
        `https://homeaccesscenterapi.vercel.app/api/assignments?link=${HAC_ENVIRONMENT}&user=${username}&pass=${password}`,
        {
            method: 'GET',
            headers: {
                'User-Agent': USER_AGENT
            }
        }
    )

    if (auth_result.ok) {
        const data = await auth_result.json();

        // We will now traverse the data and extract the assignments and their grades
        const assignments: {[key: string]: Assignment[]} = {};

        for (const clazz in data) {
            const assignments_data = data[clazz]["assignments"];
            const header = assignments_data[0];
            const categories = extractCategoryDict(data[clazz]["categories"]);

            const name_index = header.indexOf("Assignment");
            const category_index = header.indexOf("Category");
            const grade = header.indexOf("Score");
            const weight = header.indexOf("Weight");

            const data_accumulator: Assignment[] = [];
            for (let i = 1; i < assignments_data.length; i++) {
                const assignment = assignments_data[i];

                data_accumulator.push(new Assignment(
                    assignment[name_index],
                    assignment[grade],
                    categories[assignment[category_index]],
                    parseFloat(assignment[weight])
                ));
            }

            assignments[clazz] = data_accumulator;
        }

        return Response.json({success: true, data: assignments});
    } else {
        return new Response('Invalid credentials', {status: 401});
    }
}