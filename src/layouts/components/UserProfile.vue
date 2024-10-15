<script setup>
import { useCookie } from '@/@core/composable/useCookie'
import { useCommonStore } from '@/assets/global'
import user from '@images/avatars/user.png'

const commonStore = useCommonStore()
const router = useRouter()
const ability = useAbility()
const userData = useCookie('userData')

const logout = async () => {

  // Remove "accessToken" from cookie
  useCookie('accessToken').value = null

  // Remove "userData" from cookie
  userData.value = null

  // Redirect to login page
  await router.push('/login')

  // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page

  // Remove "userAbilities" from cookie
  useCookie('userAbilityRules').value = null

  // Reset ability to initial ability
  ability.update([])

  useCookie('username').value = null

  commonStore.setUsername("")
}
</script>

<template>
  <VAvatar
    v-if="$can('read', 'all')"
    class="cursor-pointer"
    color="primary"
    variant="tonal"
  >
    <VImg :src="user" />

    <!-- SECTION Menu -->
    <VMenu
      activator="parent"
      width="230"
      location="bottom end"
      offset="14px"
    >
      <VList>
        <!-- 👉 User Avatar & Name -->
        <VListItem>
          <VListItemTitle class="font-weight-semibold">
            {{ commonStore.username }}
          </VListItemTitle>
        </VListItem>

        <VDivider class="my-2" />

        <!-- 👉 Logout -->
        <VListItem>
          <VBtn
            block
            @click="logout"
          >
            Logout
          </VBtn>
        </VListItem>
      </VList>
    </VMenu>
    <!-- !SECTION -->
  </VAvatar>
</template>
