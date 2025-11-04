import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Divider, Text, ProgressBar, CheckBox, Icon, Button } from '@ui-kitten/components';
import { usePolls } from '@hooks/usePolls';
import { useThemeColors } from '@hooks/useThemeColors';
import { Poll } from '@interfaces/vote.interfaces';
import { formatFullDateHour } from '@utils/formatDate';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withSequence,
    FadeIn,
    Layout
} from 'react-native-reanimated';

interface PollCardProps {
    poll: Poll;
    canEdit?: boolean;
    onEditPress?: () => void;
}

export default function PollCard({ poll, canEdit = false, onEditPress }: PollCardProps) {
    const { colors } = useThemeColors();
    const { votePoll, unvotePoll, hasUserVoted, updatePoll } = usePolls();
    const [expanded, setExpanded] = useState(false);

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const isClosed = !poll.isOpen;
    const maxVotes = Math.max(...poll.options.map(opt => opt.votes), 0);
    
    const optionScales = useSharedValue<Record<string, number>>(
        poll.options.reduce((acc, opt) => ({ ...acc, [opt.id]: 1 }), {})
    );
    
    const statusScale = useSharedValue(1);
    const statusOpacity = useSharedValue(0);

    useEffect(() => {
        if (isClosed) {
            statusOpacity.value = withSpring(1, { damping: 15 });
            statusScale.value = withSequence(
                withSpring(1.2, { damping: 10 }),
                withSpring(1, { damping: 10 })
            );
        }
    }, [isClosed]);

    const statusBadgeStyle = useAnimatedStyle(() => ({
        opacity: statusOpacity.value,
        transform: [{ scale: statusScale.value }]
    }));

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

        optionScales.value = {
            ...optionScales.value,
            [optionId]: withSequence(
                withSpring(1.05, { damping: 10 }),
                withSpring(1, { damping: 10 })
            )
        };

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
                        <Animated.View 
                            entering={FadeIn.duration(400)}
                            style={[{ 
                                backgroundColor: colors.danger + '20', 
                                paddingHorizontal: 8, 
                                paddingVertical: 4, 
                                borderRadius: 4,
                                alignSelf: 'flex-start',
                                marginTop: 4,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }, statusBadgeStyle]}
                        >
                            <Icon
                                name="lock"
                                pack="eva"
                                fill={colors.danger}
                                style={{ width: 16, height: 16, marginRight: 4 }}
                            />
                            <Text category="c1" style={{ color: colors.danger, fontWeight: 'bold' }}>
                                CERRADA
                            </Text>
                        </Animated.View>
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

            {canEdit && onEditPress && !isClosed && (
                <>
                    <Divider style={{ marginVertical: 12, backgroundColor: colors.border }} />
                    <Button
                        size="small"
                        status="warning"
                        appearance="outline"
                        onPress={onEditPress}
                        accessoryLeft={(props) => <Icon {...props} name="edit-outline" pack="eva" />}
                    >
                        Editar Encuesta
                    </Button>
                </>
            )}

            <Divider style={{ marginVertical: 12, backgroundColor: colors.border }} />

            <View>
                {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? option.votes / totalVotes : 0;
                    const isChecked = hasUserVoted(poll, option.id);
                    const isWinning = totalVotes > 0 && option.votes === maxVotes;
                    const isWinner = isClosed && isWinning;

                    const animatedStyle = useAnimatedStyle(() => ({
                        transform: [{ scale: optionScales.value[option.id] || 1 }]
                    }));

                    return (
                        <Animated.View 
                            key={option.id} 
                            style={[{ marginBottom: 12 }, animatedStyle]}
                            layout={Layout.springify()}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <CheckBox
                                        checked={isChecked}
                                        onChange={() => handleVote(option.id)}
                                        disabled={isClosed}
                                    />
                                    <Text 
                                        category="p1" 
                                        style={{ 
                                            color: isWinner ? colors.success : colors.text,
                                            fontWeight: isWinner ? 'bold' : 'normal',
                                            marginLeft: 8,
                                            flex: 1
                                        }}
                                    >
                                        {option.text}
                                    </Text>
                                    {isWinner && (
                                        <Icon
                                            name="checkmark-circle-2"
                                            pack="eva"
                                            fill={colors.success}
                                            style={{ width: 20, height: 20, marginLeft: 6 }}
                                        />
                                    )}
                                </View>
                                {expanded && (
                                    <Text category="c1" style={{ color: colors.subtitle, marginLeft: 8 }}>
                                        {option.votes} {option.votes === 1 ? 'voto' : 'votos'}
                                    </Text>
                                )}
                            </View>
                            
                            {expanded && (
                                <View style={{ marginLeft: 32, marginTop: 4 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <Text category="c1" style={{ color: colors.subtitle }}>
                                            {(percentage * 100).toFixed(1)}%
                                        </Text>
                                    </View>
                                    <ProgressBar 
                                        progress={percentage} 
                                        status={isWinning ? 'success' : 'danger'}
                                    />
                                </View>
                            )}
                        </Animated.View>
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
