<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import CatalogList from './components/catalog_list.vue';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  categoryId: number | null;
  brandId: number | null;
}

interface DictionaryItem {
  id: number;
  name: string;
}

interface ProductListResponse {
  rows: Product[];
  count: number;
}

const products = ref<Product[]>([]);
const categories = ref<DictionaryItem[]>([]);
const brands = ref<DictionaryItem[]>([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const adminToken = ref(localStorage.getItem('adminToken') ?? '');
const cartItems = reactive<Record<number, number>>({});

const filters = reactive({
  categoryId: '',
  brandId: ''
});

const createForm = reactive({
  name: '',
  price: '',
  categoryId: '',
  brandId: ''
});

const createImage = ref<File | null>(null);

const cartCounter = computed(() =>
  Object.values(cartItems).reduce((sum, itemCount) => sum + itemCount, 0)
);

const shownProducts = computed(() => {
  return products.value.filter((product) => {
    const categoryMatch = filters.categoryId
      ? String(product.categoryId) === filters.categoryId
      : true;
    const brandMatch = filters.brandId
      ? String(product.brandId) === filters.brandId
      : true;

    return categoryMatch && brandMatch;
  });
});

const withAuthHeaders = () => {
  if (!adminToken.value.trim()) {
    throw new Error('Введите JWT токен администратора для изменения товаров.');
  }

  return {
    Authorization: `Bearer ${adminToken.value.trim()}`
  };
};

const getJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Ошибка запроса');
  }

  return data as T;
};

const fetchProducts = async () => {
  const data = await getJson<ProductListResponse>('/api/product/getall?limit=60&page=1');
  products.value = data.rows;
};

const fetchCatalog = async () => {
  const [categoriesResponse, brandsResponse] = await Promise.all([
    getJson<DictionaryItem[]>('/api/category/getall'),
    getJson<DictionaryItem[]>('/api/brand/getall')
  ]);

  categories.value = categoriesResponse;
  brands.value = brandsResponse;
};

const loadPageData = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await Promise.all([fetchProducts(), fetchCatalog()]);
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    isLoading.value = false;
  }
};

const persistToken = () => {
  localStorage.setItem('adminToken', adminToken.value);
  successMessage.value = 'Токен сохранен в браузере.';
};

const resetStatus = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  createImage.value = target.files?.[0] ?? null;
};

const createProduct = async () => {
  resetStatus();
  isSubmitting.value = true;

  try {
    const headers = withAuthHeaders();
    const formData = new FormData();
    formData.append('name', createForm.name.trim());
    formData.append('price', createForm.price.trim());
    formData.append('categoryId', createForm.categoryId);
    formData.append('brandId', createForm.brandId);

    if (createImage.value) {
      formData.append('image', createImage.value);
    }

    await getJson<Product>('/api/product/create', {
      method: 'POST',
      headers,
      body: formData
    });

    createForm.name = '';
    createForm.price = '';
    createImage.value = null;
    successMessage.value = 'Товар успешно добавлен.';
    await fetchProducts();
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    isSubmitting.value = false;
  }
};

const deleteProduct = async (id: number) => {
  resetStatus();

  try {
    await getJson('/api/product/delete/' + id, {
      method: 'DELETE',
      headers: withAuthHeaders()
    });

    delete cartItems[id];
    successMessage.value = 'Товар удален.';
    await fetchProducts();
  } catch (error) {
    errorMessage.value = (error as Error).message;
  }
};

const addToCart = (productId: number) => {
  cartItems[productId] = (cartItems[productId] ?? 0) + 1;
};

const decrementCartItem = (productId: number) => {
  const current = cartItems[productId] ?? 0;
  if (current <= 1) {
    delete cartItems[productId];
    return;
  }

  cartItems[productId] = current - 1;
};

