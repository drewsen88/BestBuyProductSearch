/**
 * Cart Store
 * Simple local state management for cart functionality
 * Uses React context pattern for predictable state updates
 */

import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {Product, getDisplayPrice} from '../domain/models';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | {type: 'ADD_ITEM'; product: Product}
  | {type: 'REMOVE_ITEM'; sku: string}
  | {type: 'UPDATE_QUANTITY'; sku: string; quantity: number}
  | {type: 'CLEAR_CART'};

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.product.sku === action.product.sku,
      );

      if (existingIndex >= 0) {
        // Increase quantity if item already exists
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return {...state, items: newItems};
      }

      // Add new item
      return {
        ...state,
        items: [...state.items, {product: action.product, quantity: 1}],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.product.sku !== action.sku),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product.sku !== action.sku),
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.product.sku === action.sku
            ? {...item, quantity: action.quantity}
            : item,
        ),
      };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (sku: string) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: Product) => {
    dispatch({type: 'ADD_ITEM', product});
  };

  const removeItem = (sku: string) => {
    dispatch({type: 'REMOVE_ITEM', sku});
  };

  const updateQuantity = (sku: string, quantity: number) => {
    dispatch({type: 'UPDATE_QUANTITY', sku, quantity});
  };

  const clearCart = () => {
    dispatch({type: 'CLEAR_CART'});
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      return total + getDisplayPrice(item.product) * item.quantity;
    }, 0);
  };

  const isInCart = (sku: string) => {
    return state.items.some(item => item.product.sku === sku);
  };

  const value: CartContextValue = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  };

  return React.createElement(CartContext.Provider, {value}, children);
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
