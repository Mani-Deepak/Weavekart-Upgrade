export const products = [
  // MEN - T-Shirts
  {
    id: '1',
    name: 'Premium Cotton Slim Fit T-Shirt',
    category: 'Men',
    subCategory: 'T-Shirts',
    gender: 'Men',
    rating: 4.6,
    reviewCount: 124,
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
    description: 'Elevate your casual wardrobe with this premium cotton t-shirt. Designed for comfort and style with a modern slim fit cut.',
    madeIn: 'India',
    addedOn: 'Oct 24, 2025',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: [
        { name: 'S', stock: 12 },
        { name: 'M', stock: 4, label: 'Low Stock' },
        { name: 'L', stock: 20 },
        { name: 'XL', stock: 0 }
    ],
    colors: [
         { name: 'Navy', class: 'bg-blue-900' },
         { name: 'Black', class: 'bg-black' }
    ],
    metadata: {
      fabric: { fabric_type: '100% Cotton', fit_type: 'Slim Fit', sleeve_type: 'Half Sleeve' },
      material: { composition: '100% Cotton', care: 'Machine Wash' },
      style: { style_chips: ['Casual', 'Everyday'], places: ['College'], season: ['Summer'] },
      other: { pattern: 'Solid' }
    }
  },
  // MEN - Jackets
  {
    id: '2',
    name: 'Vintage Denim Jacket',
    category: 'Men',
    subCategory: 'Jackets',
    gender: 'Men',
    rating: 4.8,
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600',
    description: 'A classic vintage denim jacket that gets better with time.',
    madeIn: 'Turkey',
    addedOn: 'Nov 01, 2025',
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1620799140408-ed5341cdb48d?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Blue', class: 'bg-blue-600' }],
    metadata: {
        fabric: { fabric_type: 'Denim', fit_type: 'Regular', sleeve_type: 'Long Sleeve' },
        material: { composition: '100% Cotton', care: 'Machine Wash' },
        style: { style_chips: ['Vintage', 'Rough'], places: ['Outdoor', 'Travel'], season: ['Winter', 'Fall'] },
        other: { pattern: 'Washed' }
    }
  },
  // WOMEN - Dresses
  {
    id: '3',
    name: 'Floral Summer Dress',
    category: 'Women',
    subCategory: 'Dresses',
    gender: 'Women',
    rating: 4.9,
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
    description: 'Light and breezy floral dress perfect for summer outings.',
    madeIn: 'Vietnam',
    addedOn: 'Dec 10, 2025',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['XS', 'S', 'M'],
    colors: [{ name: 'Pink', class: 'bg-pink-300' }],
    metadata: {
        fabric: { fabric_type: 'Chiffon', fit_type: 'Fluid', sleeve_type: 'Sleeveless' },
        material: { composition: 'Polyester Blend', care: 'Hand Wash' },
        style: { style_chips: ['Boho', 'Summer'], places: ['Beach', 'Brunch'], season: ['Summer'] },
        other: { pattern: 'Floral' }
    }
  },
  // WOMEN - Tops
  {
    id: '4',
    name: 'Chic Beige Blazer',
    category: 'Women',
    subCategory: 'Outerwear',
    gender: 'Women',
    rating: 4.7,
    price: 4599,
    originalPrice: 6999,
    discount: 34,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
    description: 'A sophisticated beige blazer for the modern woman.',
    madeIn: 'Italy',
    addedOn: 'Jan 05, 2026',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Beige', class: 'bg-orange-100' }],
    metadata: {
        fabric: { fabric_type: 'Linen', fit_type: 'Structured', sleeve_type: 'Long Sleeve' },
        material: { composition: 'Linen Blend', care: 'Dry Clean Only' },
        style: { style_chips: ['Formal', 'Chic'], places: ['Office', 'Meeting'], season: ['All'] },
        other: { pattern: 'Solid' }
    }
  },
  // ACCESSORIES
  {
    id: '5',
    name: 'Leather Weekend Bag',
    category: 'Accessories',
    subCategory: 'Bags',
    gender: 'Unisex',
    rating: 4.8,
    price: 8999,
    originalPrice: 12000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    description: 'Premium leather weekend bag for your short trips.',
    madeIn: 'India',
    addedOn: 'Oct 15, 2025',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['One Size'],
    colors: [{ name: 'Brown', class: 'bg-amber-800' }],
    metadata: {
        fabric: { fabric_type: 'Leather', fit_type: 'N/A', sleeve_type: 'N/A' },
        material: { composition: 'Genuine Leather', care: 'Leather Cleaner' },
        style: { style_chips: ['Travel', 'Luxury'], places: ['Travel'], season: ['All'] },
        other: { pattern: 'Textured' }
    }
  },
  // SNEAKERS
  {
    id: '6',
    name: 'Urban Street Sneakers',
    category: 'Footwear',
    subCategory: 'Sneakers',
    gender: 'Unisex',
    rating: 4.5,
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600',
    description: 'High-top street sneakers with superior cushioning.',
    madeIn: 'China',
    addedOn: 'Sep 20, 2025',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600'
    ],
    sizes: ['7', '8', '9', '10', '11'],
    colors: [{ name: 'White', class: 'bg-white' }],
    metadata: {
        fabric: { fabric_type: 'Mesh/Leather', fit_type: 'Regular', sleeve_type: 'N/A' },
        material: { composition: 'Synthetic', care: 'Wipe Clean' },
        style: { style_chips: ['Street', 'Sporty'], places: ['Casual', 'Gym'], season: ['All'] },
        other: { pattern: 'Colorblock' }
    }
  }
];
