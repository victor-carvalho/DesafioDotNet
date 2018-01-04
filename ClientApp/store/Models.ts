export type ChallengeType = "canguru" | "maxminsoma" | "quaseordenado";

export interface ChallengeResult {
    id: number;
    done: boolean;
    fileName: string;
    isCorrect: boolean;
    output: string | null;
    errorMessage: string | null;
}

export interface Challenge {
    id: string;
    done: boolean;
    fileName: string;
    startTime: string;
    endTime: string | null;
    duration: number | null;
    challengeType: ChallengeType;
    results: ChallengeResult[];
}
