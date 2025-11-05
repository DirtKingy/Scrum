// client/src/services/boardService.js
import { supabase } from './supabaseClient'

export async function getBoards() {
  const { data, error } = await supabase.from('boards').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createBoard(name) {
  const { data, error } = await supabase.from('boards').insert([{ name }]).select()
  if (error) throw error
  return data[0]
}

export async function updateBoard(id, updates) {
  const { data, error } = await supabase.from('boards').update(updates).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export async function deleteBoard(id) {
  const { error } = await supabase.from('boards').delete().eq('id', id)
  if (error) throw error
  return true
}
