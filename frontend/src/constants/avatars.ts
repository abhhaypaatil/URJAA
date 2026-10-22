import React from 'react';

export interface CuratedAvatar {
  id: string;
  name: string;
  archetype: string;
  description: string;
  accentColor: string;
  gradient: [string, string];
}

export const CURATED_AVATARS: CuratedAvatar[] = [
  {
    id: 'solar-bloom',
    name: 'Solar Bloom',
    archetype: 'Radiant Energy & Vitality',
    description: 'Golden warmth and blossoming botanicals celebrating life-force and stamina.',
    accentColor: '#E8AFC1',
    gradient: ['#F6DCE7', '#E8AFC1'],
  },
  {
    id: 'lunar-lotus',
    name: 'Lunar Lotus',
    archetype: 'Restorative Grace & Serenity',
    description: 'Calming pistachio and aquatic sky blue symbolizing rhythmic flow and deep peace.',
    accentColor: '#D9EBCB',
    gradient: ['#D9EBCB', '#D5EAF8'],
  },
  {
    id: 'celestial-sage',
    name: 'Celestial Sage',
    archetype: 'Intuitive Balance & Mindfulness',
    description: 'Soft lavender nebula and cosmic starlight honoring mindful introspection.',
    accentColor: '#D9CFF2',
    gradient: ['#D9CFF2', '#c5b4e8'],
  },
  {
    id: 'botanical-flora',
    name: 'Botanical Flora',
    archetype: 'Grounded Growth & Nourishment',
    description: 'Fresh meadow greens and gentle blush petals grounded in cyclical renewal.',
    accentColor: '#D9EBCB',
    gradient: ['#F6DCE7', '#D9EBCB'],
  },
  {
    id: 'aurora-wave',
    name: 'Aurora Wave',
    archetype: 'Dynamic Movement & Flow',
    description: 'Pastel sky blue and rose ribbons capturing kinetic energy and agility.',
    accentColor: '#D5EAF8',
    gradient: ['#D5EAF8', '#E8AFC1'],
  },
  {
    id: 'zenith-pulse',
    name: 'Zenith Pulse',
    archetype: 'Inner Alignment & Harmony',
    description: 'Warm peach and ivory mandalas reflecting core stability and holistic centeredness.',
    accentColor: '#F8E6D3',
    gradient: ['#FFF9F6', '#F8E6D3'],
  },
];

export const getAvatarById = (id?: string): CuratedAvatar => {
  const found = CURATED_AVATARS.find((a) => a.id === id);
  return found || CURATED_AVATARS[0];
};
