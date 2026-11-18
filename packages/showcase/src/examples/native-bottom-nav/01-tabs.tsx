import { useState } from 'react';
import { Text, View } from 'react-native';

import { BottomNav, type BottomNavItem } from '@bilo-io/ui-native';

const glyph =
  (g: string) =>
  ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>{g}</Text>;

const items: BottomNavItem[] = [
  { key: 'history', label: 'History', icon: glyph('⌾') },
  { key: 'tasks', label: 'Tasks', icon: glyph('▦'), badge: 3 },
  { key: 'reviews', label: 'Reviews', icon: glyph('⇄'), badge: 120 },
  { key: 'agents', label: 'Agents', icon: glyph('⚙') },
  { key: 'more', label: 'More', icon: glyph('⋯'), badge: true },
];

export default function Tabs() {
  const [active, setActive] = useState('history');
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', margin: -20 }}>
      <BottomNav items={items} activeKey={active} onChange={setActive} insetBottom={20} />
    </View>
  );
}
