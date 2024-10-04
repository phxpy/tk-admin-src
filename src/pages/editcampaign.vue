<script setup>
import { useCampaignConstants } from '@/assets/campaignConstants'
import DemoSelectBasic from "@/components/DemoSelectBasic.vue"
import DemoSelectChips from "@/components/DemoSelectChips.vue"
import { onBeforeMount, ref } from "vue"
import { useRoute } from 'vue-router'

const taskTypesObj = ref({})

const campaignData = ref({})
const isPremium = ref("")
const itemTitle = ref("")
const campDesc = ref("")
const selectedLangs = ref([])
const selectedCountries = ref([])
const selectedPlatforms = ref([])
const selectedTaskType = ref("")
const targetLink = ref("")
const taskTypes = ref([])

const route = useRoute()
const campaignConstants = useCampaignConstants()

onBeforeMount(async () => {
  const res = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${route.query.id}`, {
    method: 'GET',
  })

  campaignData.value = res

  res.telegram_premium ? isPremium.value = "Yes" : isPremium.value = "No"
  itemTitle.value = res.title
  campDesc.value = res.description

  res.language.forEach(lang => {
    selectedLangs.value.push(campaignConstants.languages[lang])
  })

  res.country.forEach(country => {
    selectedCountries.value.push(campaignConstants.countries[country])
  })

  res.platform.forEach(platform => {
    selectedPlatforms.value.push(campaignConstants.platforms[platform])
  })

  const data = await $api("https://tg-adsnet-api-proxy.goourl.ru/api/campaign/tasks/", {
    method: "GET",
  })

  taskTypesObj.value = data

  for (const key in Object.keys(data)) {
    taskTypes.value.push(data[key])
  }

  selectedTaskType.value = taskTypesObj.value[res.task_type]

  targetLink.value = res.target_url
})

const updateCampaign = async () => {  
  const patchPlatforms = []
  for (let key in campaignConstants.platforms) {
    if (selectedPlatforms.value.includes(campaignConstants.platforms[key])) {
      patchPlatforms.push(key)
    }
  }

  const patchCountries = []
  for (let key in campaignConstants.countries) {
    if (selectedCountries.value.includes(campaignConstants.countries[key])) {
      patchCountries.push(key)
    }
  }

  const patchLangs = []
  for (let key in campaignConstants.languages) {
    if (selectedLangs.value.includes(campaignConstants.languages[key])) {
      patchLangs.push(key)
    }
  }

  let patchType = ""
  for (const key in Object.keys(taskTypesObj.value)) {
    if (selectedTaskType.value === taskTypesObj.value[key]) {
      patchType = taskTypesObj.value[key]
    }
  }

  try {
    const res = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${route.query.id}/edit/`, {
      method: 'PATCH',
      body: {
        "title": itemTitle.value,
        "description": campDesc.value,
        "telegram_premium": isPremium.value,
        "platform": patchPlatforms,
        "country": patchCountries,
        "language": patchLangs,
        "target_url": targetLink.value,
        "task_type": patchType,
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
        title="Campaing update"
      >
        <VCardText>
          <AppTextField
            v-model="itemTitle"
            label="Name"
            placeholder="Campaing name"
          />
        </VCardText>
        <VCardText>
          <AppTextarea
            v-model="campDesc"
            label="Campaing description"
            placeholder="Campaing description"
            :rules="[requiredValidator]"
          />
        </VCardText>
        <VCardText>
          <VRow>
            <VCol
              cols="6"
              md="6"
            >
              <!-- 👉 Chips -->
              <VCard title="GEO">
                <VCardText>
                  <DemoSelectChips
                    v-model="selectedCountries"
                    :items="Object.values(campaignConstants.countries)"
                    :selected-items="selectedCountries"
                  />
                </VCardText>
              </VCard>
            </VCol>
            <VCol
              cols="6"
              md="6"
            >
              <!-- 👉 Chips -->
              <VCard title="Language">
                <VCardText>
                  <DemoSelectChips
                    v-model="selectedLangs"
                    :items="Object.values(campaignConstants.languages)"
                    :selected-items="selectedLangs"
                  />
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText>
          <VRow>
            <VCol
              cols="6"
              md="6"
            >
              <!-- 👉 Chips -->
              <VCard title="OS">
                <VCardText>
                  <DemoSelectChips
                    v-model="selectedPlatforms"
                    :items="Object.values(campaignConstants.platforms)"
                    :selected-items="selectedPlatforms"
                  />
                </VCardText>
              </VCard>
            </VCol>
            <VCol
              cols="6"
              md="6"
            >
              <!-- 👉 Chips -->
              <VCard title="Premium">
                <VCardText>
                  <DemoSelectBasic
                    v-model="isPremium"
                    :items="['Yes', 'No']"
                  />
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard
        class="mb-6"
        title="Task settings"
      >
        <VCardText>
          <VRow>
            <VCol
              cols="6"
              md="6"
            >
              <!-- 👉 Basic -->
              <VCard>
                <VCardText>
                  <DemoSelectBasic
                    v-model="selectedTaskType"
                    label="Task type"
                    :items="taskTypes"
                  />
                </VCardText>
              </VCard>
            </VCol>
            <VCol
              cols="6"
              md="6"
            >
              <!-- 👉 Basic -->
              <VCard>
                <VCardText>
                  <AppTextField
                    v-model="targetLink"
                    label="Target link"
                    type="text"
                    :rules="[requiredValidator, urlValidator]"
                  />
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText>
          <VRow>
            <VCol
              cols="6"
              md="6"
            >
              <VCard>
                <VCardText>
                  12312312312312
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard
        class="mb-6"
        title="Finance settings"
      >
        <VCardText>
          <VRow>
            <VCol
              cols="6"
              md="6"
            >
              <VCard>
                <VCardText>
                  <AppTextField
                    label="Task price"
                    prepend-inner-icon="tabler-currency-dollar"
                    placeholder="0.00"
                  />
                </VCardText>
              </VCard>
            </VCol>
            <VCol
              cols="6"
              md="6"
            >
              <VCard>
                <VCardText>
                  <AppTextField
                    label="Campaign limit"
                    prepend-inner-icon="tabler-currency-dollar"
                    placeholder="0.00"
                  />
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
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
            color="primary"
            block
            @click="updateCampaign"
          >
            Update
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
