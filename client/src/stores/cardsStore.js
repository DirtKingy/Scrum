// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { supabase } from '../services/supabaseClient'
// import { useToastStore } from './useToastStore' // importeer de toast store

// export const useCardsStore = defineStore('cards', () => {
//   const cardsByColumn = ref({})

//   async function fetchCards(columnId) {
//     const toast = useToastStore()
//     try {
//       const { data, error } = await supabase
//         .from('cards')
//         .select('*')
//         .eq('column_id', columnId)
//         .order('position', { ascending: true })
//       if (error) throw error
//       cardsByColumn.value[columnId] = data || []
//     } catch (err) {
//       console.error(err)
//       toast.showToast({ message: 'Kon cards niet laden', type: 'error' })
//     }
//   }

//   function checkTitleLength(title) {
//     return title.length <= 120
//   }

//   async function createCard(columnId, title, description = '') {
//     const toast = useToastStore()
//     try {
//       if (!checkTitleLength(title)) {
//         toast.showToast({ message: "Exceeded the 120 title length", type: 'error' })
//         return
//       }

//       const maxPos = cardsByColumn.value[columnId]?.reduce(
//         (max, c) => Math.max(max, c.position ?? 0),
//         -1
//       ) ?? -1

//       const { data, error } = await supabase
//         .from('cards')
//         .insert([{ column_id: columnId, title, description, position: maxPos + 1 }])
//         .select()

//       if (error) throw error

//       if (!cardsByColumn.value[columnId]) cardsByColumn.value[columnId] = []
//       cardsByColumn.value[columnId].push(data[0])
//       toast.showToast({ message: 'Card succesvol aangemaakt', type: 'success' })

//     } catch (err) {
//       console.error(err)
//       toast.showToast({ message: 'Fout bij het aanmaken van de card', type: 'error' })
//     }
//   }

//   async function updateCard(cardId, updates) {
//     const toast = useToastStore()
//     try {
//       if (updates.title && !checkTitleLength(updates.title)) {
//         toast.showToast({ message: "Exceeded the 120 title length", type: 'error' })
//         return
//       }

//       const { data, error } = await supabase
//         .from('cards')
//         .update(updates)
//         .eq('id', cardId)
//         .select()

//       if (error) throw error

//       const updated = data[0]
//       const columnId = updated.column_id
//       if (cardsByColumn.value[columnId]) {
//         const index = cardsByColumn.value[columnId].findIndex(c => c.id === cardId)
//         if (index !== -1) cardsByColumn.value[columnId][index] = updated
//       }
//       toast.showToast({ message: 'Card succesvol bijgewerkt', type: 'success' })
//       return updated

//     } catch (err) {
//       console.error(err)
//       toast.showToast({ message: 'Fout bij het bijwerken van de card', type: 'error' })
//     }
//   }

//   async function moveCard(cardId, fromColumnId, toColumnId, newPosition) {
//     const fromArray = cardsByColumn.value[fromColumnId] || []
//     const cardIndex = fromArray.findIndex(c => c.id === cardId)
//     if (cardIndex === -1) return
//     const [card] = fromArray.splice(cardIndex, 1)

//     if (!cardsByColumn.value[toColumnId]) cardsByColumn.value[toColumnId] = []
//     cardsByColumn.value[toColumnId].splice(newPosition, 0, card)
//     card.column_id = toColumnId

//     // Re-number positions
//     const renumber = (cards) => cards.forEach((c, i) => c.position = i)
//     renumber(cardsByColumn.value[fromColumnId])
//     if (fromColumnId !== toColumnId) renumber(cardsByColumn.value[toColumnId])

//     // Backend update voor alle betrokken kaarten
//     const affectedColumns = fromColumnId === toColumnId ? [fromColumnId] : [fromColumnId, toColumnId]
//     for (const colId of affectedColumns) {
//       for (const c of cardsByColumn.value[colId]) {
//         const { error } = await supabase
//           .from('cards')
//           .update({ column_id: c.column_id, position: c.position })
//           .eq('id', c.id)
//         if (error) console.error('Failed to update card:', c.id, error)
//       }
//     }
//   }

//   return { cardsByColumn, fetchCards, createCard, updateCard, moveCard, checkTitleLength }
// })
