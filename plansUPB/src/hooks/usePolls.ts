import { useEffect, useState } from 'react';
import { Poll } from '../interfaces/vote.interfaces';
import { generateUUID } from '../utils/idGenerator';
import { usePlanStore } from '../store/usePlanStore';
import { useUserStore } from '../store/useUserStore';

export const usePolls = () => {
    const [myPolls, setMyPolls] = useState<Poll[]>([]);
    const [allPolls, setAllPolls] = useState<Poll[]>([]);
    const { polls, addPoll, updatePoll } = usePlanStore();
    const { user } = useUserStore();

    useEffect(() => {
        if (user && polls) {
            const filtered = polls.filter(poll => {
                if (poll.planId) {
                    const plan = usePlanStore.getState().plans.find(p => p.id === poll.planId);
                    return plan?.ownerCode === user.code;
                }
                return false;
            });
            setMyPolls(filtered);
        }
    }, [polls, user]);

    useEffect(() => {
        setAllPolls(polls || []);
    }, [polls]);

    const createPoll = async (poll: Omit<Poll, "id">) => {
        const id = await generateUUID();
        const newPoll: Poll = { id, ...poll };
        addPoll(newPoll);
    };

    const votePoll = (pollId: string, optionId: string) => {
        if (!user) return;
        
        const poll = polls.find(p => p.id === pollId);
        if (!poll || !poll.isOpen) return;

        let updatedVotes = [...poll.votes];
        let updatedOptions = [...poll.options];

        if (!poll.allowMultiple) {
            const userVotes = poll.votes.filter(v => v.userId === user.code);
            
            if (userVotes.length > 0) {
                updatedVotes = updatedVotes.filter(v => v.userId !== user.code);
                
                updatedOptions = updatedOptions.map(opt => {
                    const votesToRemove = userVotes.filter(v => v.optionId === opt.id).length;
                    return votesToRemove > 0 
                        ? { ...opt, votes: Math.max(0, opt.votes - votesToRemove) }
                        : opt;
                });
            }
        }

        updatedVotes.push({ userId: user.code, optionId });
        updatedOptions = updatedOptions.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        
        const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
        const shouldClose = poll.closeCriteria === 'quorum' && poll.quorumCount && totalVotes >= poll.quorumCount;

        updatePoll(pollId, { 
            votes: updatedVotes, 
            options: updatedOptions,
            ...(shouldClose && { isOpen: false })
        });
    };

    const unvotePoll = (pollId: string, optionId: string) => {
        if (!user) return;
        
        const poll = polls.find(p => p.id === pollId);
        if (!poll || !poll.isOpen) return;

        const updatedVotes = poll.votes.filter(
            v => !(v.userId === user.code && v.optionId === optionId)
        );
        const updatedOptions = poll.options.map(opt =>
            opt.id === optionId ? { ...opt, votes: Math.max(0, opt.votes - 1) } : opt
        );
        
        updatePoll(pollId, { votes: updatedVotes, options: updatedOptions });
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

    const getPollById = (pollId: string): Poll | undefined => {
        return polls.find(p => p.id === pollId);
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
    };
};

export default usePolls;
