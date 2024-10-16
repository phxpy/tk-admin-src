<script setup>
import { useCommonStore } from '@/assets/global'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePage({
  meta: {
    unauthenticatedOnly: true,
  },
})

const commonStore = useCommonStore()
const router = useRouter()

const credentials = ref({
  username: '',
  email: '',
  password: '',
})

const errors = ref({
  username: '',
  email: '',
  password: '',
})

const loading = ref(false)
const isPasswordVisible = ref(false)

const isFormValid = computed(() => {
  return (
    credentials.value.username &&
    credentials.value.email &&
    credentials.value.password
  )
})

const onSubmit = async () => {
  loading.value = true
  try {
    const res = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/auth/register/', {
      method: 'POST',
      body: {
        username: credentials.value.username,
        email: credentials.value.email,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors
      },
    })

    if (res?.status === "success") {
      commonStore.setLoginMsg("User successfully registered")
      router.push('/login')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Auth card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <RouterLink to="/">
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
            </RouterLink>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.username"
                  autofocus
                  label="Username"
                  placeholder="Username"
                  :error-messages="errors.username"
                />
              </VCol>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  label="Password"
                  placeholder="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  :error-messages="errors.password"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <VBtn
                  block
                  type="submit"
                  class="mt-8"
                  :loading="loading"
                  :disabled="!isFormValid || loading"
                >
                  Sign up
                </VBtn>
              </VCol>
              <VCol
                cols="12"
                class="text-center text-base"
              >
                <span class="d-inline-block">Already have an account?</span>
                <RouterLink
                  class="text-primary ms-1 d-inline-block"
                  to="login"
                >
                  Sign in instead
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