onMounted(loadPageData);
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div class="brand">
        <p class="brand__mark">ШОПЛОП</p>
        <h1>Главная витрина</h1>
      </div>
      <div class="cart">
        <span class="cart__icon" aria-hidden="true">🛒</span>
        <span class="cart__label">Корзина</span>
        <span class="cart__count">{{ cartCounter }}</span>
      </div>
    </header>

    <main class="layout">
      <section class="panel panel--form">
        <h2>Добавить товар</h2>
        <p class="panel__caption">Создание и удаление выполняются через действующий backend.</p>

        <label class="field">
          <span>JWT токен администратора</span>
          <input v-model="adminToken" placeholder="Bearer token" type="text" />
        </label>
        <button class="button button--ghost" type="button" @click="persistToken">Сохранить токен</button>

        <form class="form" @submit.prevent="createProduct">
          <label class="field">
            <span>Название</span>
            <input v-model="createForm.name" required type="text" />
          </label>

          <label class="field">
            <span>Цена</span>
            <input v-model="createForm.price" min="0" required type="number" />
          </label>

          <label class="field">
            <span>Категория</span>
            <select v-model="createForm.categoryId" required>
              <option disabled value="">Выберите категорию</option>
              <option v-for="category in categories" :key="category.id" :value="String(category.id)">
                {{ category.name }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Бренд</span>
            <select v-model="createForm.brandId" required>
              <option disabled value="">Выберите бренд</option>
              <option v-for="brand in brands" :key="brand.id" :value="String(brand.id)">
                {{ brand.name }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Изображение (опционально)</span>
            <input accept="image/*" type="file" @change="onImageChange" />
          </label>

          <button :disabled="isSubmitting" class="button" type="submit">
            {{ isSubmitting ? 'Сохранение...' : 'Добавить товар' }}
          </button>
        </form>
      </section>

      <CatalogList
        :brands="brands"
        :cart-items="cartItems"
        :categories="categories"
        :error-message="errorMessage"
        :is-loading="isLoading"
        :products="shownProducts"
        :selected-brand-id="filters.brandId"
        :selected-category-id="filters.categoryId"
        :success-message="successMessage"
        @decrement-cart-item="decrementCartItem"
        @increment-cart-item="addToCart"
        @delete-product="deleteProduct"
        @refresh="loadPageData"
        @update:selected-brand-id="filters.brandId = $event"
        @update:selected-category-id="filters.categoryId = $event"
      />
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  color: #0f172a;
  background: linear-gradient(160deg, #f6f8ff 0%, #eef2ff 35%, #f8fafc 100%);
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(8px);
}

.brand h1 {
  margin: 0;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
}

.brand__mark {
  margin: 0;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.24em;
  color: #4f46e5;
}

.cart {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
}

.cart__icon {
  font-size: 1.25rem;
}

.cart__count {
  min-width: 1.8rem;
  text-align: center;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  background: #0f172a;
  color: #ffffff;
}

.layout {
  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;
  gap: 1.5rem;
  padding: 1.5rem 2rem 2rem;
}

.panel {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 50px -38px rgba(15, 23, 42, 0.5);
}

.panel--form {
  padding: 1.25rem;
  align-self: start;
}

.panel--catalog {
  padding: 1.25rem;
}

h2 {
  margin: 0;
  font-size: 1.25rem;
}

.panel__caption {
  margin: 0.45rem 0 1rem;
  color: #475569;
}

.form {
  margin-top: 0.75rem;
  display: grid;
  gap: 0.8rem;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field span {
  font-size: 0.85rem;
  color: #334155;
}

.field input,
.field select {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.18);
  padding: 0.65rem 0.8rem;
  font-size: 0.95rem;
  background: #ffffff;
}

.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 12px;
  padding: 0.6rem 0.9rem;
  background: #1d4ed8;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button:disabled {
  opacity: 0.65;
  cursor: default;
  transform: none;
}

.button--ghost {
  background: #e2e8f0;
  color: #0f172a;
}

.button--danger {
  background: #dc2626;
}

.catalog__head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
}

.filters select {
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.18);
  padding: 0.55rem 0.65rem;
  background: #ffffff;
}

.status {
  margin: 0.8rem 0;
  color: #334155;
}

.status--error {
  color: #b91c1c;
}

.status--success {
  color: #0369a1;
}

.catalog {
  margin-top: 0.9rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 0.9rem;
}

.product {
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.1);
  display: grid;
  grid-template-rows: 150px auto auto;
}

.product__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product__body {
  padding: 0.85rem 0.85rem 0.35rem;
}

.product__title {
  margin: 0;
  font-weight: 600;
}

.product__price {
  margin: 0.3rem 0 0;
  color: #1d4ed8;
  font-weight: 700;
}

.product__actions {
  padding: 0.35rem 0.85rem 0.85rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .topbar {
    padding: 1rem;
  }
}

@media (max-width: 520px) {
  .cart__label {
    display: none;
  }
}
</style>
