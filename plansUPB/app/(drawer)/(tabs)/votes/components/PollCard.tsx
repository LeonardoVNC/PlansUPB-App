import React, { useState } from 'react';
import { Card, Divider, Text, ProgressBar, CheckBox, Icon } from '@ui-kitten/components';
import { View, TouchableOpacity } from 'react-native';
import { Poll } from '../../../../../src/interfaces/vote.interfaces';
import { useThemeColors } from '../../../../../src/hooks/useThemeColors';
import { formatFullDateHour } from '../../../../../src/utils/formatDate';
import { usePolls } from '../../../../../src/hooks/usePolls';

export default function PollCard({ poll }: { poll: Poll }) {
    const { colors } = useThemeColors();
    const { votePoll, unvotePoll, hasUserVoted } = usePolls();
    const [expanded, setExpanded] = useState(false);

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const isClosed = poll.closesAt && new Date() > poll.closesAt;
    const maxVotes = Math.max(...poll.options.map(opt => opt.votes), 0);

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
        <Card
            style={{ marginBottom: 16, borderRadius: 12 }}
            status={isClosed ? 'basic' : 'primary'}
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                    <Text category="h6" style={{ color: colors.text, marginBottom: 4 }}>
                        {poll.question}
                    </Text>
                    {isClosed && (
                        <View style={{ 
                            backgroundColor: colors.danger + '20', 
                            paddingHorizontal: 8, 
                            paddingVertical: 4, 
                            borderRadius: 4,
                            alignSelf: 'flex-start',
                            marginTop: 4,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Icon
                                name="lock"
                                pack="eva"
                                fill={colors.danger}
                                style={{ width: 16, height: 16, marginRight: 4 }}
                            />
                            <Text category="c1" style={{ color: colors.danger, fontWeight: 'bold' }}>
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
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
            </View>

            {poll.description && (
                <>
                    <Divider style={{ marginVertical: 12, backgroundColor: colors.border }} />
                    <Text category="p2" style={{ color: colors.subtitle, marginBottom: 8 }}>
                        {poll.description}
                    </Text>
                </>
            )}

            <Divider style={{ marginVertical: 12, backgroundColor: colors.border }} />

            <View>
                {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? option.votes / totalVotes : 0;
                    const isChecked = hasUserVoted(poll, option.id);
                    const isWinner = option.votes > 0 && option.votes === maxVotes;

                    return (
                        <View key={option.id} style={{ marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <CheckBox
                                    checked={isChecked}
                                    onChange={() => handleVote(option.id)}
                                    disabled={isClosed}
                                    style={{ flex: 1 }}
                                >
                                    <Text 
                                        category="p1" 
                                        style={{ 
                                            color: isWinner ? colors.success : colors.text,
                                            fontWeight: isWinner ? 'bold' : 'normal',
                                            marginLeft: 8
                                        }}
                                    >
                                        {option.text}
                                    </Text>
                                </CheckBox>
                                {expanded && (
                                    <Text category="c1" style={{ color: colors.subtitle, marginLeft: 8 }}>
                                        {option.votes} {option.votes === 1 ? 'voto' : 'votos'}
                                    </Text>
                                )}
                            </View>
                            
                            <View style={{ marginLeft: 32, marginTop: 4 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text category="c1" style={{ color: colors.subtitle }}>
                                        {(percentage * 100).toFixed(1)}%
                                    </Text>
                                </View>
                                <ProgressBar 
                                    progress={percentage} 
                                    status={isWinner ? 'success' : 'danger'}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>

            <Divider style={{ marginTop: 8, marginBottom: 12, backgroundColor: colors.border }} />

            {/* Footer */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                        name="calendar"
                        pack="eva"
                        fill={colors.subtitle}
                        style={{ width: 16, height: 16, marginRight: 4 }}
                    />
                    <Text category="c1" style={{ color: colors.subtitle }}>
                        {formatFullDateHour(poll.createdAt)}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                        name="bar-chart-2"
                        pack="eva"
                        fill={colors.subtitle}
                        style={{ width: 16, height: 16, marginRight: 4 }}
                    />
                    <Text category="c1" style={{ color: colors.subtitle }}>
                        {totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}
                    </Text>
                </View>
            </View>
            {poll.closesAt && !isClosed && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Icon
                        name="clock"
                        pack="eva"
                        fill={colors.primary}
                        style={{ width: 16, height: 16, marginRight: 4 }}
                    />
                    <Text category="c1" style={{ color: colors.danger }}>
                        Cierra: {formatFullDateHour(poll.closesAt)}
                    </Text>
                </View>
            )}
        </Card>
    );
}
