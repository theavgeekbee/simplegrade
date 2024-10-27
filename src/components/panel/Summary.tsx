'use client';

import React, {Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import Grade from "@/components/panel/Grade";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";

function validate(value: string): number {
    // Remove anything that is not a number or a .
    value = value.replace(/[^0-9.]/g, '');
    return parseFloat(value);
}

class SummaryData {
    [key: string]: number;


    constructor(data: { [key: string]: string }) {
        for (const key in data) {
            this[key] = validate(data[key]);
        }
    }
}

function LoadedSummary() {
    const [data, setData] = React.useState(new SummaryData({"state": "0"}));
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

    if (data["state"] === 0) {
        return <SummarySkeleton/>;
    }

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
                                    <Grade grade={data[key]}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            View Grades
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={"dark"}>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    )
}

function SummarySkeleton() {
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
                            <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell><Skeleton className={"w-10 h-5"}/></TableCell>
                            <TableCell className="text-center"><Grade grade={100}/></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function Summary() {
    return (
        <Suspense fallback={<SummarySkeleton/>}>
            <LoadedSummary/>
        </Suspense>
    )
}