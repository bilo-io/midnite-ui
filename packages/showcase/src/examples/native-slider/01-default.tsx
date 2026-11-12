import { useState } from 'react';

import { Slider } from '@bilo-io/ui-native';

export default function Default() {
  const [volume, setVolume] = useState(40);
  return <Slider label="Volume" value={volume} onValueChange={setVolume} />;
}
