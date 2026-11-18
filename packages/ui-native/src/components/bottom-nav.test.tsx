import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Text } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

import { badgeText, BottomNav, type BottomNavItem } from './bottom-nav';

const items: BottomNavItem[] = [
  { key: 'history', label: 'History', icon: <Text>H</Text> },
  { key: 'tasks', label: 'Tasks', icon: <Text>T</Text>, badge: 140 },
  { key: 'reviews', label: 'Reviews', icon: <Text>R</Text>, badge: true },
];

function Controlled({ onChange }: { onChange?: (k: string) => void }) {
  const [active, setActive] = useState('history');
  return (
    <BottomNav
      items={items}
      activeKey={active}
      onChange={(k) => {
        setActive(k);
        onChange?.(k);
      }}
    />
  );
}

describe('BottomNav', () => {
  it('is a tab list with the active tab selected, and changes on press', () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'Reviews, new' }));
    expect(onChange).toHaveBeenCalledWith('reviews');
    expect(screen.getByRole('tab', { name: 'Reviews, new' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'false');
  });

  it('clamps a numeric badge at 99+ and draws a dot for true', () => {
    render(<Controlled />);
    expect(screen.getByText('99+')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tasks, 99+' })).toBeInTheDocument();
    expect(screen.getByTestId('reviews-badge')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Reviews, new' })).toBeInTheDocument();
    expect(badgeText(7)).toBe('7');
    expect(badgeText(99)).toBe('99');
    expect(badgeText(100)).toBe('99+');
    expect(badgeText(0)).toBeNull();
    expect(badgeText(true)).toBeNull();
  });

  it('hides labels but keeps tab names', () => {
    render(<BottomNav items={items} activeKey="history" onChange={() => {}} hideLabels />);
    expect(screen.queryByText('History')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'History' })).toBeInTheDocument();
  });

  it('hands a render-function icon the ink for its state', () => {
    const icon = vi.fn(() => null);
    render(
      <BottomNav items={[{ key: 'a', label: 'A', icon }]} activeKey="a" onChange={() => {}} />,
    );
    expect(icon).toHaveBeenCalledWith(expect.objectContaining({ focused: true }));
  });
});
