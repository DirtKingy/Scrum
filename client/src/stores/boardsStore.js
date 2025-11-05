import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'

export const useBoardsStore = defineStore('boards', {
  state: () => ({ boards: [] }),
  actions: {
    async fetchBoards() {
      const { data, error } = await supabase.from('boards').select('*')
      if (!error) this.boards = data
    },
    async createBoard(name) {
      const { data, error } = await supabase.from('boards').insert([{ name }])
      if (!error) this.boards.push(data[0])
    }
  }
})
