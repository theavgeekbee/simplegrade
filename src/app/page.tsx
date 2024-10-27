'use client';

import * as React from "react"
import {Card, CardTitle, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";

export default function Home() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();

        const button = document.getElementById("login-button") as HTMLButtonElement;

        button.setAttribute("disabled", "true");

        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            })
        }).then(
            (res) => res.ok
        ).then(
            (is_ok) => {
                if (is_ok) {
                    window.location.href = "/panel?login_data=" + btoa(`${username}:${password}`);
                } else {
                    alert("Invalid credentials")
                }
            }
        ).catch(
            () => alert("An error occurred")
        ).finally(
            () => button.removeAttribute("disabled")
        )
    }


    return (
        <Card className="w-[350px] dark">
            <CardHeader>
                <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
                <Label htmlFor={"username"}>Username</Label>
                <Input
                    placeholder={"K1234567"}
                    id={"username"}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Label className={"mt-2"} htmlFor={"password"}>Password</Label>
                <Input
                    placeholder={"Password"}
                    id={"password"}
                    type={"password"}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </CardContent>
            <CardFooter>
                <Button
                    className={"w-full"}
                    id={"login-button"}
                    onClick={(e) => handleLogin(e)}
                >Login</Button>
            </CardFooter>
        </Card>
    )
}
