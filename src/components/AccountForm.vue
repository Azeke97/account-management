<template>
  <div class="account-form">
    <h2 class="mb-4">Учетные записи</h2>

    <v-btn color="primary" class="mb-4" @click="addAccount">
      + Добавить
    </v-btn>

    <v-container v-if="store.isLoaded">
      <v-row>
        <v-col v-for="(account, index) in store.accounts" :key="index" cols="12" md="6">
          <AccountItem
              :account="account"
              @update="updateAccount"
              @remove="removeAccount"
          />
        </v-col>
      </v-row>
    </v-container>

    <p v-else>Загрузка данных...</p>
  </div>
</template>

<script setup lang="ts">
import {Account, useAccountsStore} from '@/stores/accountsStore'
import AccountItem from '@/components/AccountItem.vue'

const store = useAccountsStore()

const addAccount = () => store.addAccount()
const removeAccount = (id: number) => store.removeAccount(id)
const updateAccount = (updatedAccount: Account) => {
  store.updateAccount(updatedAccount.id, updatedAccount)
}
</script>
