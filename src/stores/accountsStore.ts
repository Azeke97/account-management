import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Account {
    id: number
    labels: { text: string }[]
    type: 'LDAP' | 'Локальная'
    login: string
    password: string | null
}

export const useAccountsStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([])
    const isLoaded = ref(false)

    const loadAccounts = () => {
        const storedAccounts = localStorage.getItem('accounts')
        if (storedAccounts) {
            accounts.value = JSON.parse(storedAccounts)
        }
        isLoaded.value = true
    }
    loadAccounts()

    function addAccount() {
        const newId = accounts.value.length ? Math.max(...accounts.value.map(a => a.id)) + 1 : 1
        accounts.value.push({
            id: newId,
            labels: [],
            type: 'Локальная',
            login: '',
            password: '',
        })
    }

    function removeAccount(id: number) {
        accounts.value = accounts.value.filter(account => account.id !== id)
    }

    function updateAccount(id: number, updatedData: Partial<Account>) {
        const index = accounts.value.findIndex(account => account.id === id)
        if (index !== -1) {
            accounts.value[index] = { ...accounts.value[index], ...updatedData }
        }
    }

    watch(accounts, (newAccounts) => {
        localStorage.setItem('accounts', JSON.stringify(newAccounts))
    }, { deep: true })

    return { accounts, isLoaded, addAccount, removeAccount, updateAccount }
})
