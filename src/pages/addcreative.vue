<script setup>
let title = "111"
let description = "333"

const creativeData = {}

const setFile = async payload => {
  const encodedFile = await encodeImageFileAsURL(payload)

  // creativeData['icon'] = encodedFile
}

function encodeImageFileAsURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
    reader.readAsDataURL(file)
  })
}

const addCreative = async () => {
  creativeData['title'] = title
  creativeData['description'] = description

  console.log(creativeData)

  await $api("https://tg-adsnet-api-proxy.goourl.ru/api/campaign/140/creative/add/", {
    method: "POST",
    body: JSON.stringify(creativeData),
  })
}
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
          <DropZone @drop-file="setFile" />
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
