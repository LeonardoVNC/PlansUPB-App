export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Vote {
    userId: string;
    optionId: string;
}

export type CloseCriteria = 'deadline' | 'quorum' | 'none';
export type TiebreakMethod = 'oldest_first' | 'creator_decides';

export interface Poll {
    id: string;
    planId?: string;
    createdBy?: string;
    question: string;
    description?: string;
    options: PollOption[];
    allowMultiple: boolean;
    createdAt: Date;
    closesAt?: Date;
    votes: Vote[];
    closeCriteria: CloseCriteria; // 'deadline' | 'quorum'
    quorumCount?: number;
    tiebreakMethod: TiebreakMethod; // 'oldest_first' | 'creator_decides'
    isOpen: boolean;
}

export interface PollState {
    polls: Poll[];
    addPoll: (poll: Poll) => void;
    updatePoll: (pollId: string, updates: Partial<Poll>) => void;
    removePoll: (pollId: string) => void;
    addVoteToPoll: (pollId: string, userId: string, optionId: string) => void;
    removeVoteFromPoll: (pollId: string, userId: string, optionId: string) => void;
    getUserPolls: (userId: string) => Poll[];
    getPollById: (pollId: string) => Poll | undefined;
}
