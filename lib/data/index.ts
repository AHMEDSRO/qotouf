import { mockProductRepository } from './repositories/mock/mock-product-repository';
import { mockCategoryRepository } from './repositories/mock/mock-category-repository';
import { mockOrderRepository } from './repositories/mock/mock-order-repository';
import { mockUserRepository } from './repositories/mock/mock-user-repository';
import { mockDeliveryRepository } from './repositories/mock/mock-delivery-repository';

// Later: if (process.env.DATA_SOURCE === 'supabase') import the supabase/* implementations instead,
// keeping the same repository interfaces so no page/component code needs to change.
export const productRepository = mockProductRepository;
export const categoryRepository = mockCategoryRepository;
export const orderRepository = mockOrderRepository;
export const userRepository = mockUserRepository;
export const deliveryRepository = mockDeliveryRepository;
