export interface Project {
    id: number;
    name: string;
    status: boolean;
    creationTime: string;
    startTime: string;
    estimateFinishTime: string;
    finishTime: string | null;
    isAvailable?: boolean;
    isCompleted?: boolean;
}
