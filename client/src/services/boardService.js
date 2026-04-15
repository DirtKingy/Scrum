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

export async function updateColumnPositions(columns) {
  for (const c of columns) {
    const { error } = await supabase
      .from('columns')
      .update({ position: c.position })
      .eq('id', c.id)

    if (error) throw error
  }
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
  const updates = cards
    .filter(c => c.id)
    .map(c =>
      supabase
        .from('cards')
        .update({
          position: c.position,
          column_id: c.column_id
        })
        .eq('id', c.id)
    )

  const results = await Promise.all(updates)
  for (const r of results) {
    if (r.error) throw r.error
  }

  return true
}

// -------------------- ATTACHMENTS (IN BOARD SERVICE) --------------------
export async function fetchAttachments(cardId) {
  const { data, error } = await supabase
    .from('card_attachments')
    .select('*')
    .eq('card_id', cardId)

  if (error) throw error

  return data.map(a => ({
    id: a.id,
    name: a.file_name,
    url: a.file_url
  }))
}

export async function uploadAttachment(cardId, file) {
  const filePath = `${cardId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('attachments')
    .getPublicUrl(filePath)

  const fileUrl = data.publicUrl

  const { data: inserted, error: dbError } = await supabase
    .from('card_attachments')
    .insert({
      card_id: cardId,
      file_name: file.name,
      file_url: fileUrl
    })
    .select()
    .single()

  if (dbError) throw dbError

  return {
    id: inserted.id,
    name: file.name,
    url: fileUrl
  }
}

export async function deleteAttachment(id) {
  const { error } = await supabase
    .from('card_attachments')
    .delete()
    .eq('id', id)

  if (error) throw error

  return true
}