import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'

export const useBoardsStore = defineStore('boards', {
  state: () => ({
    boards: [],
    errorMessage: ''
  }),
  actions: {
    async fetchBoards() {
      try {
        const { data, error } = await supabase.from('boards').select('*')
        if (error) throw error
        this.boards = data
      } catch (err) {
        console.error(err)
        this.errorMessage = 'Kon boards niet laden'
      }
    },
    async createBoard(name) {
      try {
        const { data, error } = await supabase.from('boards').insert([{ name }])
        if (error) throw error
        this.boards.push(data[0])
      } catch (err) {
        console.error(err)
        this.errorMessage = 'Kon board niet aanmaken'
      }
    }
  }
})
