import React, { useState } from 'react';
import { View } from 'react-native';
import { TabView, Tab } from '@ui-kitten/components';
import FloatingButton from '@common_components/FloatingButton';
import ScreenTemplate from '@common_components/ScreenTemplate';
import { usePolls } from '@hooks/usePolls';
import CreatePollModal from '@screen_components/votes/CreatePollModal';
import PollList from '@screen_components/votes/PollList';
import { useUserStore } from '@store/useUserStore';

export default function VoteScreen() {
    const { myPolls, allPolls, createPoll } = usePolls();
    const { user } = useUserStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCreatePoll = async (pollData: any) => {
        if (!user) return;
        await createPoll(pollData);
    };

    return (
        <ScreenTemplate omitScroll>
            <TabView
                style={{ flex: 1, marginTop: 8 }}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
            >
                <Tab title="Mis Encuestas">
                    <View style={{ flex: 1, marginTop: 8 }}>
                        <PollList polls={myPolls} />
                    </View>
                </Tab>

                <Tab title="Todas">
                    <View style={{ flex: 1, marginTop: 8 }}>
                        <PollList polls={allPolls} />
                    </View>
                </Tab>
            </TabView>

            <FloatingButton 
                onPress={() => setModalVisible(true)} 
                iconName="plus" 
            />

            <CreatePollModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCreatePoll={handleCreatePoll}
            />
        </ScreenTemplate>
    );
}
