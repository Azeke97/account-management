<template>
  <n-card>
    <n-space vertical>
      <n-form-item label="Метки (через ;)" :validation-status="labelsError ? 'error' : undefined">
        <n-input
            v-model="labelText"
            @update:value="updateLabels"
            @blur="validateAndUpdate"
            maxlength="50"
            placeholder="Введите метки"
        />
      </n-form-item>

      <n-form-item label="Тип записи">
        <n-select v-model="localType" :options="accountTypeOptions" @update:value="updateType" />
      </n-form-item>

      <n-form-item label="Логин" :validation-status="loginError ? 'error' : undefined">
        <n-input
            v-model="localLogin"
            @update:value="updateLogin"
            @blur="validateAndUpdate"
            maxlength="100"
            placeholder="Введите логин"
        />
      </n-form-item>

      <n-form-item v-if="localType === 'Локальная'" label="Пароль" :validation-status="passwordError ? 'error' : undefined">
        <n-input
            v-model="localPassword"
            type="password"
            @update:value="updatePassword"
            @blur="validateAndUpdate"
            maxlength="100"
            placeholder="Введите пароль"
        />
      </n-form-item>

      <n-button type="error" @click="removeAccount">Удалить</n-button>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Account } from '@/stores/accountsStore'

const props = defineProps<{ account: Account }>()
const emit = defineEmits(['update', 'remove'])

const accountTypeOptions = [
  { label: 'Локальная', value: 'Локальная' },
  { label: 'LDAP', value: 'LDAP' }
]

const localLogin = ref('')
const localPassword = ref('')
const localType = ref('Локальная')
const labelText = ref('')

const loginError = ref(false)
const passwordError = ref(false)
const labelsError = ref(false)

watch(
    () => props.account,
    (newAccount) => {
      console.log('props.account обновился:', newAccount)

      localLogin.value = newAccount.login
      localPassword.value = newAccount.password ?? ''
      localType.value = newAccount.type
      labelText.value = newAccount.labels.map(l => l.text).join('; ')
    },
    { deep: true, immediate: true }
)

const updateAccount = () => {
  const updatedData = {
    login: localLogin.value,
    password: localPassword.value,
    type: localType.value,
    labels: labelText.value.split(';').map(text => ({ text: text.trim() })).filter(l => l.text),
  }

  console.log('Отправляем обновлённые данные в store:', updatedData)
  emit('update', { ...props.account, ...updatedData })
}

const validateAndUpdate = () => {
  loginError.value = !localLogin.value.trim()
  passwordError.value = localType.value === 'Локальная' && (!localPassword.value || !localPassword.value.trim())
  labelsError.value = labelText.value.length === 0

  if (!loginError.value && !passwordError.value && !labelsError.value) {
    updateAccount()
  }
}

const updateLabels = (value: string) => {
  labelText.value = value
  updateAccount()
}

const updateType = (newType: 'LDAP' | 'Локальная') => {
  localType.value = newType
  localPassword.value = newType === 'LDAP' ? null : localPassword.value
  updateAccount()
}

const updateLogin = (value: string) => {
  localLogin.value = value
  updateAccount()
}

const updatePassword = (value: string) => {
  localPassword.value = value
  updateAccount()
}

const removeAccount = () => emit('remove', props.account.id)
</script>
