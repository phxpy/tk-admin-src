<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const siteTitle = ref("")
const siteDesc = ref("")
const siteLink = ref("")
const subjectsList = ref([])

const loading = ref(false)

const isFormValid = computed(() => {
  return (
    siteTitle.value &&
    siteDesc.value &&
    siteLink.value
  )
})

const createSite = async () => {
  loading.value = true
  try {
    const res = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/site/add/', {
      method: 'POST',
      body: {
        "name": siteTitle.value,
        "description": siteDesc.value,
        "target_url": siteLink.value,
      },
    })

    router.push({ path: '/widgets', query: { id: res.created.id } })
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
        title="New site"
      >
        <VCardText>
          <AppTextField
            v-model="siteTitle"
            label="Name"
            placeholder="Name"
            :rules="[requiredValidator]"
          />
        </VCardText>
        <VCardText>
          <AppTextField
            v-model="siteDesc"
            label="Description"
            placeholder="Description"
            :rules="[requiredValidator]"
          />
        </VCardText>
        <VCardText>
          <AppTextField
            v-model="siteLink"
            label="Link"
            placeholder="Link"
            :rules="[requiredValidator, urlValidator]"
          />
        </VCardText>
        <VCardText>
          <DemoSelectChips
            v-model="subjectsList"
            label="Subjects"
            :items="[1,2,3,4,5]"
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
