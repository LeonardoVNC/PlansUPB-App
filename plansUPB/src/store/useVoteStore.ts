import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PollState } from '../interfaces/vote.interfaces';
import { mockPolls } from '../data/polls.mock';

export const useVoteStore = create<PollState>()(
    persist(
        (set, get) => ({
            polls: mockPolls,

            addPoll: (poll) => {
                set((state) => ({
                    polls: [...state.polls, poll],
                }));
            },

            updatePoll: (pollId, updates) => {
                set((state) => ({
                    polls: state.polls.map((poll) =>
                        poll.id === pollId 
                            ? { ...poll, ...updates } 
                            : poll
                    ),
                }));
            },

            removePoll: (pollId) => {
                set((state) => ({
                    polls: state.polls.filter((poll) => poll.id !== pollId),
                }));
            },

            addVoteToPoll: (pollId, userId, optionId) => {
                set((state) => ({
                    polls: state.polls.map((poll) => {
                        if (poll.id !== pollId) return poll;

                        // Verificar si el usuario voto por la opcion
                        const hasVoted = poll.votes.some(
                            v => v.userId === userId && v.optionId === optionId
                        );
                        if (hasVoted) return poll;

                        // Si no se permite votar multiple, remover los votos anteriores del usuario
                        let updatedVotes = poll.votes;
                        if (!poll.allowMultiple) {
                            updatedVotes = poll.votes.filter(v => v.userId !== userId);
                        }

                        const newVotes = [...updatedVotes, { userId, optionId }];

                        const updatedOptions = poll.options.map(opt => ({
                            ...opt,
                            votes: newVotes.filter(v => v.optionId === opt.id).length
                        }));

                        return {
                            ...poll,
                            votes: newVotes,
                            options: updatedOptions
                        };
                    })
                }));
            },

            removeVoteFromPoll: (pollId, userId, optionId) => {
                set((state) => ({
                    polls: state.polls.map((poll) => {
                        if (poll.id !== pollId) return poll;

                        const newVotes = poll.votes.filter(
                            v => !(v.userId === userId && v.optionId === optionId)
                        );

                        const updatedOptions = poll.options.map(opt => ({
                            ...opt,
                            votes: newVotes.filter(v => v.optionId === opt.id).length
                        }));

                        return {
                            ...poll,
                            votes: newVotes,
                            options: updatedOptions
                        };
                    })
                }));
            },

            getUserPolls: (userId) => {
                return get().polls.filter((poll) => poll.createdBy === userId);
            },

            getPollById: (pollId) => {
                return get().polls.find((poll) => poll.id === pollId);
            },
        }),
        {
            name: 'poll-storage',
            storage: createJSONStorage(() => AsyncStorage, {
                reviver: (key, value) => {
                    if (key === 'polls' && Array.isArray(value)) {
                        return value.map((poll: any) => ({
                            ...poll,
                            createdAt: new Date(poll.createdAt),
                            closesAt: poll.closesAt ? new Date(poll.closesAt) : undefined,
                        }));
                    }
                    return value;
                }
            }),
            partialize: (state) => ({
                polls: state.polls,
            }),
        }
    )
);
