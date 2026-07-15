import { defineStore } from 'pinia'

export const usePickedStore = defineStore('picked', {
  state: () => ({
    place: null,
    categories: [],
  }),
})
