import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Divider, Text, ProgressBar, CheckBox, Icon, Button } from '@ui-kitten/components';
import { usePolls } from '@hooks/usePolls';
import { useThemeColors } from '@hooks/useThemeColors';
import { Poll } from '@interfaces/vote.interfaces';
import { formatFullDateHour } from '@utils/formatDate';
import PollOption from './PollOption';

interface PollCardProps {
    poll: Poll;
    canEdit?: boolean;
    onEditPress?: () => void;
}

export default function PollCard({ poll, canEdit = false, onEditPress }: PollCardProps) {
    const { colors } = useThemeColors();
    const { votePoll, unvotePoll, hasUserVoted, updatePoll } = usePolls();
    const [expanded, setExpanded] = useState(false);

    const isValidPoll = poll && 
        poll.options && Array.isArray(poll.options) && poll.options.length > 0 &&
        poll.votes && Array.isArray(poll.votes);

    const totalVotes = isValidPoll ? poll.options.reduce((sum, opt) => sum + (opt?.votes || 0), 0) : 0;
    const isClosed = !poll?.isOpen;
    const maxVotes = isValidPoll ? Math.max(...poll.options.map(opt => opt?.votes || 0), 0) : 0;

    useEffect(() => {
        const checkAndClosePoll = async () => {
            if (poll.closeCriteria === 'deadline' && poll.closesAt && poll.isOpen) {
                const now = new Date();
                if (now > poll.closesAt) {
                    try {
                        await updatePoll(poll.id, { isOpen: false });
                    } catch (error) {
                        console.error('Error al cerrar poll por deadline:', error);
                    }
                }
            }
        };
        
        checkAndClosePoll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poll.closesAt, poll.isOpen, poll.closeCriteria, poll.id]);

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

    if (!isValidPoll) {
        return null;
    }

    return (
        <Card
            style={{ marginBottom: 16, borderRadius: 12 }}
            status={isClosed ? 'basic' : 'primary'}
            disabled
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                    <Text category="h6" style={{ color: colors.text, marginBottom: 4 }}>
                        {poll.question}
                    </Text>
                    {isClosed && (
                        <View 
                            style={{ 
                                backgroundColor: colors.danger + '20', 
                                paddingHorizontal: 8, 
                                paddingVertical: 4, 
                                borderRadius: 4,
                                alignSelf: 'flex-start',
                                marginTop: 4,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
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
                    const isChecked = hasUserVoted(poll, option.id);
                    const isWinning = totalVotes > 0 && option.votes === maxVotes;

                    return (
                        <PollOption
                            key={option.id}
                            option={option}
                            checked={isChecked}
                            onPress={() => handleVote(option.id)}
                            disabled={isClosed}
                            totalVotes={totalVotes}
                            isWinning={isWinning}
                            showResults={expanded}
                        />
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
