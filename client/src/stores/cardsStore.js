import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'

export const useCardsStore = defineStore('cards', {
  state: () => ({
    cards: [],
    errorMessage: ''
  }),
  actions: {
    async fetchCards(columnId) {
      try {
        const { data, error } = await supabase.from('cards').select('*').eq('column_id', columnId)
        if (error) throw error
        this.cards = data
      } catch (err) {
        console.error(err)
        this.errorMessage = 'Kon cards niet laden'
      }
    }
  }
})
