import { View } from 'react-native';

import { Badge } from '@bilo-io/ui-native';

export default function Tones() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Badge>Draft</Badge>
      <Badge tone="primary">Last used</Badge>
      <Badge tone="success">Approved</Badge>
      <Badge tone="warning">Changes requested</Badge>
      <Badge tone="danger">Checks failed</Badge>
      <Badge tone="info">Open</Badge>
    </View>
  );
}
