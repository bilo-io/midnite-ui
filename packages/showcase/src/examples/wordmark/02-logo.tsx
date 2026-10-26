import { MidniteLogo } from '@bilo-io/ui';

export default function Logo() {
  return (
    <div className="flex flex-wrap items-center gap-10">
      <MidniteLogo product="UI" />
      <MidniteLogo product="Apps" size={40} className="text-xl" />
      <MidniteLogo size={56} markOnly />
    </div>
  );
}
