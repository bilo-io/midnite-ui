import { useState } from 'react';

import { PasscodePad } from '@bilo-io/ui';

export default function SetPasscode() {
  const [code, setCode] = useState<string | null>(null);
  return code ? (
    <p className="text-sm">Passcode set to {code}.</p>
  ) : (
    <PasscodePad mode="set" autoFocus={false} onSuccess={setCode} />
  );
}
