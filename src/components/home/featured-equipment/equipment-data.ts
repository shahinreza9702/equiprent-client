
export interface Equipment {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  rentalUnit: "day" | "hour";
  rating: number;
  image: string;
  featured: boolean;
  description: string;
  owner: {
    name: string;
    rating: number;
    verified: boolean;
  };
}


export const equipmentData: Equipment[] = [

  {
    id: "eq-001",
    name: "Professional Excavator",
    category: "Construction Equipment",
    location: "Dhaka, Bangladesh",
    price: 4500,
    rentalUnit: "day",
    rating: 4.9,
    image: "/images/equipment/excavator.jpg",
    featured: true,
    description:
      "A professional-grade excavator suitable for construction, earthmoving, and other heavy-duty projects.",
    owner: {
      name: "Demo Equipment Owner",
      rating: 4.8,
      verified: true,
    },
  },

  {
    id: "eq-002",
    name: "Canon EOS R5 Camera",
    category: "Photography Equipment",
    location: "Chattogram, Bangladesh",
    price: 2500,
    rentalUnit: "day",
    rating: 4.8,
    image: "/images/equipment/camera.jpg",
    featured: true,
    description: "A high-end mirrorless camera for professional photography.",
    owner: {
      name: "Demo Equipment Owner",
      rating: 4.8,
      verified: true,
    },
  },
  {
    id: "eq-003",
    name: "Toyota Hiace",
    category: "Vehicles & Transportation",
    location: "Dhaka, Bangladesh",
    price: 6000,
    rentalUnit: "day",
    rating: 4.7,
    image: "/images/equipment/hiace.jpg",
    featured: true,
    description: "A reliable van for transportation and cargo needs.",
    owner: {
      name: "Demo Equipment Owner",
      rating: 4.7,
      verified: true,
    },
  },
  {
    id: "eq-004",
    name: "Heavy Duty Power Generator",
    category: "Electronics",
    location: "Sylhet, Bangladesh",
    price: 1800,
    rentalUnit: "day",
    rating: 4.9,
    image: "/images/equipment/generator.jpg",
    featured: true,
    description: "A powerful generator for backup power and construction sites.",
    owner: {
      name: "Demo Equipment Owner",
      rating: 4.9,
      verified: true,
    },
  },
  {
    id: "eq-005",
    name: "Professional Drone",
    category: "Photography Equipment",
    location: "Chattogram, Bangladesh",
    price: 1500,
    rentalUnit: "day",
    rating: 4.6,
    image: "/images/equipment/drone.jpg",
    featured: true,
    description: "A versatile drone for aerial photography and videography.",
    owner: {
      name: "Demo Equipment Owner",
      rating: 4.6,
      verified: true,
    },
  },
  {
    id: "eq-006",
    name: "Event Sound System",
    category: "Event Equipment",
    location: "Dhaka, Bangladesh",
    price: 1200,
    rentalUnit: "day",
    rating: 4.8,
    image: "/images/equipment/sound-system.jpg",
    featured: true,
    description: "A high-quality sound system for events and performances.",
    owner: {
      name: "Demo Equipment Owner",
      rating: 4.8,
      verified: true,
    },
  },
];
