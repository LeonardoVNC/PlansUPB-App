// Poll-related types (independent from plans)
export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Vote {
    userId: string;
    optionId: string;
}

export interface Poll {
    id: string;
    question: string;
    description?: string;
    options: PollOption[];
    allowMultiple: boolean;
    createdAt: Date;
    closesAt?: Date;
    votes: Vote[];
    createdBy: string;
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
