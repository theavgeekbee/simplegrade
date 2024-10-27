import * as React from "react"
import {Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

export default function Home() {
    return (
        <Card className="w-[350px] dark">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <Label htmlFor={"username"}>Username</Label>
                <Input placeholder={"K12345678"} />
                <Label className={"mt-2"} htmlFor={"password"}>Password</Label>
                <Input placeholder={"Password"} type={"password"} />
            </CardContent>
            <CardFooter>
                <Button className={"w-full"}>Login</Button>
            </CardFooter>
        </Card>
    )
}
