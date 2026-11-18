import { View } from 'react-native';

import { Avatar } from '@bilo-io/ui-native';

export default function Sizes() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Avatar name="Ada Lovelace" size={24} />
      <Avatar name="bilo-io" size={32} />
      <Avatar name="Grace Hopper" size={40} />
    </View>
  );
}
