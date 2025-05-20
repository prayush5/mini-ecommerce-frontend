export interface RegisterPostData {
  id?: number; 
  username: string;
  email: string;
  password: string;
  review?: ReviewDTO[]; 
  purchasedBook?: PurchasedBookDTO[]; 
  purchasedMedicine?: PurchasedMedicineDTO[]; 
  cartItem?: CartItemDTO[]; 
  totalBookAmount?: number; 
  totalMedicineAmount?: number; 
}

export interface User {
  id: number;
  username: string;
  email: string;
  review?: ReviewDTO[];
  purchasedBook?: PurchasedBookDTO[];
  purchasedMedicine?: PurchasedMedicineDTO[];
  cartItem?: CartItemDTO[];
}

export interface ReviewDTO {
  id?: number;
  comment?: string;
  rating?: number;
}

export interface PurchasedBookDTO {
  bookTitle?: string;
  bookAuthor?: string;
  bookGenre?: string;
  quantity?: number;
  priceDTO?: number;
  imageUrl?: string;
  quantityToAdd?: number;
}

export interface PurchasedMedicineDTO {
  medicineName?: string;
  quantity?: number;
  price?: number;
  manufacturer?: string;
  manufactureDate?: string;
  expiryDate?: string;
  imageUrl?: string;
  quantityToAdd?: number;
}

export interface BookApiResponse {
  bookId?: number;
  title?: string;
  author?: string;
  genre?: string;
  price?: number;
  availability?: number;
  user?: any;
  review?: any[];
  seller?: any;
}

export interface MedicineApiResponse { 
  medicineId?: number;
  medicineName?: string;
  manufacturer?: string;
  price?: number;
  availability?: number;
  user?: any;
  seller?: any;
}

export interface CartItemDTO {
  id?: number;
  bookTitle?: string | null;
  medicineName?: string | null;
  quantityDTO?: number;
  priceDTO?: number;
}

export interface Login {
  email: string;
  password: string;
}