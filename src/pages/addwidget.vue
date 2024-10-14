<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const widgetTitle = ref("")
const widgetDesc = ref("")
const loading = ref(false)

const isFormValid = computed(() => {
  return (
    widgetTitle.value
  )
})

const createSite = async () => {
  loading.value = true
  try {
    await $api('https://tg-adsnet-api-proxy.goourl.ru/api/widget/add/', {
      method: 'POST',
      body: {
        "name": widgetTitle.value,
        "description": widgetDesc.value,
        "site": route.query.siteId,
      },
    })

    router.push({ path: '/widgets', query: { id: route.query.siteId } })
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <VRow>
    <VCol
      cols="9"
      md="9"
    >
      <VCard
        class="mb-6"
        title="New widget"
      >
        <VCardText>
          <AppTextField
            v-model="widgetTitle"
            label="Widget name"
            placeholder="Widget name"
            :rules="[requiredValidator]"
          />
        </VCardText>
        <VCardText>
          <AppTextField
            v-model="widgetDesc"
            label="Widget description"
            placeholder="Widget description"
            :rules="[requiredValidator]"
          />
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="3"
      md="3"
    >
      <VCard class="campaing-btn-card">
        <VCardText>
          <VBtn
            :loading="loading"
            color="primary"
            :disabled="!isFormValid || loading"
            block
            @click="createSite"
          >
            Create Platform
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.campaing-btn-card {
  position: sticky !important;
  inset-block-start: 5rem;
}
</style>
