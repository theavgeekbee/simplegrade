import {Card, CardHeader, CardTitle} from "@/components/ui/card";

export default function Panel() {
    return (
        <div className={"flex flex-col items-center justify-center h-screen"}>
            <Card className={"w-[350px] dark"}>
                <CardHeader>
                    <CardTitle>
                        My
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}