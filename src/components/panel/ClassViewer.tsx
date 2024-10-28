import {Skeleton} from "@/components/ui/skeleton";
import React, {Suspense, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Grade from "@/components/panel/Grade";
import { ScrollArea } from "@/components/ui/scroll-area";
import {ClassData, ClientAssignment} from "@/lib/utils";


function ClassViewer(props: { clazz: string }) {
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

    if (!data.hasOwnProperty(props.clazz)) {
        return <ClassViewerSkeleton/>;
    } else {
        return (
            <Card className={"w-full dark"}>
                <CardHeader>
                    <h1>{props.clazz}</h1>
                </CardHeader>
                <CardContent>
                    <ScrollArea className={"h-[50vh]"}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Assignment</TableHead>
                                    <TableHead>Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data[props.clazz].map((assignment: ClientAssignment, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell>{assignment.name}</TableCell>
                                        <TableCell><Grade grade={parseFloat(assignment.grade)}/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
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

export default function ClassView(props: { clazz: string }) {
    return (
        <Suspense fallback={<ClassViewerSkeleton/>}>
            <ClassViewer clazz={props.clazz}/>
        </Suspense>
    )
}