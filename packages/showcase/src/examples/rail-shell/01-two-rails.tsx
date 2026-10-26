import { useState } from 'react';
import { Brain } from 'lucide-react';

import { RailShell } from '@bilo-io/ui';

export default function TwoRails() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  return (
    <div className="w-full">
      <RailShell
        isMobile={false}
        left={{
          title: 'Sources',
          icon: <Brain className="h-4 w-4" />,
          open: leftOpen,
          onToggle: () => setLeftOpen((o) => !o),
          content: <p className="text-sm text-muted-foreground">Left rail body</p>,
        }}
        right={{
          title: 'Studio',
          open: rightOpen,
          onToggle: () => setRightOpen((o) => !o),
          content: <p className="text-sm text-muted-foreground">Right rail body</p>,
        }}
      >
        <div className="rounded-lg border border-border/60 bg-card/40 p-4 text-sm">
          Center content
        </div>
      </RailShell>
    </div>
  );
}
