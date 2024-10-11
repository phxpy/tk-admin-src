<script setup>
const platformTitle = ref("")
const platformDesc = ref("")
const platformLink = ref("")
const subjectsList = ref([])
const widgetTitle = ref("")

const loadings = ref([])

const isFormValid = computed(() => {
  return (
    platformTitle.value &&
    platformDesc.value &&
    platformLink.value
  )
})

const createSite = async () => {
  try {
    const res = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/site/add/', {
      method: 'POST',
      body: {
        "name": platformTitle.value,
        "description": platformDesc.value,
        "target_url": platformLink.value,
      },
    })
  } catch (err) {
    console.error(err)
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
        title="Platform"
      >
        <VCardText>
          <AppTextField
            v-model="platformTitle"
            label="Name"
            placeholder="Name"
            :rules="[requiredValidator]"
          />
        </VCardText>
        <VCardText>
          <AppTextField
            v-model="platformDesc"
            label="Description"
            placeholder="Description"
            :rules="[requiredValidator]"
          />
        </VCardText>
        <VCardText>
          <AppTextField
            v-model="platformLink"
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
      <VCard
        class="mb-6"
        title="Widget"
      >
        <VCardText>
          <AppTextField
            v-model="widgetTitle"
            label="Widget name"
            placeholder="Widget name"
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
            :loading="loadings[0]"
            color="primary"
            :disabled="!isFormValid"
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
