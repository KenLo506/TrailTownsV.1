/**
 * Animal Crossing-inspired custom map style for Google Maps
 * Creates a soft, pastel, cartoon-like aesthetic
 */
export const animalCrossingMapStyle = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [
      {
        saturation: -20,
      },
      {
        lightness: 40,
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#B8E6D9', // Soft mint/cyan water
        saturation: -30,
        lightness: 30,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#E8F5E9', // Soft pastel green
        saturation: -40,
        lightness: 50,
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#FFF9C4', // Soft yellow
        saturation: -50,
        lightness: 60,
      },
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#FFF8E1', // Cream/beige roads
        saturation: -60,
        lightness: 70,
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        lightness: 30,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#FFE082', // Warmer beige for highways
        saturation: -50,
        lightness: 60,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'simplified',
      },
      {
        lightness: 30,
      },
    ],
  },
];

/**
 * Alternative softer style - even more pastel
 */
export const softPastelMapStyle = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [
      {
        saturation: -30,
      },
      {
        lightness: 50,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#C5E1D5', // Very soft mint
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      {
        color: '#F1F8E9', // Very light green
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#FFF9C4', // Soft yellow
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

