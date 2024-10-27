'use client';

import React, {Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import Grade from "@/components/panel/Grade";

function validate(value: string): number {
    // Remove anything that is not a number or a .
    value = value.replace(/[^0-9.]/g, '');
    return parseFloat(value);
}
class SummaryData {
    [key: string]: number;


    constructor(data: {[key: string]: string}) {
        for (const key in data) {
            this[key] = validate(data[key]);
        }
    }
}

function LoadedSummary() {
    const [data, setData] = React.useState(new SummaryData({}));
    const params = useSearchParams();

    React.useEffect(() => {
        const login_data = params.get("login_data");
        if (!login_data) {
            alert("Missing login data");
        } else {
            fetch(`/api/summary?login_data=${login_data}`).then(
                (res) => res.json()
            ).then(
                (data) => {
                    if (data.success) {
                        setData(new SummaryData(data.data));
                    } else {
                        alert("Invalid credentials");
                    }
                }
            ).catch(
                () => alert("An error occurred")
            );
        }
    }, [params]);

    return (
        <Card className={"dark"}>
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Class</TableHead>
                            <TableHead className="text-right">Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.keys(data).map((key) => (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell className="text-center">
                                    <Grade grade={data[key]} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function Summary() {
    return (
        <Suspense>
            <LoadedSummary/>
        </Suspense>
    )
}