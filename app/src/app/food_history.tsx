import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { Feather } from "@expo/vector-icons";

import {
  formatDaysAgo,
  getFoodHistory,
  type FoodHistory,
} from "@/lib/food_history";
import { Colors, Fonts } from "@/constants/theme";
import { RotationGestureHandler } from "react-native-gesture-handler";

const handleBack = () => {
  if (router.canGoBack()) router.back();
  else router.replace("/home");
};

export default function FoodHistoryScreen() {
  const { width, height } = useWindowDimensions();

  const calcFontSize = () => {
    if (width >= 400) return 27;
    else if (width >= 380) return 25;
    else return 23;
  };

  const PAGE_SIZE = 50;

  const [meals, setMeals] = useState<FoodHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);
  const hasMore = meals.length < totalCount;

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();

      getFoodHistory(50, 0, controller.signal)
        .then((data) => {
          setMeals(data.items);
          setTotalCount(data.total_count);
          setError(null);
        })
        .catch((e) => {
          if (controller.signal.aborted) return;
          setError(
            e instanceof Error ? e.message : "기록을 불러오지 못했어요.",
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });

      return () => controller.abort();
    }, []),
  );

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setMoreError(false);
    try {
      const data = await getFoodHistory(PAGE_SIZE, meals.length);
      setMeals((prev) => {
        const ids = new Set(prev.map((meal) => meal.id));
        return [...prev, ...data.items.filter((meal) => !ids.has(meal.id))];
      });
      setTotalCount(data.total_count);
    } catch {
      setMoreError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Feather name="arrow-left" size={22} />
        </Pressable>
        <Text style={[styles.headerTitle, { fontSize: calcFontSize() }]}>
          내가 먹은 음식 모아보기
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.page} bounces={false}>
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Text style={styles.whenText}>{error}</Text>
          ) : meals.length === 0 ? (
            <Text style={styles.whenText}>아직 먹은 음식 기록이 없어요.</Text>
          ) : (
            meals.map((meal) => (
              <FoodList
                key={meal.id}
                menu={meal.menu_name}
                when={formatDaysAgo(meal.eaten_at)}
              />
            ))
          )}
          {!loading && !error && hasMore && (
            <Pressable
              style={styles.moreButton}
              onPress={handleLoadMore}
              disabled={loadingMore}
            >
              <Text style={styles.moreButtonText}>
                {loadingMore
                  ? "불러오는 중..."
                  : moreError
                    ? "불러오지 못했어요. 다시 시도"
                    : "더보기"}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type FoodListProps = {
  menu: string;
  place?: string;
  when: string;
};

function FoodList({ menu, place, when }: FoodListProps) {
  return (
    <>
      <View style={styles.itemSec}>
        <View style={styles.menuSec}>
          <Text style={styles.menuText} numberOfLines={1}>
            {menu}
          </Text>
          <Text style={styles.placeText} numberOfLines={1}>
            {place != null ? `in ${place}` : ""}
          </Text>
        </View>
        <Text style={styles.whenText}>{when}</Text>
      </View>
      <View style={styles.hairline} />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 23,
    paddingTop: 27,
    paddingBottom: 27,
    alignItems: "center",
    gap: 28,
    width: "100%",
    maxWidth: 352 + 23 * 2,
    alignSelf: "center",
  },
  headerTitle: {
    fontFamily: Fonts.nonpreferencefood,
    fontSize: 27,
  },
  backButton: {
    height: 58,
    width: 55,
    borderRadius: 100,
    backgroundColor: "#F0EFE3",
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    flexGrow: 1,
    paddingHorizontal: 23,
    paddingVertical: 16,
    alignItems: "center",
    // paddingTop: 129,
  },
  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 352,
    alignItems: "center",
  },
  itemSec: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  menuSec: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 11,
  },
  menuText: {
    fontFamily: Fonts.nonpreferencefood,
    fontSize: 25,
    flexShrink: 0,
  },
  placeText: {
    fontFamily: Fonts.nonpreferencefood,
    fontSize: 17,
    flexShrink: 1,
  },
  whenText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.textSecondary,
    flexShrink: 0,
  },
  hairline: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: Colors.backGrey,
    marginBottom: 20,
  },
  moreButton: {
    width: "100%",
    alignItems: "center",
    // 디자인 필요
  },
  moreButtonText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
