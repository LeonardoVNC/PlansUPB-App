import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Divider, Text, ProgressBar, CheckBox, Icon } from '@ui-kitten/components';
import { usePolls } from '@hooks/usePolls';
import { useThemeColors } from '@hooks/useThemeColors';
import { Poll } from '@interfaces/vote.interfaces';
import { formatFullDateHour } from '@utils/formatDate';

export default function PollCard({ poll }: { poll: Poll }) {
    const { colors } = useThemeColors();
    const { votePoll, unvotePoll, hasUserVoted, updatePoll } = usePolls();
    const [expanded, setExpanded] = useState(false);

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const isClosed = !poll.isOpen;
    const maxVotes = Math.max(...poll.options.map(opt => opt.votes), 0);

    useEffect(() => {
        if (poll.closeCriteria === 'deadline' && poll.closesAt && poll.isOpen) {
            const now = new Date();
            if (now > poll.closesAt) {
                updatePoll(poll.id, { isOpen: false });
            }
        }
    }, [poll.closesAt, poll.isOpen, poll.closeCriteria, poll.id, updatePoll]);

    const handleVote = (optionId: string) => {
        if (isClosed) return;

        if (poll.allowMultiple) {
            const alreadyVoted = hasUserVoted(poll, optionId);
            if (alreadyVoted) {
                unvotePoll(poll.id, optionId);
            } else {
                votePoll(poll.id, optionId);
            }
        } else {
            votePoll(poll.id, optionId);
        }
    };

    return (
        <View style={{ marginBottom: 0 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text category="s1" style={{ color: colors.text, marginBottom: 4 }}>
                        {poll.question}
                    </Text>
                    {isClosed && (
                        <View style={{ 
                            backgroundColor: colors.danger + '20', 
                            paddingHorizontal: 6, 
                            paddingVertical: 2, 
                            borderRadius: 4,
                            alignSelf: 'flex-start',
                            marginTop: 2,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Icon
                                name="lock"
                                pack="eva"
                                fill={colors.danger}
                                style={{ width: 12, height: 12, marginRight: 2 }}
                            />
                            <Text category="c2" style={{ color: colors.danger, fontWeight: 'bold' }}>
                                CERRADA
                            </Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity 
                    onPress={() => setExpanded(!expanded)} 
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        pack="eva"
                        fill={colors.primary}
                        style={{ width: 20, height: 20 }}
                    />
                </TouchableOpacity>
            </View>

            {poll.description && expanded && (
                <Text category="c1" style={{ color: colors.subtitle, marginBottom: 8 }}>
                    {poll.description}
                </Text>
            )}

            <View>
                {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? option.votes / totalVotes : 0;
                    const isChecked = hasUserVoted(poll, option.id);
                    const isWinner = isClosed && option.votes > 0 && option.votes === maxVotes;

                    return (
                        <View key={option.id} style={{ marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <CheckBox
                                        checked={isChecked}
                                        onChange={() => handleVote(option.id)}
                                        disabled={isClosed}
                                    />
                                    <Text 
                                        category="c1" 
                                        style={{ 
                                            color: isWinner ? colors.success : colors.text,
                                            fontWeight: isWinner ? 'bold' : 'normal',
                                            marginLeft: 8,
                                            flex: 1,
                                        }}
                                    >
                                        {option.text}
                                    </Text>
                                    {isWinner && (
                                        <Icon
                                            name="checkmark-circle-2"
                                            pack="eva"
                                            fill={colors.info}
                                            style={{ width: 18, height: 18, marginLeft: 6 }}
                                        />
                                    )}
                                </View>
                                {expanded && (
                                    <Text category="c2" style={{ color: colors.subtitle, marginLeft: 8 }}>
                                        {option.votes}
                                    </Text>
                                )}
                            </View>
                            
                            {expanded && (
                                <View style={{ marginLeft: 32, marginTop: 4 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <Text category="c2" style={{ color: colors.subtitle }}>
                                            {(percentage * 100).toFixed(1)}%
                                        </Text>
                                    </View>
                                    <ProgressBar 
                                        progress={percentage} 
                                        status={isWinner ? 'success' : 'info'}
                                    />
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>

            {/* Footer */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                        name="bar-chart-2"
                        pack="eva"
                        fill={colors.subtitle}
                        style={{ width: 14, height: 14, marginRight: 4 }}
                    />
                    <Text category="c2" style={{ color: colors.subtitle }}>
                        {totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}
                    </Text>
                </View>
                
                {poll.closesAt && !isClosed && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            name="clock"
                            pack="eva"
                            fill={colors.danger}
                            style={{ width: 14, height: 14, marginRight: 4 }}
                        />
                        <Text category="c2" style={{ color: colors.danger }}>
                            {formatFullDateHour(poll.closesAt)}
                        </Text>
                    </View>
                )}
                
                {poll.closeCriteria === 'quorum' && !isClosed && poll.quorumCount && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            name="people"
                            pack="eva"
                            fill={colors.info}
                            style={{ width: 14, height: 14, marginRight: 4 }}
                        />
                        <Text category="c2" style={{ color: colors.info }}>
                            {totalVotes}/{poll.quorumCount}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}
