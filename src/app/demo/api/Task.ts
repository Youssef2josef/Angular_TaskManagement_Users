export interface Task {
    id: number;
    name: string;
    status: boolean;
    finish: boolean;
    project?: any;
    userCreation?: any;
    issueDate: any;
    managerTaskAssociations?: any;
}
