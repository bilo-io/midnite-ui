import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@bilo-io/ui-native';

export default function States() {
  const [saving, setSaving] = useState(false);
  const save = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };
  return (
    <View style={styles.stack}>
      <Button loading={saving} onPress={save}>
        Save changes
      </Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
