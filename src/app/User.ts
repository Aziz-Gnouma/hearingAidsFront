export interface User {
    email: string;
    userFirstName: string;
    userLastName: string;
    cin: number;
    userPassword: string;
    matricule: number;
    dateOfBirth: string;
    nationality: string;
    cinDate: string;
    pays: string;
    phoneNumber: number;
    address: string;
    staus: string;
    createdDate : Date ; 
    role: { roleName: string; roleDescription: string }[];
    
  }
  
  export interface orders {
    card: string;
    dateCard: string;
    orderId: number;
    paymentRef: string;
    phoneNumber: number;
    price: string;
    productName: string;
    purchaseDate: string;
    userEmail: string;
    userFirstName: string;
    userId: number;
    userLastName: string;
  }
  export interface Product {
    category: string;
    content: string;
    created_at: string;
    description: string;
    fileName: string;
    id: number;
    price: string;
    productName: string;
    status: string;
    stock: number;
  }