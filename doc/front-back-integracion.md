# Frontend-Backend Integration Guide for Restaurant Menu

This guide will help you integrate your frontend React application with your backend API deployed on Render. Here's how you can update your frontend code to fetch and display data from your API instead of using static data.

## 1. Environment Configuration

First, set up environment variables to manage your API URL across different environments:

Create a `.env` file in your frontend project root:

```
NEXT_PUBLIC_API_URL=https://burguer-backend-wcqv.onrender.com
```

For local development, you might want to create a `.env.development` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 2. Creating an API Client

Create a dedicated API client to manage all your API calls:

```typescript
// src/utils/apiClient.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = {
  // Generic fetch wrapper with error handling
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API Error: ${response.status}`
      );
    }

    return response.json();
  },

  // Categories
  categories: {
    getAll: () => apiClient.fetch('/api/categories'),
    getById: (id: number) => apiClient.fetch(`/api/categories/${id}`),
    create: (data: any) => apiClient.fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiClient.fetch(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiClient.fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
  },

  // Menu Items
  menuItems: {
    getAll: () => apiClient.fetch('/api/menu-items'),
    getById: (id: number) => apiClient.fetch(`/api/menu-items/${id}`),
    getByCategory: (categoryId: number) => 
      apiClient.fetch(`/api/menu-items/category/${categoryId}`),
    create: (data: any) => apiClient.fetch('/api/menu-items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiClient.fetch(`/api/menu-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiClient.fetch(`/api/menu-items/${id}`, {
      method: 'DELETE',
    }),
  },

  // Customizations
  customizations: {
    getByMenuItem: (menuItemId: number) => 
      apiClient.fetch(`/api/customizations/menu-item/${menuItemId}`),
    create: (menuItemId: number, data: any) => 
      apiClient.fetch(`/api/customizations/menu-item/${menuItemId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) => apiClient.fetch(`/api/customizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => apiClient.fetch(`/api/customizations/${id}`, {
      method: 'DELETE',
    }),
  },
};
```

## 3. Updating Frontend Components

### 3.1. Fetching Categories

Replace the static category data with API calls:

```typescript
// src/components/quick-menu/QuickMenu.tsx
import { useState, useEffect } from 'react';
import { MenuCategory, MenuItem } from '@/types/quickMenu';
import { MenuHeader } from './MenuHeader';
import { CategoryBar } from './CategoryBar';
import { ProductGrid } from './ProductGrid';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { apiClient } from '@/utils/apiClient';

type QuickMenuProps = {};

