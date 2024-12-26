import { Ionicons } from "@expo/vector-icons";

export const icon = {
  index: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="home" size={24} color="#ffffff" />
    ) : (
      <Ionicons name="home-outline" size={24} color={color} />
    ),
  stats: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="stats-chart" size={25} color={color} />
    ) : (
      <Ionicons name="stats-chart-outline" size={25} color={color} />
    ),
  timer: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="stopwatch" size={22} color={color} />
    ) : (
      <Ionicons name="stopwatch-outline" size={22} color={color} />
    ),
  settings: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="cog" size={24} color={color} />
    ) : (
      <Ionicons name="cog-outline" size={24} color={color} />
    ),
};
