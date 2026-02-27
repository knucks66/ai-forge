'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/stores/useAppStore';
import { useModels } from '@/lib/hooks/useModels';
import dynamic from 'next/dynamic';

// Lazy-load heavy panels for better initial load
const ImagePanel = dynamic(
  () => import('@/components/image/ImagePanel').then((m) => ({ default: m.ImagePanel })),
  { loading: () => <PanelSkeleton /> }
);
const TextPanel = dynamic(
  () => import('@/components/text/TextPanel').then((m) => ({ default: m.TextPanel })),
  { loading: () => <PanelSkeleton /> }
);
const AudioPanel = dynamic(
  () => import('@/components/audio/AudioPanel').then((m) => ({ default: m.AudioPanel })),
  { loading: () => <PanelSkeleton /> }
);
const VideoPanel = dynamic(
  () => import('@/components/video/VideoPanel').then((m) => ({ default: m.VideoPanel })),
  { loading: () => <PanelSkeleton /> }
);
const GalleryPanel = dynamic(
  () => import('@/components/gallery/GalleryPanel').then((m) => ({ default: m.GalleryPanel })),
  { loading: () => <PanelSkeleton /> }
);
const ComparisonPanel = dynamic(
  () => import('@/components/comparison/ComparisonPanel').then((m) => ({ default: m.ComparisonPanel })),
  { loading: () => <PanelSkeleton /> }
);

function PanelSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 skeleton rounded-xl" />
      <div className="h-12 skeleton rounded-xl w-3/4" />
      <div className="h-64 skeleton rounded-xl" />
    </div>
  );
}

export default function Home() {
  const activeMode = useAppStore((s) => s.activeMode);

  // Initialize dynamic model fetching on app load
  useModels();

  return (
    <AppShell>
      {activeMode === 'image' && <ImagePanel />}
      {activeMode === 'text' && <TextPanel />}
      {activeMode === 'audio' && <AudioPanel />}
      {activeMode === 'video' && <VideoPanel />}
      {activeMode === 'gallery' && <GalleryPanel />}
      {activeMode === 'compare' && <ComparisonPanel />}
    </AppShell>
  );
}
