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
        const { data, error } = await supabase.from('boards').select('*').order('updated_at', { ascending: false })
        if (error) throw error
        this.boards = data
      } catch (err) {
        console.error(err)
        this.errorMessage = 'Kon boards niet laden'
      }
    },
    async createBoard(name) {
      try {
        const { data, error } = await supabase
          .from('boards')
          .insert([{ name }])
          .select()  // <-- dit zorgt dat Supabase de nieuw aangemaakte row teruggeeft
        if (error) throw error
        this.boards.push(data[0])   // Voeg de nieuw aangemaakte board toe aan de store
      } catch (err) {
        console.error('Kon board niet aanmaken:', err)
        this.errorMessage = 'Kon board niet aanmaken: ' + (err.message || err.details)
      }
    },
    async updateBoard(id, newName) {
      try {
        const { data, error } = await supabase.from('boards').update({ name: newName, updated_at: new Date().toISOString() }).eq('id', id)
        if (error) throw error
        const index = this.boards.findIndex(b => b.id === id)
        if (index !== -1) this.boards[index].name = newName
      } catch (err) {
        console.error(err)
        this.errorMessage = 'Kon board niet updaten'
      }
    },
    async deleteBoard(id) {
      try {
        const { error } = await supabase.from('boards').delete().eq('id', id)
        if (error) throw error
        this.boards = this.boards.filter(b => b.id !== id)
      } catch (err) {
        console.error(err)
        this.errorMessage = 'Kon board niet verwijderen'
      }
    }
  }
})
