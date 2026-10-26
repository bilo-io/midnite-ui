import { RadialGauge } from '@bilo-io/ui';

const GB = 1024 ** 3;

export default function Disk() {
  return <RadialGauge usedBytes={472 * GB} totalBytes={512 * GB} />;
}
