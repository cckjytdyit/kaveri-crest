export type Product = {
  id: number;
  name: string;
  type: 'Filter Coffee' | 'Arabica' | 'Blend' | 'Single Origin';
  roast: 'Light' | 'Medium' | 'Dark';
  strength: 'Mild' | 'Medium' | 'Strong';
  price: number;
  rating: number;
  reviews: number;
  desc: string;
  ingredients: string;
  brew: string;
  visual: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Filter Coffee',
    type: 'Filter Coffee',
    roast: 'Medium',
    strength: 'Medium',
    price: 380,
    rating: 4.5,
    reviews: 128,
    desc: 'Our everyday South Indian style filter coffee — balanced, smooth, and easy to brew fresh every morning.',
    ingredients: '100% Coffee (Arabica & Robusta blend)',
    brew: 'Add 2 tsp to filter, add hot water, let drip 5-8 min. Mix with hot milk to taste.',
    visual: 'sunset',
  },
  {
    id: 2,
    name: 'Premium Arabica',
    type: 'Arabica',
    roast: 'Light',
    strength: 'Mild',
    price: 450,
    rating: 4.8,
    reviews: 203,
    desc: '100% pure Arabica beans with a light, fruity aroma. Best enjoyed black or with a splash of milk.',
    ingredients: '100% Arabica Coffee',
    brew: 'Use 1.5 tsp per cup with a filter or French press for a cleaner cup.',
    visual: 'cream',
  },
  {
    id: 3,
    name: 'Strong South Indian Blend',
    type: 'Blend',
    roast: 'Dark',
    strength: 'Strong',
    price: 340,
    rating: 4.6,
    reviews: 167,
    desc: 'A bold, chicory-forward blend built for strong decoction and generous milk — the classic tumbler cup.',
    ingredients: 'Coffee (80%), Chicory (20%)',
    brew: 'Add 3 tsp to filter, brew for 8-10 min for a strong decoction.',
    visual: 'mocha',
  },
  {
    id: 4,
    name: 'Dark Roast Coffee',
    type: 'Single Origin',
    roast: 'Dark',
    strength: 'Strong',
    price: 420,
    rating: 4.7,
    reviews: 142,
    desc: 'Single-origin beans roasted dark for a deep, smoky body that holds up well in cold brew too.',
    ingredients: '100% Single Origin Coffee',
    brew: 'Use 2 tsp per cup; works for filter, French press, or cold brew (12hr steep).',
    visual: 'forest',
  },
  {
    id: 5,
    name: 'Mild Morning Roast',
    type: 'Arabica',
    roast: 'Light',
    strength: 'Mild',
    price: 400,
    rating: 4.4,
    reviews: 89,
    desc: 'A gentle, easy-drinking light roast for slow mornings — subtle sweetness, low bitterness.',
    ingredients: '100% Arabica Coffee',
    brew: '1.5 tsp per cup, brew 4-6 min in filter.',
    visual: 'latte',
  },
  {
    id: 6,
    name: 'Chicory Classic Blend',
    type: 'Blend',
    roast: 'Medium',
    strength: 'Medium',
    price: 300,
    rating: 4.3,
    reviews: 76,
    desc: 'An affordable daily blend with a touch of chicory for extra body without overpowering the coffee.',
    ingredients: 'Coffee (85%), Chicory (15%)',
    brew: '2 tsp per cup, brew 6-8 min in filter.',
    visual: 'cocoa',
  },
  {
    id: 7,
    name: 'Estate Reserve Dark',
    type: 'Single Origin',
    roast: 'Dark',
    strength: 'Strong',
    price: 520,
    rating: 4.9,
    reviews: 211,
    desc: 'Limited batch, single-estate dark roast with rich, resinous notes for the serious coffee drinker.',
    ingredients: '100% Single Estate Coffee',
    brew: '2 tsp per cup, brew 6-8 min. Best without sugar to taste the roast.',
    visual: 'midnight',
  },
  {
    id: 8,
    name: 'Everyday Filter Mix',
    type: 'Filter Coffee',
    roast: 'Medium',
    strength: 'Mild',
    price: 280,
    rating: 4.2,
    reviews: 54,
    desc: 'Our most budget-friendly filter blend, made for families who drink coffee multiple times a day.',
    ingredients: 'Coffee (75%), Chicory (25%)',
    brew: '3 tsp per cup, brew 8 min for a milder cup.',
    visual: 'bean',
  },
];
