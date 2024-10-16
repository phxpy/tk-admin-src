<!-- ❗Errors in the form are set on line 60 -->
<script setup>
import { useCommonStore } from '@/assets/global'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'

definePage({
  meta: {
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAbility()
const commonStore = useCommonStore()

const loading = ref(false)

const errors = ref({
  username: undefined,
  password: undefined,
  detail: undefined,
})

const refVForm = ref()

const credentials = ref({
  username: '',
  password: '',
})

const rememberMe = ref(false)

const isFormValid = computed(() => {
  return (
    credentials.value.username &&
    credentials.value.password
  )
})

const login = async () => {
  loading.value = true
  try {
    const res = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/auth/token/', {
      method: 'POST',
      body: {
        username: credentials.value.username,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors ? response._data.errors : {}
        errors.value.detail = response._data.detail ? response._data.detail : ''
      },
    })

    if (!res.detail) {
      const { access, refresh } = res
  
      const abilityRules = access ? [{ "action": "manage", "subject": "all" }] : ""
  
      useCookie('userAbilityRules').value = abilityRules
      ability.update(abilityRules)
      useCookie('accessToken').value = access
      useCookie('refreshToken').value = refresh
      useCookie('username').value = credentials.value.username
      commonStore.setUsername(credentials.value.username)
      await nextTick(() => {
        commonStore.setLoginMsg("")
        router.replace(route.query.to ? String(route.query.to) : '/')
      })
    } else {
      useCookie('accessToken').value = null
      userData.value = null
      useCookie('userAbilityRules').value = null
      ability.update([])
      useCookie('username').value = null
      commonStore.setUsername("")
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
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
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <RouterLink to="/">
      <div class="auth-logo d-flex align-center gap-x-3">
        <VNodeRenderer :nodes="themeConfig.app.logo" />
        <h1 class="auth-title">
          {{ themeConfig.app.title }}
        </h1>
      </div>
    </RouterLink>
    
    <VRow
      no-gutters
      class="auth-wrapper d-flex align-center justify-center"
    >
      <VCol
        cols="12"
        md="4"
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <div class="position-relative my-sm-16">
          <VCard
            :max-width="500"
            class="mt-12 mt-sm-0 pa-4"
          >
            <VCardText>
              <h4 class="text-h4 mb-1">
                Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
              </h4>
              <p class="mb-0">
                Please sign-in to your account and start the adventure
              </p>
            </VCardText>
            <VCardText
              v-if="errors.detail"
              class="d-flex justify-center"
              style="color: red;"
            >
              {{ errors.detail }}
            </VCardText>
            <VCardText
              v-else-if="commonStore.loginMsg"
              class="d-flex justify-center"
              style="color: green;"
            >
              {{ commonStore.loginMsg }}
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
                      placeholder="Username"
                      type="text"
                      autofocus
                      :error-messages="errors.username"
                    />
                  </VCol>

                  <!-- password -->
                  <VCol cols="12">
                    <AppTextField
                      v-model="credentials.password"
                      label="Password"
                      placeholder="Password"
                      :rules="[requiredValidator]"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      :error-messages="errors.password"
                      :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                      @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    />

                    <VBtn
                      block
                      type="submit"
                      class="mt-8"
                      :loading="loading"
                      :disabled="!isFormValid || loading"
                    >
                      Login
                    </VBtn>
                  </VCol>

                  <!-- create account -->
                  <VCol
                    cols="12"
                    class="text-center"
                  >
                    <span>New on our platform?</span>
                    <RouterLink
                      class="text-primary ms-1"
                      to="reg"
                    >
                      Create an account
                    </RouterLink>
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
