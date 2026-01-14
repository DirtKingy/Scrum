import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'
import { useToastStore } from './useToastStore' // importeer de toast store

export const useBoardsStore = defineStore('boards', {
  state: () => ({
    boards: []
  }),
  actions: {
    async fetchBoards() {
      const toast = useToastStore()
      try {
        const { data, error } = await supabase
          .from('boards')
          .select('*')
          .order('updated_at', { ascending: false })
        if (error) throw error
        this.boards = data
      } catch (err) {
        console.error(err)
        toast.showToast({ message: 'Kon boards niet laden', type: 'error' })
      }
    },

    async createBoard(name) {
      const toast = useToastStore()
      try {
        const { data, error } = await supabase
          .from('boards')
          .insert([{ name }])
          .select()
        if (error) throw error
        this.boards.push(data[0])
        toast.showToast({ message: 'Board succesvol aangemaakt', type: 'success' })
      } catch (err) {
        console.error('Kon board niet aanmaken:', err)
        toast.showToast({ message: 'Kon board niet aanmaken: ' + (err.message || err.details), type: 'error' })
      }
    },

    async updateBoard(id, newName) {
      const toast = useToastStore()
      try {
        const { data, error } = await supabase
          .from('boards')
          .update({ name: newName, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
        if (error) throw error
        const index = this.boards.findIndex(b => b.id === id)
        if (index !== -1) this.boards[index].name = newName
        toast.showToast({ message: 'Board succesvol bijgewerkt', type: 'success' })
      } catch (err) {
        console.error(err)
        toast.showToast({ message: 'Kon board niet updaten', type: 'error' })
      }
    },

    async deleteBoard(id) {
      const toast = useToastStore()
      try {
        const { error } = await supabase.from('boards').delete().eq('id', id)
        if (error) throw error
        this.boards = this.boards.filter(b => b.id !== id)
        toast.showToast({ message: 'Board succesvol verwijderd', type: 'success' })
      } catch (err) {
        console.error(err)
        toast.showToast({ message: 'Kon board niet verwijderen', type: 'error' })
      }
    }
  }
})
