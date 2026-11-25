<script setup lang="ts">
import type { Board } from '~/types/board'
import { LogOut as LogOutIcon, Pencil as PencilIcon, Plus as PlusIcon, Trash2 as TrashIcon, UserPlus as UserPlusIcon } from '@lucide/vue'

// Overview of my boards: open, create, rename, share and delete them. Without a login only the login button shows.
const { boards, load, addBoard, renameBoard, addMember, removeBoard } = useBoards()
const { user, load: loadUser, login, logout } = useAuth()
await loadUser()
if (user.value) await load()

async function onAdd() {
  const name = window.prompt('Wie soll das Board heißen?', 'Neues Board')
  if (name) await navigateTo(`/boards/${await addBoard(name)}`)
}

function onRename(board: Board) {
  const name = window.prompt('Neuer Name', board.name)
  if (name && name !== board.name) renameBoard(board.id, name)
}

async function onAddMember(board: Board) {
  const email = window.prompt(`Wen möchtest du zu „${board.name}“ hinzufügen? (E-Mail)`)
  if (!email) return
  try {
    await addMember(board.id, email)
  }
  catch (error) {
    // The backend only knows people who have logged in at least once.
    const notFound = (error as { statusCode?: number }).statusCode === 404
    window.alert(notFound ? `${email} hat sich noch nie angemeldet.` : 'Das hat nicht geklappt.')
  }
}

// Deleting a board also deletes every object on it, so ask first.
function onRemove(board: Board) {
  if (window.confirm(`„${board.name}“ und alles darauf löschen?`)) removeBoard(board.id)
}
</script>

<template>
  <main v-if="!user" class="flex min-h-screen items-center justify-center">
    <Button variant="outline" @click="login">
      Mit Google anmelden
    </Button>
  </main>

  <main v-else class="mx-auto max-w-5xl p-8">
    <div class="mb-6 flex items-center justify-end gap-3">
      <UserAvatar :name="user.name" :avatar-url="user.avatarUrl" />
      <span class="text-sm font-medium">{{ user.name }}</span>
      <Button variant="ghost" size="sm" @click="logout">
        <LogOutIcon />
        Abmelden
      </Button>
    </div>

    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        Boards
      </h1>
      <Button @click="onAdd">
        <PlusIcon />
        Neues Board
      </Button>
    </div>

    <p v-if="!boards.length" class="text-muted-foreground">
      Noch keine Boards – leg das erste an.
    </p>

    <ul class="flex flex-col gap-3">
      <li
        v-for="board in boards"
        :key="board.id"
        class="group relative rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <NuxtLink :to="`/boards/${board.id}`" class="flex items-center gap-4 py-3 pl-5 pr-32">
          <span class="truncate font-medium">{{ board.name }}</span>
          <span class="shrink-0 text-sm text-muted-foreground">{{ new Date(board.createdAt).toLocaleDateString('de-DE') }}</span>
          <span class="ml-auto flex shrink-0 -space-x-2">
            <UserAvatar v-for="member in board.members" :key="member.id" :name="member.name" :avatar-url="member.avatarUrl" />
          </span>
        </NuxtLink>
        <div class="absolute right-3 top-1/2 flex -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button variant="ghost" size="icon-sm" aria-label="Add member" @click="onAddMember(board)">
            <UserPlusIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Rename board" @click="onRename(board)">
            <PencilIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Delete board" @click="onRemove(board)">
            <TrashIcon />
          </Button>
        </div>
      </li>
    </ul>
  </main>
</template>
