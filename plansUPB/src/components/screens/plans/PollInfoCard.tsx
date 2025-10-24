import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from '@ui-kitten/components';
import { useThemeColors } from '@hooks/useThemeColors';
import { Poll } from '@interfaces/vote.interfaces';
import { formatSimpleDateHour } from '@utils/formatDate';

interface PollInfoCardProps {
    poll: Poll;
}

export default function PollInfoCard({ poll }: PollInfoCardProps) {
    const { colors } = useThemeColors();

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    const getCloseInfo = () => {
        if (poll.closeCriteria === 'deadline' && poll.closesAt) {
            return formatSimpleDateHour(poll.closesAt);
        }
        if (poll.closeCriteria === 'quorum' && poll.quorumCount) {
            return `${totalVotes}/${poll.quorumCount} votos`;
        }
        return 'Sin fecha de cierre';
    };

    return (
        <Card style={styles.card} status={poll.isOpen ? 'info' : 'basic'}>
            <View style={styles.header}>
                <Icon
                    name="question-mark-circle-outline"
                    pack="eva"
                    fill={poll.isOpen ? colors.primary : colors.muted}
                    style={styles.icon}
                />
                <View style={{ flex: 1 }}>
                    <Text category="s1" style={{ color: colors.text }}>
                        Votación
                    </Text>
                    {!poll.isOpen && (
                        <Text category="c1" style={{ color: colors.error }}>
                            Cerrada
                        </Text>
                    )}
                </View>
            </View>

            <Text category="p1" style={{ color: colors.text, marginBottom: 8 }}>
                {poll.question}
            </Text>

            <View style={styles.footer}>
                <View style={styles.infoItem}>
                    <Icon
                        name="people-outline"
                        pack="eva"
                        fill={colors.subtitle}
                        style={styles.smallIcon}
                    />
                    <Text category="c1" style={{ color: colors.subtitle, marginLeft: 4 }}>
                        {totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}
                    </Text>
                </View>

                {(poll.closeCriteria === 'deadline' || poll.closeCriteria === 'quorum') && (
                    <View style={styles.infoItem}>
                        <Icon
                            name={poll.closeCriteria === 'deadline' ? 'clock-outline' : 'checkmark-circle-outline'}
                            pack="eva"
                            fill={colors.subtitle}
                            style={styles.smallIcon}
                        />
                        <Text category="c1" style={{ color: colors.subtitle, marginLeft: 4 }}>
                            {getCloseInfo()}
                        </Text>
                    </View>
                )}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallIcon: {
        width: 16,
        height: 16,
    },
});
