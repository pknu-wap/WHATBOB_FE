import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';

export default function LoginScreen() {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.page} bounces={false}>
                <View style={styles.hero}>
                    <Image
                        source={require('@/assets/images/login-icon.png')}
                        contentFit='contain'
                        style={styles.character}
                    />

                    <Text style={styles.brand}>왓밥</Text>
                    <Text style={styles.question}>오늘 뭐 먹지?</Text>
                    <Text style={styles.description}>왓밥이 더 맛있는 선택을 도와줄게요!</Text>
                </View>

                <View style={[
                    styles.footer,
                    { paddingBottom: Math.max(16, 58 - insets.bottom) },
                ]}>
                    <Pressable
                        accessibilityRole='button'
                        accessibilityLabel='카카오 로그인'
                        disabled
                        style={styles.kakaoButton}>
                            <View style={styles.kakaoIcon}>
                                <View style={styles.kakaoIconTail} />
                            </View>
                            <Text style={styles.kakaoButtonText}>카카오 로그인</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    page: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    hero: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 52,
    },
    character: {
        width: 150.51,
        height: 152.59,
        transform: [{ translateX: 11 }],
    },
    brand: {
        fontFamily: Fonts.brand,
        fontSize: 51.86,
        lineHeight: 67,
        color: Colors.maintext,
        transform: [{ translateX: 5 }],
    },
    question: {
        marginTop: 18,
        fontFamily: Fonts.brand,
        fontSize: 23.83,
        lineHeight: 31,
        color: Colors.textSecondary,
        transform: [{ translateX: 5 }],
    },
    description: {
        marginTop: 18,
        fontFamily: Fonts.bodyBold,
        fontSize: 20.51,
        lineHeight: 24,
        color: Colors.textMuted,
        textAlign: 'center',
        transform: [{ translateX: 5 }],
    },
    footer: {
        alignItems: 'center',
    },
    kakaoButton: {
        width: 290,
        maxWidth: '100%',
        height: 55,
        borderRadius: 30,
        backgroundColor: Colors.kakaoYellow,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8.6,
    },
    kakaoIcon: {
        width: 24,
        height: 20,
        borderRadius: 12,
        backgroundColor: Colors.maintext,
    },
    kakaoIconTail: {
        position: 'absolute',
        left: 4,
        bottom: -2,
        width: 7,
        height: 7,
        backgroundColor: Colors.maintext,
        transform: [{ rotate: '45deg' }],
    },
    kakaoButtonText: {
        fontFamily: Fonts.bodyBold,
        fontSize: 20.27,
        lineHeight: 24,
        color: Colors.maintext,
    }
})