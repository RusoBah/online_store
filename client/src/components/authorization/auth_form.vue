<script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps<{
  isAuthSubmitting: boolean;
  isAuthorized: boolean;
}>();

const emit = defineEmits<{
  (event: 'login', payload: { email: string; password: string }): void;
  (event: 'logout'): void;
}>();

const form = reactive({
  email: '',
  password: ''
});

const onSubmit = () => {
  emit('login', {
    email: form.email,
    password: form.password
  });
};
</script>

<template>
  <div class="auth">
    <p class="auth__title">Авторизация администратора</p>
    <p class="panel__caption auth__caption">
      Токен подставляется автоматически после входа.
    </p>

    <form class="form auth__form" @submit.prevent="onSubmit">
      <label class="field">
        <span>Email</span>
        <input v-model="form.email" autocomplete="username" required type="email" />
      </label>

      <label class="field">
        <span>Пароль</span>
        <input v-model="form.password" autocomplete="current-password" required type="password" />
      </label>

      <div class="auth__actions">
        <button :disabled="props.isAuthSubmitting" class="button button--ghost" type="submit">
          {{ props.isAuthSubmitting ? 'Вход...' : 'Войти' }}
        </button>
        <button v-if="props.isAuthorized" class="button button--ghost" type="button" @click="emit('logout')">
          Выйти
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth {
  margin-bottom: 0.9rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.auth__title {
  margin: 0;
  font-weight: 600;
}

.panel__caption {
  margin: 0.45rem 0 1rem;
  color: #475569;
}

.auth__caption {
  margin-bottom: 0.6rem;
}

.form {
  margin-top: 0.75rem;
  display: grid;
  gap: 0.8rem;
}

.auth__form {
  margin-top: 0;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field span {
  font-size: 0.85rem;
  color: #334155;
}

.field input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.18);
  padding: 0.65rem 0.8rem;
  font-size: 0.95rem;
  background: #ffffff;
}

.auth__actions {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
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
</style>
