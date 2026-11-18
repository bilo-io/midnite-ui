import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AppBar,
  Avatar,
  BottomNav,
  IconButton,
  ListRow,
  Sheet,
  SpeedDial,
  useTheme,
} from '@bilo-io/ui-native';

const commits = [
  ['feat(app): switch selected repo from the title', '2d4626d', '2h'],
  ['Merge pull request #1240', 'ce3a70b', '5h'],
  ['fix(terminal): group sessions by repo', '9a1f0b2', '1d'],
  ['docs: Phase 146 — Midnite Mobile', '4c858148', '2d'],
];

export default function Shell() {
  const theme = useTheme();
  const [tab, setTab] = useState('history');
  const [dial, setDial] = useState(false);
  const [panel, setPanel] = useState(false);
  const glyph =
    (g: string) =>
    ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>{g}</Text>;
  const ink = (g: string, color = theme.colors.secondaryForeground) => (
    <Text style={{ color, fontSize: 18 }}>{g}</Text>
  );
  return (
    <View style={{ flex: 1, minHeight: 720, margin: -20 }}>
      <AppBar
        title="bilo-io/midnite-studio ▾"
        subtitle="⎇ main"
        onTitlePress={() => {}}
        leading={
          <IconButton
            icon={ink('◧', theme.colors.foreground)}
            label="Open forge panel"
            onPress={() => setPanel(true)}
          />
        }
        trailing={<Avatar name="bilo-io" size={32} />}
      />
      <View style={{ flex: 1 }}>
        <ScrollView>
          {commits.map(([subject, sha, age]) => (
            <ListRow
              key={sha}
              title={subject!}
              subtitle={`bilo-io · ${age}`}
              meta={sha}
              onPress={() => {}}
            />
          ))}
        </ScrollView>
        <SpeedDial
          open={dial}
          onOpenChange={setDial}
          icon={ink('+', theme.colors.primaryForeground)}
          label="Quick actions"
          actions={[
            { key: 'issue', label: 'New issue', icon: ink('+'), onPress: () => {} },
            { key: 'repo', label: 'Switch repo', icon: ink('⇆'), onPress: () => {} },
            { key: 'notes', label: 'Notes', icon: ink('✎'), onPress: () => {}, disabled: true },
          ]}
        />
      </View>
      <BottomNav
        activeKey={tab}
        onChange={setTab}
        insetBottom={20}
        items={[
          { key: 'history', label: 'History', icon: glyph('⌾') },
          { key: 'tasks', label: 'Tasks', icon: glyph('▦'), badge: 4 },
          { key: 'reviews', label: 'Reviews', icon: glyph('⇄'), badge: true },
          { key: 'agents', label: 'Agents', icon: glyph('⚙') },
          { key: 'more', label: 'More', icon: glyph('⋯') },
        ]}
      />
      <Sheet open={panel} onOpenChange={setPanel} side="left" title="Forge" modal={false}>
        <ListRow title="bilo-io" subtitle="github.com" leading={<Avatar name="bilo-io" />} />
        <ListRow title="Add account" onPress={() => {}} />
      </Sheet>
    </View>
  );
}
