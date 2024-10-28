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
}
export interface ClientAssignment {
    name: string;
    grade: string;
    assignment_type: number;
    weight: number;
}
export interface ClassData {
    [key: string]: ClientAssignment[];
}

