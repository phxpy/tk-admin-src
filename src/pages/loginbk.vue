<script setup>
import { useCommonStore } from '@/assets/global'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'

const commonStore = useCommonStore()

definePage({
  meta: {
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()

const ability = useAbility()

const errors = ref({
  username: undefined,
  password: undefined,
})

const refVForm = ref()

const credentials = ref({
  username: '',
  password: '',
})

const login = async () => {
  try {
    const res = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/auth/token/', {
      method: 'POST',
      body: {
        username: credentials.value.username,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })

    const { access, refresh } = res

    const abilityRules = access ? [{ "action": "manage", "subject": "all" }] : ""

    useCookie('userAbilityRules').value = abilityRules
    ability.update(abilityRules)
    useCookie('accessToken').value = access
    useCookie('refreshToken').value = refresh
    useCookie('username').value = credentials.value.username
    commonStore.setUsername(credentials.value.username)
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
  } catch (err) {
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow class="auth-wrapper">
    <VCol
      cols="12"
      md="12"
      class="auth-card-v2 d-flex flex-column align-center justify-center"
    >
      <VCard
        :max-width="460"
        class="mt-16 mb-8"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
          </h4>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- username -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.username"
                  label="Username"
                  type="text"
                  autofocus
                  :rules="[requiredValidator]"
                  :error-messages="errors.username"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <VBtn
                  block
                  type="submit"
                  class="mt-6"
                >
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
      <span>New on our platform?</span>
      <RouterLink
        class="text-primary ms-1"
        to="/reg"
      >
        Create an account
      </RouterLink>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
