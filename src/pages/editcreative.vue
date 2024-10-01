<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = ref("")
const description = ref("")
const image = ref("")

const isFormValid = computed(() => {
  return title.value && description.value && image.value
})

const setFile = async payload => {
  image.value = payload
}

const addCreative = async () => {
  const data = new FormData()

  data.append("title", title.value)
  data.append("description", description.value)
  data.append("icon", image.value)
  data.append("id", route.query.campId)

  await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${route.query.campId}/creative/add/`, {
    method: "POST",
    body: data,
  })
}

onMounted(async () => {
  const data = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${route.query.campId}/creative/${route.query.creativeId}`, {
    method: "GET",
  })

  title.value = data.title
  description.value = data.description
  image.value = data.icon
})
</script>

<template>
  <VRow>
    <VCol
      cols="3"
      md="3"
    >
      <VCard class="mb-6">
        <VCardItem>
          <template #title>
            Product Image
          </template>
        </VCardItem>

        <VCardText>
          <DropZone
            v-model="image"
            @drop-file="setFile"
          />
        </VCardText>
      </VCard>
    </VCol>
    <VCol
      cols="6"
      md="6"
    >
      <VCard class="mb-6">
        <VRow>
          <VCardText>
            <AppTextField
              v-model="title"
              label="Headline"
              placeholder="Headline"
            />
          </VCardText>
        </VRow>
      </VCard>

      <VCard class="mb-6">
        <VRow>
          <VCardText>
            <AppTextField
              v-model="description"
              label="Subtitle"
              placeholder="Subtitle"
            />
          </VCardText>
        </VRow>
      </VCard>
    </VCol>
    <VCol
      cols="3"
      md="3"
    >
      <VCard class="campaing-btn-card">
        <VCardText>
          <VBtn
            color="primary"
            :disabled="!isFormValid"
            block
            @click="addCreative"
          >
            Add creative
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
