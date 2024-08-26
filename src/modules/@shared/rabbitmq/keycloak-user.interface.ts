import { TeacherOutput } from "@core/teacher/application/teacher-output";

export interface User {
    customId: string;
    username: string;
    firstName?: string;
    lastName?: string;
    role?: string
    enabled?: boolean;
    credentials?: Array<{ type: string, value: string, temporary?: boolean }>;
}

export function OutputToUser(output: TeacherOutput, role?: string): User {
    const user: User = {
        customId: output.id,
        username: output.first_name,
        firstName: output.first_name,
        lastName: output.last_name,
        role,
        enabled: true,
        credentials: [{ type: 'password', value: output.first_name, }]
    }
    return user
}