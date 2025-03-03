<template>
  <div class="account-form">
    <h2>Учетные записи</h2>
    <n-button type="primary" @click="addAccount">+ Добавить</n-button>

    <n-space vertical v-if="store.isLoaded">
      <AccountItem
          v-for="(account, index) in store.accounts"
          :key="index"
          :account="account"
          @update="updateAccount"
          @remove="removeAccount"
      />
    </n-space>

    <p v-else>Загрузка данных...</p>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accountsStore'
import AccountItem from '@/components/AccountItem.vue'

const store = useAccountsStore()

const addAccount = () => store.addAccount()
const removeAccount = (id: number) => store.removeAccount(id)
const updateAccount = (updatedAccount) => store.updateAccount(updatedAccount.id, updatedAccount)
</script>
