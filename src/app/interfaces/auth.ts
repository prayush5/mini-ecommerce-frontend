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

//matches book dto
export interface PurchasedBookDTO {
  bookTitle?: string;
  bookAuthor?: string;
  bookGenre?: string;
  quantity?: number;
  priceDTO?: number;
  imageUrl?: string;
  quantityToAdd?: number;
}

//matches medicine entity
export interface PurchasedMedicineDTO {
  name1?: string;
  stockQuantity1?: number;
  price?: number;
  manufacturer?: string;
  imageUrl?: string;
  quantityToAdd?: number;
}

//matches book entity
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

//matches medicine dto
export interface MedicineApiResponse {
  name: string; 
  manufacturer: string;
  price: number;
  stockQuantity: number; 
  manufactureDate?: string; 
  expiryDate?: string; 
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