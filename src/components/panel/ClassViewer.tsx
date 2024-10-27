import {Skeleton} from "@/components/ui/skeleton";
import React, {Suspense, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";

interface Assignment {
    name: string;
    grade: string;
    category: string;
    weight: number;
}

interface ClassData {
    [key: string]: Assignment[];
}

function ClassViewer(props: { className: string }) {
    const [data, setData] = React.useState<ClassData>({});
    const params = useSearchParams();

    useEffect(() => {
        const login_data = params.get("login_data");
        if (!login_data) {
            alert("Missing login data");
        } else {
            fetch(`/api/assignments?login_data=${login_data}`).then(
                (res) => res.json()
            ).then(
                (data) => {
                    if (data.success) {
                        setData(data.data);
                    } else {
                        alert("An error occurred");
                    }
                }
            ).catch(
                () => alert("An error occurred")
            );
        }
    }, [params]);

    if (!data.hasOwnProperty(props.className)) {
        return <ClassViewerSkeleton/>;
    } else {
        return (
            <Card className={"w-full"}>
                <CardHeader>
                    <h1>{props.className}</h1>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeader>Assignment</TableHeader>
                                <TableHeader>Grade</TableHeader>
                                <TableHeader>Category</TableHeader>
                                <TableHeader>Weight</TableHeader>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data[props.className].map((assignment: Assignment, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{assignment.name}</TableCell>
                                    <TableCell>{assignment.grade}</TableCell>
                                    <TableCell>{assignment.category}</TableCell>
                                    <TableCell>{assignment.weight}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    }
}

function ClassViewerSkeleton() {
    return (
        <Card className={"dark"}>
            <Skeleton className={"w-full h-10"}/>
        </Card>
    )
}

export default function ClassView({className}: { className: string }) {
    return (
        <Suspense fallback={<ClassViewerSkeleton/>}>
            <ClassViewer className={className}/>
        </Suspense>
    )
}