<template>
  <v-card class="pa-4 account-card">
    <v-row dense class="account-card-form">
      <div>
        <v-col cols="12">
          <v-text-field
              v-model="labelText"
              label="Метки (через ;)"
              class="custom-input"
              :error="errors.labels"
              :error-messages="errors.labels ? 'Максимум 50 символов' : ''"
              maxlength="50"
              placeholder="Введите метки"
              variant="outlined"
              density="comfortable"
              @blur="updateAccount"
          />
        </v-col>

        <v-col cols="12">
          <v-select
              v-model="localType"
              label="Тип записи"
              class="custom-input"
              :items="accountTypeOptions"
              variant="outlined"
              density="comfortable"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
              v-model="localLogin"
              label="Логин"
              class="custom-input"
              :error="errors.login"
              :error-messages="errors.login ? 'Логин обязателен' : ''"
              maxlength="100"
              placeholder="Введите логин"
              variant="outlined"
              density="comfortable"
              @blur="updateAccount"
          />
        </v-col>

        <v-col v-if="localType === 'Локальная'" cols="12">
          <v-text-field
              v-model="localPassword"
              label="Пароль"
              type="password"
              class="custom-input"
              :error="errors.password"
              :error-messages="errors.password ? 'Пароль обязателен' : ''"
              maxlength="100"
              placeholder="Введите пароль"
              variant="outlined"
              density="comfortable"
              @blur="updateAccount"
          />
        </v-col>
      </div>

      <v-col cols="12" class="text-right">
        <v-btn color="red" variant="tonal" @click="removeAccount">
          ❌ Удалить
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Account } from '@/stores/accountsStore'

const props = defineProps<{ account: Account }>()
const emit = defineEmits(['update', 'remove'])

const accountTypeOptions = ['Локальная', 'LDAP']

const localLogin = ref(props.account.login)
const localPassword = ref<string | null>(props.account.password ?? '')
const localType = ref(props.account.type)
const labelText = ref(props.account.labels.map(l => l.text).join('; '))

const errors = computed(() => ({
  login: !localLogin.value.trim(),
  password: localType.value === 'Локальная' && (!localPassword.value || !localPassword.value.trim()),
  labels: labelText.value.length > 50
}))

watch(() => props.account, (newAccount) => {
  localLogin.value = newAccount.login
  localPassword.value = newAccount.password ?? ''
  localType.value = newAccount.type
  labelText.value = newAccount.labels.map(l => l.text).join('; ')
})

const updateAccount = () => {
  if (!errors.value.login && !errors.value.password && !errors.value.labels) {
    emit('update', {
      ...props.account,
      login: localLogin.value,
      password: localPassword.value,
      type: localType.value,
      labels: labelText.value.split(';').map(text => ({ text: text.trim() })).filter(l => l.text),
    })
  }
}

const removeAccount = () => emit('remove', props.account.id)
</script>

<style scoped>
.account-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.account-card-form {
  min-height: 420px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

::v-deep(.v-input__control) {
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
