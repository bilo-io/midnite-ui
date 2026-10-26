import { Wordmark } from '@bilo-io/ui';

export default function WordmarkSizes() {
  return (
    <div className="flex flex-col items-start gap-5">
      <Wordmark product="UI" className="text-base" />
      <Wordmark product="Studio" className="text-3xl" />
      <Wordmark className="text-6xl" />
    </div>
  );
}
