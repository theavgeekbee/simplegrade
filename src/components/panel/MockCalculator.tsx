import {ClassData, ClientAssignment} from "@/lib/utils";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {useSearchParams} from "next/navigation";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Grade from "@/components/panel/Grade";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Input} from "@/components/ui/input";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {Button} from "@/components/ui/button";


function recalculateAverages(assignments: ClientAssignment[]) {
    let total = 0;
    // Split the assignments across their categories, denoted by differing assignment_types
    const categories: { [key: number]: ClientAssignment[] } = {};
    const category_names: number[] = [];
    assignments.forEach((assignment) => {
        if (!categories.hasOwnProperty(assignment.assignment_type)) {
            categories[assignment.assignment_type] = [];
            category_names[assignment.assignment_type] = assignment.assignment_type;
        }
        categories[assignment.assignment_type].push(assignment);
    });
    // Calculate the average for each category
    for (const category in categories) {
        let category_total = 0;
        let category_weight = 0;
        for (let i = 0; i < categories[category].length; i++) {
            if (isNaN(parseFloat(categories[category][i].grade))) {
                continue;
            }
            category_total += parseFloat(categories[category][i].grade) * categories[category][i].weight;
            category_weight += categories[category][i].weight;
        }
        total += (category_total / category_weight) * (category_names[category] / 100);
    }

    // Round to 2 decimal places
    return Math.round(total * 100) / 100;
}

export default function MockCalculator(props: { clazz: string }) {
    const [assignments, setAssignments] = useState<ClientAssignment[]>([]);
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
                        const classData: ClassData = data.data;
                        if (!classData.hasOwnProperty(props.clazz)) {
                            alert("Class not found");
                        } else {
                            setAssignments(classData[props.clazz]);
                        }
                    } else {
                        alert("An error occurred");
                    }
                }
            ).catch(
                () => alert("An error occurred")
            );
        }
    }, [params, props.clazz]);

    function removeAssignment(assignment_name: string) {
        setAssignments(assignments.filter((assignment) => assignment.name !== assignment_name));
    }

    function addAssignment() {
        // Get the assignment details
        const name = (document.getElementById("assign_name") as HTMLInputElement).value;
        const grade = (document.getElementById("assign_grade") as HTMLInputElement).value;
        const category = (document.getElementById("assign_cat") as HTMLInputElement).value;
        const weight = (document.getElementById("assign_weight") as HTMLInputElement).value;

        // Validate the input
        if (name === "" || grade === "" || category === "" || weight === "") {
            alert("Please fill out all fields");
            return;
        }
        if (isNaN(parseFloat(grade)) || isNaN(parseFloat(category)) || isNaN(parseFloat(weight))) {
            alert("Please enter valid numbers");
            return;
        }
        // Add the assignment
        setAssignments([
            ...assignments,
            {
                name: name,
                grade: grade,
                assignment_type: parseFloat(category),
                weight: parseFloat(weight)
            }
        ]);
    }

    return (
        <Card className={"w-full dark"}>
            <CardHeader>
                <h1>{props.clazz} Mock Calculator</h1>
            </CardHeader>
            <CardContent>
                <h2>Average: {recalculateAverages(assignments)}</h2>

                <Popover>
                    <PopoverTrigger className={"bg-white text-black rounded-md p-2"}>
                        Create Mock Assignment
                    </PopoverTrigger>
                    <PopoverContent>
                        <Input placeholder={"Assignment Name"} className={"mb-1.5"} id={"assign_name"}/>
                        <Input placeholder={"Grade"} className={"mb-1.5"} id={"assign_grade"} type={"number"}/>
                        <HoverCard>
                            <HoverCardTrigger>
                                <Input placeholder={"Category"} type={"number"} className={"mb-1.5"} id={"assign_cat"}/>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                This is the percentage of the final grade, i.e. for AP class major grades, type 70 for
                                70%.
                            </HoverCardContent>
                        </HoverCard>
                        <HoverCard>
                            <HoverCardTrigger>
                                <Input placeholder={"Weight"} type="number" className={"mb-1.5"} id={"assign_weight"}/>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                This is the weight of the assignment. For example, if it is only worth half of a quiz
                                and you set the category to the quiz, type 0.5.
                            </HoverCardContent>
                        </HoverCard>
                        <Button onClick={() => addAssignment()}>
                            Add Assignment
                        </Button>
                    </PopoverContent>
                </Popover>

                <ScrollArea className={"h-[30vh]"}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assignment</TableHead>
                                <TableHead>Grade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((assignment: ClientAssignment, index: number) => (
                                <TableRow key={index} onClick={() => removeAssignment(assignment.name)}>
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