<script setup lang="ts">
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface DictionaryItem {
  id: number;
  name: string;
}

const props = defineProps<{
  categories: DictionaryItem[];
  brands: DictionaryItem[];
  products: Product[];
  selectedCategoryId: string;
  selectedBrandId: string;
  isLoading: boolean;
  errorMessage: string;
  successMessage: string;
}>();

const emit = defineEmits<{
  (event: 'update:selectedCategoryId', value: string): void;
  (event: 'update:selectedBrandId', value: string): void;
  (event: 'refresh'): void;
  (event: 'addToCart', productId: number): void;
  (event: 'deleteProduct', productId: number): void;
}>();

const onCategoryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:selectedCategoryId', target.value);
};

const onBrandChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:selectedBrandId', target.value);
};

const imageSource = (image: string) => {
  if (!image) {
    return 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=900&q=80';
  }

  if (image.startsWith('http')) {
    return image;
  }

  return '/static/' + image;
};
</script>

<template>
  <section class="panel panel--catalog">
    <div class="catalog__head">
      <div>
        <h2>Товары</h2>
        <p class="panel__caption">Вывод из `/api/product/getall`, удаление через `/api/product/delete/:id`.</p>
      </div>

      <div class="filters">
        <select :value="props.selectedCategoryId" aria-label="Фильтр по категории" @change="onCategoryChange">
          <option value="">Все категории</option>
          <option v-for="category in props.categories" :key="category.id" :value="String(category.id)">
            {{ category.name }}
          </option>
        </select>

        <select :value="props.selectedBrandId" aria-label="Фильтр по бренду" @change="onBrandChange">
          <option value="">Все бренды</option>
          <option v-for="brand in props.brands" :key="brand.id" :value="String(brand.id)">
            {{ brand.name }}
          </option>
        </select>

        <button class="button button--ghost" type="button" @click="emit('refresh')">Обновить</button>
      </div>
    </div>

    <p v-if="props.errorMessage" class="status status--error">{{ props.errorMessage }}</p>
    <p v-if="props.successMessage" class="status status--success">{{ props.successMessage }}</p>
    <p v-if="props.isLoading" class="status">Загрузка каталога...</p>

    <div v-else class="catalog">
      <article v-for="product in props.products" :key="product.id" class="product">
        <img :alt="product.name" :src="imageSource(product.image)" class="product__image" loading="lazy" />
        <div class="product__body">
          <p class="product__title">{{ product.name }}</p>
          <p class="product__price">{{ Number(product.price).toLocaleString('ru-RU') }} ₽</p>
        </div>

        <div class="product__actions">
          <button class="button" type="button" @click="emit('addToCart', product.id)">В корзину</button>
          <button class="button button--danger" type="button" @click="emit('deleteProduct', product.id)">Удалить</button>
        </div>
      </article>

      <p v-if="props.products.length === 0" class="status">Товаров по текущему фильтру нет.</p>
    </div>
  </section>
</template>

<style scoped>
.panel {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 50px -38px rgba(15, 23, 42, 0.5);
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

.button--ghost {
  background: #e2e8f0;
  color: #0f172a;
}

.button--danger {
  background: #dc2626;
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
</style>
