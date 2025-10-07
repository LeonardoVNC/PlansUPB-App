export type VoteType = 'going' | 'not_going' | 'maybe';

export interface Vote {
    id: string;
    planId: string;
    userId: string;
    vote: VoteType;
}

export interface VoteState {
    votes: Vote[];
    addVote: (vote: Vote) => void;
    updateVote: (voteId: string, updates: Partial<Vote>) => void;
    removeVote: (voteId: string) => void;
    getUserVotes: (userId: string) => Vote[];
    getVotesByPlan: (planId: string) => Vote[];
}
