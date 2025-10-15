import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { Icon, Text } from '@ui-kitten/components';
import { Poll } from "@interfaces/vote.interfaces";
import { useThemeColors } from '@hooks/useThemeColors';
import PollCard from './PollCard';

function PollList({ polls }: { polls: Poll[] }) {
    const { colors } = useThemeColors();

    const renderPollCard = ({ item }: { item: Poll }) => {
        return (
            <PollCard poll={item} />
        );
    };

    const listEmpty = useMemo(() => {
        return (
            <View style={{ alignItems: 'center', padding: 40, justifyContent: 'center' }}>
                <Icon
                    name="bar-chart-outline"
                    pack="eva"
                    fill={colors.muted}
                    style={{ width: 64, height: 64, marginBottom: 16 }}
                />
                <Text category="p1" style={{ color: colors.muted, textAlign: 'center' }}>
                    Al parecer todavía no hay encuestas...
                </Text>
            </View>
        );
    }, [polls]);

    return (
        <FlatList
            data={polls}
            renderItem={renderPollCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={listEmpty}
        />
    );
}

export default PollList;
