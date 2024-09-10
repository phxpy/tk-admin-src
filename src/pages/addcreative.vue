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
          <DropZone />
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
          >
            Add creative
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
