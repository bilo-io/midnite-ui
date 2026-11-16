import { useEffect, useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NeuroCloudBackground } from './neuro-cloud-background';

type WeatherKind = 'calm' | 'wind' | 'rain' | 'snow' | 'hail';
type DayPhase = 'night' | 'dawn' | 'day' | 'dusk';

function getDayPhase(hour: number) {
  const sunrise = 6.25;
  const sunset = 18.25;
  const dawnStart = sunrise - 0.75;
  const dawnEnd = sunrise + 0.75;
  const duskStart = sunset - 0.75;
  const duskEnd = sunset + 0.75;

  if (hour >= dawnStart && hour < dawnEnd) {
    const t = (hour - dawnStart) / (dawnEnd - dawnStart);
    return { phase: 'dawn' as DayPhase, starOpacity: 0.45 * (1 - t), sunProgress: t * 0.12, moonProgress: 0 };
  }
  if (hour >= dawnEnd && hour < duskStart) {
    const t = (hour - dawnEnd) / (duskStart - dawnEnd);
    return { phase: 'day' as DayPhase, starOpacity: 0, sunProgress: 0.12 + t * 0.76, moonProgress: 0 };
  }
  if (hour >= duskStart && hour < duskEnd) {
    const t = (hour - duskStart) / (duskEnd - duskStart);
    return { phase: 'dusk' as DayPhase, starOpacity: 0.55 * t, sunProgress: 0.88 + t * 0.12, moonProgress: t * 0.08 };
  }
  const nightSpan = 24 - duskEnd + dawnStart;
  const elapsed = hour >= duskEnd ? hour - duskEnd : 24 - duskEnd + hour;
  const t = Math.max(0, Math.min(1, elapsed / Math.max(1, nightSpan)));
  return { phase: 'night' as DayPhase, starOpacity: 1, sunProgress: 0, moonProgress: t };
}

const SKY_BG: Record<DayPhase, string> = {
  dawn: 'linear-gradient(180deg, #1e1b4b 0%, #7c3aed 40%, #fb923c 100%)',
  day: 'linear-gradient(180deg, #0284c7 0%, #38bdf8 55%, #bae6fd 100%)',
  dusk: 'linear-gradient(180deg, #0f172a 0%, #6366f1 45%, #f472b6 100%)',
  night: 'linear-gradient(180deg, #020617 0%, #0f172a 65%, #1e293b 100%)',
};

