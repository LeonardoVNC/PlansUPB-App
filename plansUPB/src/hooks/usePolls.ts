import { useMemo } from 'react';
import { Poll } from '../interfaces/vote.interfaces';
import { useUserStore } from '../store/useUserStore';
import { usePollStore } from '../store/usePollStore';
import * as pollService from '@services/polls.service';

export const usePolls = () => {
    const { polls, setPolls } = usePollStore();
    const { user } = useUserStore();

    const fetchAllPolls = async () => {
        const allPolls = await pollService.getAllPolls();
        if (allPolls) setPolls(allPolls);
    };

    const fetchPollsByPlan = async (planId: string) => {
        const planPolls = await pollService.getPollsByPlanId(planId);
        if (planPolls && planPolls.length > 0) {
            setPolls(currentPolls => {
                const pollsMap = new Map(currentPolls.map(p => [p.id, p]));
                planPolls.forEach(poll => pollsMap.set(poll.id, poll));
                return Array.from(pollsMap.values());
            });
        }
        return planPolls || [];
    };

    const myPolls = useMemo(() => {
        if (!user) return [];
        return polls.filter(poll => poll.createdBy === user.code);
    }, [polls, user]);

    const allPolls = useMemo(() => polls, [polls]);

    const createPoll = async (poll: Omit<Poll, 'id'>): Promise<string | undefined> => {
        const pollWithCreator = { ...poll, createdBy: user?.code };
        const newPollId = await pollService.createPoll(pollWithCreator);
        
        if (newPollId) {
            const newPoll: Poll = {
                ...pollWithCreator,
                id: newPollId,
                createdAt: new Date(),
                votes: pollWithCreator.votes || [],
                isOpen: pollWithCreator.isOpen !== undefined ? pollWithCreator.isOpen : true,
            } as Poll;
            setPolls(currentPolls => [...currentPolls, newPoll]);
        }
        
        return newPollId;
    };

    const updatePollData = async (pollId: string, updates: Partial<Poll>) => {
        pollService.updatePoll(pollId, updates)
            .catch(error => console.error('Error al actualizar poll:', error));
        
        setPolls(currentPolls => 
            currentPolls.map(p => p.id === pollId ? { ...p, ...updates } : p)
        );
    };

    const deletePoll = async (pollId: string) => {
        pollService.deletePoll(pollId)
            .catch(error => console.error('Error al eliminar poll:', error));
        
        setPolls(currentPolls => currentPolls.filter(p => p.id !== pollId));
    };

    const votePoll = async (pollId: string, optionId: string) => {
        if (!user) return;
        const poll = polls.find(p => p.id === pollId);
        if (!poll || !poll.isOpen || !poll.votes || !poll.options) return;

        let updatedVotes = [...poll.votes];
        if (!poll.allowMultiple) {
            updatedVotes = updatedVotes.filter(v => v && v.userId !== user.code);
        }
        updatedVotes.push({ userId: user.code, optionId });

        const voteCounts = poll.options.reduce((acc, opt) => {
            acc[opt.id] = updatedVotes.filter(v => v && v.optionId === opt.id).length;
            return acc;
        }, {} as Record<string, number>);

        const updatedOptions = poll.options.map(opt => ({ ...opt, votes: voteCounts[opt.id] || 0 }));
        const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
        const shouldClose = poll.closeCriteria === 'quorum' && poll.quorumCount && totalVotes >= poll.quorumCount;

        pollService.updatePoll(pollId, {
            votes: updatedVotes,
            options: updatedOptions,
            ...(shouldClose && { isOpen: false })
        }).catch(error => {
            console.error('Error al votar:', error);
        });
        
        const updatedPolls = polls.map(p => 
            p.id === pollId 
                ? { ...p, votes: updatedVotes, options: updatedOptions, ...(shouldClose && { isOpen: false }) }
                : p
        );
        setPolls(updatedPolls);
    };

    const unvotePoll = async (pollId: string, optionId: string) => {
        if (!user) return;
        const poll = polls.find(p => p.id === pollId);
        if (!poll || !poll.isOpen || !poll.votes || !poll.options) return;

        const updatedVotes = poll.votes.filter(v => v && !(v.userId === user.code && v.optionId === optionId));
        const voteCounts = poll.options.reduce((acc, opt) => {
            acc[opt.id] = updatedVotes.filter(v => v && v.optionId === opt.id).length;
            return acc;
        }, {} as Record<string, number>);
        const updatedOptions = poll.options.map(opt => ({ ...opt, votes: voteCounts[opt.id] || 0 }));

        pollService.updatePoll(pollId, { votes: updatedVotes, options: updatedOptions })
            .catch(error => console.error('Error al remover voto:', error));
        
        const updatedPolls = polls.map(p => 
            p.id === pollId ? { ...p, votes: updatedVotes, options: updatedOptions } : p
        );
        setPolls(updatedPolls);
    };

    const hasUserVoted = (poll: Poll, optionId: string): boolean => {
        if (!user) return false;
        return poll.votes?.some(v => v && v.userId === user.code && v.optionId === optionId) || false;
    };

    const getUserVotesForPoll = (poll: Poll): string[] => {
        if (!user) return [];
        return poll.votes?.filter(v => v && v.userId === user.code).map(v => v.optionId) || [];
    };

    const getPollById = (pollId: string): Poll | undefined => {
        return polls.find(p => p.id === pollId);
    };

    return {
        polls, myPolls, allPolls,
        fetchAllPolls, fetchPollsByPlan,
        createPoll, updatePoll: updatePollData, deletePoll,
        votePoll, unvotePoll,
        hasUserVoted, getUserVotesForPoll, getPollById
    };
};

export default usePolls;
