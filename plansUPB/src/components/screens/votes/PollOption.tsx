import React from 'react';
import { View } from 'react-native';
import { CheckBox, Text, ProgressBar } from '@ui-kitten/components';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSequence, 
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useThemeColors } from '@hooks/useThemeColors';

interface PollOptionProps {
    option: {
        id: string;
        text: string;
        votes: number;
    };
    checked: boolean;
    onPress: () => void;
    disabled: boolean;
    totalVotes: number;
    isWinning: boolean;
    showResults: boolean;
}

export default function PollOption({ 
    option, 
    checked, 
    onPress, 
    disabled, 
    totalVotes,
    isWinning,
    showResults
}: PollOptionProps) {
    const { colors } = useThemeColors();
    const scale = useSharedValue(1);
    const checkboxScale = useSharedValue(1);
    
    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;

    const handlePress = () => {
        if (disabled) return;
        
        checkboxScale.value = withSequence(
            withSpring(0.85, { damping: 10 }),
            withSpring(1.15, { damping: 10 }),
            withSpring(1, { damping: 10 })
        );
        
        scale.value = withSequence(
            withTiming(0.98, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );
        
        onPress();
    };
    
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));
    
    const checkboxAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkboxScale.value }]
    }));

    return (
        <Animated.View style={[containerAnimatedStyle, { marginBottom: 12 }]}>
            <View
                style={{
                    backgroundColor: checked 
                        ? colors.primary + '15' 
                        : colors.surface,
                    borderRadius: 8,
                    borderWidth: checked ? 2 : 1,
                    borderColor: checked ? colors.primary : colors.border,
                    overflow: 'hidden'
                }}
            >
                {showResults && (
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${percentage}%`,
                            backgroundColor: isWinning 
                                ? colors.success + '20' 
                                : colors.primary + '10',
                            borderRadius: 8,
                        }}
                    />
                )}
                
                <View style={{ padding: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Animated.View style={[checkboxAnimatedStyle, { flex: 1 }]}>
                            <CheckBox
                                checked={checked}
                                onChange={handlePress}
                                disabled={disabled}
                                style={{ marginRight: 8 }}
                            >
                                <Text 
                                    style={{ 
                                        color: colors.text,
                                        fontWeight: checked ? '600' : '400',
                                        marginLeft: 8
                                    }}
                                >
                                    {option.text}
                                </Text>
                            </CheckBox>
                        </Animated.View>
                        
                        {showResults && (
                            <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                                <Text 
                                    category="s1" 
                                    style={{ 
                                        color: isWinning ? colors.success : colors.subtitle,
                                        fontWeight: isWinning ? '700' : '600'
                                    }}
                                >
                                    {percentage.toFixed(0)}%
                                </Text>
                                <Text category="c1" style={{ color: colors.subtitle }}>
                                    {option.votes} {option.votes === 1 ? 'voto' : 'votos'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}
