// // src/stores/globalStore.js
// export async function moveItem({ listByGroup, fromGroupId, toGroupId, itemId, newIndex, updateBackendFn }) {
//   const fromList = listByGroup.value[fromGroupId] || []
//   const idx = fromList.findIndex(c => c.id === itemId)
//   if (idx === -1) return
//   const [item] = fromList.splice(idx, 1)
//   if (!listByGroup.value[toGroupId]) listByGroup.value[toGroupId] = []
//   listByGroup.value[toGroupId].splice(newIndex, 0, item)

//   const renumber = (arr) => arr.forEach((c, i) => c.position = i)
//   renumber(listByGroup.value[fromGroupId])
//   if (fromGroupId !== toGroupId) renumber(listByGroup.value[toGroupId])

//   for (const groupId of [fromGroupId, toGroupId]) {
//     for (const c of listByGroup.value[groupId] || []) {
//       await updateBackendFn(c)
//     }
//   }
// }
