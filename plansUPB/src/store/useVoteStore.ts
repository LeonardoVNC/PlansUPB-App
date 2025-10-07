import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VoteState } from '../interfaces/vote.interfaces';

const useVoteStore = create<VoteState>()(
    persist(
        (set, get) => ({
            votes: [],

            addVote: (vote) => {
                set((state) => ({
                    votes: [...state.votes, vote],
                }));
                
                return vote;
            },

            updateVote: (voteId, updates) => {
                set((state) => ({
                    votes: state.votes.map((vote) =>
                        vote.id === voteId 
                            ? { ...vote, ...updates } 
                            : vote
                    ),
                }));
            },

            removeVote: (voteId) => {
                set((state) => ({
                    votes: state.votes.filter((vote) => vote.id !== voteId),
                }));
            },

            getUserVotes: (userId) => {
                return get().votes.filter((vote) => vote.userId === userId);
            },

            getVotesByPlan: (planId) => {
                return get().votes.filter((vote) => vote.planId === planId);
            },
        }),
        {
            name: 'vote-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                votes: state.votes,
            }),
        }
    )
);

export default useVoteStore;