export const QuickMenu = ({}: QuickMenuProps) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { showToast } = useToast();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiClient.categories.getAll();
        setCategories(categoriesData);
        
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch menu items when category changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!activeCategory) return;
      
      setLoading(true);
      try {
        const items = await apiClient.menuItems.getByCategory(activeCategory);
        setMenuItems(items);
      } catch (err) {
        setError('Failed to load menu items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory]);

  const handleAddToCart = (item) => {
    // Add to cart logic remains the same
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl || '/burguer.png',
      description: item.description,
      category: item.categoryId,
      quantity: 1,
    });
    
    showToast(`${item.name} agregado al carrito`);
  };

  const filteredItems = menuItems.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-neutral-900 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <MenuHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        {loading && categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400">Loading menu...</p>
          </div>
        ) : (
          <>
            <CategoryBar
              categories={categories.map(cat => ({
                id: cat.id,
                name: cat.name
              }))}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-neutral-400">Loading items...</p>
              </div>
            ) : (
              <ProductGrid
                items={filteredItems}
                onAddToCart={handleAddToCart}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuickMenu;
```

### 3.2. Updating Product Detail Modal

Add fetching of customization options:

```typescript
// src/components/quick-menu/ProductDetailModal.tsx
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { MenuItem } from '@/types/quickMenu';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { CustomizationDetails } from '@/types/cart';
import { apiClient } from '@/utils/apiClient';

export const ProductDetailModal = ({ 
  item, 
  isOpen, 
  onClose 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [customizationOptions, setCustomizationOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const notesRef = useRef(null);
  const { addItem } = useCart();
  const { showToast } = useToast();

  // Fetch customization options when item changes
  useEffect(() => {
    if (item && isOpen) {
      const fetchCustomizations = async () => {
        setLoading(true);
        try {
          const options = await apiClient.customizations.getByMenuItem(item.id);
          setCustomizationOptions(options);
          
          // Initialize selected options
          const initialOptions = {};
          options.forEach(option => {
            // Set default selections based on your business logic
            initialOptions[option.id] = false;
          });
          setSelectedOptions(initialOptions);
        } catch (error) {
          console.error('Error fetching customizations:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchCustomizations();
    }
  }, [item, isOpen]);

  // Rest of your component remains the same...
}
```

### 3.3. Creating a Loading State Component

Add a reusable loading component:

```typescript
// src/components/ui/LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-neutral-700 border-t-red-600`}></div>
    </div>
  );
};
```

## 4. Managing API State with React Query (Optional)

For better API state management, consider using React Query:

```bash
npm install @tanstack/react-query
```

Update your `_app.tsx` to include the QueryClientProvider:

```tsx
// src/pages/_app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
```

Then use React Query hooks in your components:

```tsx
// src/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.categories.getAll(),
  });
}

// src/hooks/useMenuItems.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/apiClient';

export function useMenuItems(categoryId) {
  return useQuery({
    queryKey: ['menuItems', categoryId],
    queryFn: () => apiClient.menuItems.getByCategory(categoryId),
    enabled: !!categoryId, // Only run the query if we have a categoryId
  });
}
```

Update your QuickMenu component:

```tsx
import { useCategories } from '@/hooks/useCategories';
import { useMenuItems } from '@/hooks/useMenuItems';

export const QuickMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories();
  
  const { 
    data: menuItems = [], 
    isLoading: menuItemsLoading, 
    error: menuItemsError 
  } = useMenuItems(activeCategory);

  // Set initial active category when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Rest of the component...
}
```

## 5. File Upload for Menu Item Images

If you want to support image uploads for menu items:

```typescript
// src/components/admin/ImageUploader.tsx
import { useState } from 'react';
import Image from 'next/image';

export const ImageUploader = ({ onImageUpload, initialImage = null }) => {
  const [preview, setPreview] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('image', file);

      // Upload to your API or a service like Cloudinary
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Set the preview and pass the URL to parent
      setPreview(data.url);
      onImageUpload(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Product Image
      </label>
      
      <div className="flex items-center space-x-4">
        {preview && (
          <div className="relative w-24 h-24 rounded-md overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        
        <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-md">
          {loading ? 'Uploading...' : 'Choose Image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
```

## 6. Error Handling and User Feedback

Create a general error boundary component:

```tsx
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    // You could also log to an error reporting service here
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="text-center p-6 bg-red-900/20 rounded-lg">
          <h2 className="text-lg font-semibold text-red-400 mb-2">
            Something went wrong
          </h2>
          <p className="text-neutral-300 mb-4">
            An error occurred while loading this content.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-900/50 text-white rounded-lg"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 7. Data Type Definitions

Update your type definitions to match the backend models:

```typescript
// src/types/api.ts
export interface Category {
  id: number;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  isAvailable: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  category?: Category;
  customizationOptions?: CustomizationOption[];
}

export interface CustomizationOption {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  groupName?: string;
  isMutuallyExclusive: boolean;
  menuItemId: number;
  createdAt: string;
  updatedAt: string;
}
```

## 8. Authentication Setup (For Admin Features)

If you want to add admin features, set up authentication:

```typescript
// src/utils/authClient.ts
import { apiClient } from './apiClient';

export const authClient = {
  login: async (email: string, password: string) => {
    const response = await apiClient.fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store the token
    localStorage.setItem('auth_token', response.token);
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    // Redirect to login or home
    window.location.href = '/login';
  },
  
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

// Update apiClient to include auth token
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Then update your apiClient.fetch function to use these headers
async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  // Rest of the fetch function...
}