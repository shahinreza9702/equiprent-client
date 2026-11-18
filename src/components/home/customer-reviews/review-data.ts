
export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  initials: string;
}

export const reviewData: CustomerReview[] = [
  {
    id: "review-001",
    name: "Rahim Ahmed",
    role: "Construction Contractor",
    location: "Dhaka, Bangladesh",
    rating: 5,
    comment:
      "Finding the right construction equipment used to take a lot of time. EquipRent makes the process much easier and more convenient.",
    initials: "RA",
  },
  {
    id: "review-002",
    name: "Nusrat Jahan",
    role: "Professional Photographer",
    location: "Chattogram, Bangladesh",
    rating: 5,
    comment:
      "I needed professional camera equipment for a project. The rental process was simple, and I could find what I needed in one place.",
    initials: "NJ",
  },
  {
    id: "review-003",
    name: "Tanvir Hasan",
    role: "Event Organizer",
    location: "Sylhet, Bangladesh",
    rating: 4,
    comment:
      "EquipRent offers a convenient way to find event equipment. Having different rental categories in one platform is really helpful.",
    initials: "TH",
  },
  {
    id: "review-004",
    name: "Farhan Kabir",
    role: "Small Business Owner",
    location: "Rajshahi, Bangladesh",
    rating: 5,
    comment:
      "A useful platform for finding equipment without purchasing everything. The overall rental experience feels straightforward.",
    initials: "FK",
  },
];
