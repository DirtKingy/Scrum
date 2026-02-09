import { supabase } from './supabaseClient'

// -------------------- BOARDS --------------------
export async function getBoards() {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createBoard(name) {
  const { data, error } = await supabase
    .from('boards')
    .insert([{ name }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateBoard(id, updates) {
  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteBoard(id) {
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

// -------------------- COLUMNS --------------------
export async function fetchColumns(boardId) {
  const { data, error } = await supabase
    .from('columns')
    .select('*')
    .eq('board_id', boardId)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createColumn(boardId, name) {
  const { data, error } = await supabase
    .from('columns')
    .insert([{ board_id: boardId, name }])
    .select()
  if (error) throw error
  return { ...data[0], cards: [] }
}

export async function updateColumn(id, updates) {
  const { data, error } = await supabase
    .from('columns')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteColumn(id) {
  const { error } = await supabase
    .from('columns')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

// -------------------- CARDS --------------------
export async function fetchCards(columnId) {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('column_id', columnId)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createCard(columnId, { title, description }) {
  const { data, error } = await supabase
    .from('cards')
    .insert([{ column_id: columnId, title, description }])
    .select()
  if (error) throw error
  return data[0]
}

export async function updateCard(id, updates) {
  const { data, error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export async function deleteCard(id) {
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

export async function updateCardPositions(cards) {
  try {
    for (const c of cards) {
      if (!c.id) continue
      const { error } = await supabase
        .from('cards')
        .update({ position: c.position, column_id: c.column_id })
        .eq('id', c.id)

      if (error) throw error
    }
    return true
  } catch (err) {
    console.error('Kon posities niet bijwerken', err)
    throw err
  }
}
