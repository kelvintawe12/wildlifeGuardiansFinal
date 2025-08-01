import { createBadge } from './badges';

// Free badges to seed
const freeBadges = [
  {
    name: 'Welcome Guardian',
    description: 'Awarded for joining Wildlife Guardians!',
    category: 'free',
    image_url: 'https://placehold.co/100x100?text=Welcome',
    requirements: {},
  },
  {
    name: 'First Quiz',
    description: 'Awarded for attempting your first quiz.',
    category: 'free',
    image_url: 'https://placehold.co/100x100?text=Quiz',
    requirements: {},
  },
  {
    name: 'Explorer',
    description: 'Awarded for viewing 3 animal profiles.',
    category: 'free',
    image_url: 'https://placehold.co/100x100?text=Explorer',
    requirements: {},
  },
];

export async function seedFreeBadges() {
  for (const badge of freeBadges) {
    try {
      await createBadge(badge);
      console.log(`Seeded badge: ${badge.name}`);
    } catch (e) {
      console.error(`Error seeding badge ${badge.name}:`, e);
    }
  }
}

// To run: import and call seedFreeBadges() in a script or dev tool.
