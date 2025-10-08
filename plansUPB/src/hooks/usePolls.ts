import { useEffect, useState } from 'react';
import { Poll } from '../interfaces/vote.interfaces';
import { generateUUID } from '../utils/idGenerator';
import { useVoteStore } from '../store/useVoteStore';
import { useUserStore } from '../store/useUserStore';

export const usePolls = () => {
    const [myPolls, setMyPolls] = useState<Poll[]>([]);
    const [allPolls, setAllPolls] = useState<Poll[]>([]);
    const { polls, addPoll, updatePoll, removePoll, addVoteToPoll, removeVoteFromPoll, getUserPolls, getPollById } = useVoteStore();
    const { user } = useUserStore();

    useEffect(() => {
        if (user) {
            const filtered = getUserPolls(user.code);
            setMyPolls(filtered);
        }
    }, [polls, user]);

    useEffect(() => {
        setAllPolls(polls);
    }, [polls]);

    const createPoll = async (poll: Omit<Poll, "id">) => {
        const id = await generateUUID();
        const newPoll: Poll = { id, ...poll };
        addPoll(newPoll);
    };

    const votePoll = (pollId: string, optionId: string) => {
        if (!user) return;
        addVoteToPoll(pollId, user.code, optionId);
    };

    const unvotePoll = (pollId: string, optionId: string) => {
        if (!user) return;
        removeVoteFromPoll(pollId, user.code, optionId);
    };

    const hasUserVoted = (poll: Poll, optionId: string): boolean => {
        if (!user) return false;
        return poll.votes.some(v => v.userId === user.code && v.optionId === optionId);
    };

    const getUserVotesForPoll = (poll: Poll): string[] => {
        if (!user) return [];
        return poll.votes
            .filter(v => v.userId === user.code)
            .map(v => v.optionId);
    };

    return {
        myPolls,
        allPolls,
        createPoll,
        votePoll,
        unvotePoll,
        hasUserVoted,
        getUserVotesForPoll,
        getPollById,
        updatePoll,
        removePoll,
    };
};

export default usePolls;