function TimeOfDayDemo() {
  const [hour, setHour] = useState(14);
  const [weather, setWeather] = useState<WeatherKind>('calm');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const solar = useMemo(() => getDayPhase(hour), [hour]);
  const hh = String(Math.floor(hour) % 24).padStart(2, '0');
  const mm = String(Math.round((hour % 1) * 60) % 60).padStart(2, '0');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const cloudStrength = solar.phase === 'day' ? 1 : solar.phase === 'dawn' || solar.phase === 'dusk' ? 0.55 : 0;
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };

    const clouds = Array.from({ length: cloudStrength > 0 ? 10 : 0 }, () => ({
      x: Math.random() * 680,
      y: 40 + Math.random() * 220,
      vx: (weather === 'wind' ? 0.85 : 0.24) + Math.random() * 0.25,
      vy: 0,
      r: 70 + Math.random() * 80,
      alpha: 0.1 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
      stretch: 1.4 + Math.random() * 0.5,
    }));

    const pCount = weather === 'rain' ? 60 : weather === 'hail' ? 45 : weather === 'snow' ? 48 : weather === 'wind' ? 24 : 14;
    const particles = Array.from({ length: pCount }, () => ({
      x: Math.random() * 680,
      y: Math.random() * 380,
      vx: weather === 'wind' ? 5 + Math.random() * 4 : weather === 'rain' ? -1.6 : weather === 'hail' ? -1 : (Math.random() - 0.5) * 0.3,
      vy: weather === 'rain' ? 9 + Math.random() * 4 : weather === 'hail' ? 11 + Math.random() * 4 : weather === 'snow' ? 1 + Math.random() : weather === 'wind' ? 0.4 : -0.2,
      size: weather === 'rain' ? 12 : weather === 'wind' ? 32 : 2,
      alpha: 0.25 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      pointer.vx = Math.max(-20, Math.min(20, nx - pointer.x));
      pointer.vy = Math.max(-20, Math.min(20, ny - pointer.y));
      pointer.x = nx;
      pointer.y = ny;
      pointer.active = true;
    };

    const tick = (now: number) => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      const t = now * 0.0015;

      const cloudRgb = solar.phase === 'dawn' ? '254, 215, 170' : solar.phase === 'dusk' ? '244, 180, 212' : '255, 255, 255';
      for (const c of clouds) {
        c.x += c.vx;
        c.y += c.vy + Math.sin(t * 0.55 + c.phase) * 0.12;
        c.vx += ((weather === 'wind' ? 0.9 : 0.26) - c.vx) * 0.02;
        c.vy *= 0.94;
        if (pointer.active) {
          const dx = c.x - pointer.x;
          const dy = c.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          const reach = c.r + 120;
          if (d2 > 1 && d2 < reach * reach) {
            const d = Math.sqrt(d2);
            const f = (1 - d / reach) * 0.7;
            c.vx += (dx / d) * f + pointer.vx * 0.02 * (1 - d / reach);
            c.vy += (dy / d) * f + pointer.vy * 0.02 * (1 - d / reach);
          }
        }
        if (c.x - c.r * c.stretch > w + 80) c.x = -c.r * c.stretch - 40;
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        const a = c.alpha * cloudStrength;
        grad.addColorStop(0, `rgba(${cloudRgb}, ${a.toFixed(3)})`);
        grad.addColorStop(0.55, `rgba(${cloudRgb}, ${(a * 0.45).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${cloudRgb}, 0)`);
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.scale(c.stretch, 1);
        ctx.translate(-c.x, -c.y);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      pointer.vx *= 0.85;
      pointer.vy *= 0.85;

      const strokeRgb = solar.phase === 'day' ? '255, 255, 255' : '226, 232, 240';
      for (const p of particles) {
        p.x += p.vx + (weather === 'snow' ? Math.sin(t + p.phase) * 0.4 : 0);
        p.y += p.vy;
        if (p.y > h + 20) p.y = -15;
        if (p.y < -20) p.y = h + 10;
        if (p.x > w + 40) p.x = -30;
        if (p.x < -40) p.x = w + 30;
        if (weather === 'rain' || weather === 'wind') {
          ctx.strokeStyle = `rgba(${strokeRgb}, ${p.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (weather === 'wind' ? p.size : p.vx * 1.4), p.y + (weather === 'wind' ? p.vy * 3 : p.size));
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${strokeRgb}, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const host = canvas.parentElement;
    host?.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      host?.removeEventListener('pointermove', onMove);
    };
  }, [solar.phase, weather]);

  const showSun = solar.phase !== 'night';
  const orbT = showSun ? solar.sunProgress : solar.moonProgress;
  const orbX = 14 + orbT * 72;
  const orbY = 24 - Math.sin(orbT * Math.PI) * 14;

  return (
    <div className="space-y-4">
      <div
        className="relative h-[380px] w-[680px] max-w-full overflow-hidden rounded-xl border border-border/60"
        style={{ background: SKY_BG[solar.phase] }}
      >
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{
            left: `${orbX.toFixed(1)}%`,
            top: `${orbY.toFixed(1)}%`,
            width: showSun ? 64 : 44,
            height: showSun ? 64 : 44,
            opacity: weather === 'rain' || weather === 'hail' ? 0.35 : 0.75,
            background: showSun
              ? 'radial-gradient(circle, rgba(253,224,71,0.95) 0%, rgba(251,146,60,0.45) 55%, transparent 78%)'
              : 'radial-gradient(circle at 38% 38%, rgba(241,245,249,0.95) 0%, rgba(148,163,184,0.45) 55%, transparent 78%)',
          }}
        />
        <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: solar.starOpacity }}>
          <NeuroCloudBackground animate />
        </div>
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-background/70 px-3 py-1 font-mono text-xs backdrop-blur">
          {hh}:{mm} · {solar.phase} · {weather}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        <label className="flex items-center gap-2 font-mono">
          <span>Hour ({hh}:{mm})</span>
          <input
            type="range"
            min={0}
            max={24}
            step={0.25}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-48"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(['calm', 'wind', 'rain', 'snow', 'hail'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setWeather(kind)}
              className={`rounded-md border px-2.5 py-1 capitalize ${weather === kind ? 'border-primary bg-primary/15 font-semibold' : 'border-border'}`}
            >
              {kind}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/NeuroCloudBackground',
  component: NeuroCloudBackground,
  args: { animate: true },
} satisfies Meta<typeof NeuroCloudBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Starfield: Story = {
  render: () => (
    <div className="relative h-[360px] w-[640px] max-w-full overflow-hidden rounded-xl border border-border/60 bg-background">
      <NeuroCloudBackground animate />
    </div>
  ),
};

export const TimeOfDayMorph: Story = {
  render: () => <TimeOfDayDemo />,
};
