import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'

export const useCardsStore = defineStore('cards', {
  state: () => ({
    cards: [],
    errorMessage: ''
  }),
  actions: {
    async fetchCards(columnId) {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('column_id', columnId)
        .order('created_at', { ascending: true })

      if (error) this.errorMessage = error.message
      else this.cards = data
    },
    async createCard(columnId, title, description = '') {
      const { data, error } = await supabase
        .from('cards')
        .insert({ column_id: columnId, title, description })
        .select()

      if (error) this.errorMessage = error.message
      else this.cards.push(data[0])
    }
  }
})
