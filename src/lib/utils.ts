import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class Assignment {
    name: string;
    grade: string;
    assignment_type: number;
    weight: number;

    constructor(name: string, grade: string, assignment_type: number, weight: number) {
        this.name = name;
        this.grade = grade;
        this.assignment_type = assignment_type;
        this.weight = weight;
    }

    toJSON() {
        return {
            name: this.name,
            grade: this.grade,
            assignment_type: this.assignment_type,
            weight: this.weight
        }
    }
}