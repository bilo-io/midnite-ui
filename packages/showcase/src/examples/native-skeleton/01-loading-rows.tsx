import { View } from 'react-native';

import { Skeleton } from '@bilo-io/ui-native';

export default function LoadingRows() {
  return (
    <View style={{ gap: 20 }}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Skeleton width={10} height={10} radius={5} />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="70%" height={12} />
            <Skeleton width="40%" height={10} />
          </View>
        </View>
      ))}
    </View>
  );
}
