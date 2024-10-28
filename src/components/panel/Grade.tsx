export default function Grade(props: {grade: number}) {
    function getColor(grade: number) {
        if (grade >= 90) {
            return "bg-green-500";
        } else if (grade >= 80) {
            return "bg-blue-500";
        } else if (grade >= 70) {
            return "bg-yellow-500";
        } else if (grade >= 60) {
            return "bg-red-500";
        } else {
            return "bg-gray-500";
        }
    }
    return (
        <div className={`rounded-md p-2 flex items-center justify-center text-white ${getColor(props.grade)}`}>
            {isNaN(props.grade) ? "N/A" : props.grade}
        </div>
    )
}