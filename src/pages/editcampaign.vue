<script setup>
import { useCampaignConstants } from '@/assets/campaignConstants'
import DemoSelectBasic from "@/components/DemoSelectBasic.vue"
import DemoSelectChips from "@/components/DemoSelectChips.vue"
import { onBeforeMount, ref } from "vue"
import { useRoute } from 'vue-router'

const campaignData = ref({})
const isPremium = ref("")
const itemTitle = ref("")
const selectedLangs = ref([])
const selectedCountries = ref([])
const selectedPlatforms = ref([])

const route = useRoute()
const campaignConstants = useCampaignConstants()

onBeforeMount(async () => {
  const res = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${route.query.id}`, {
    method: 'GET',
  })

  campaignData.value = res

  res.telegram_premium ? isPremium.value = "Yes" : isPremium.value = "No"
  itemTitle.value = res.title

  res.language.forEach(lang => {
    selectedLangs.value.push(campaignConstants.languages[lang])
  })

  res.country.forEach(country => {
    selectedCountries.value.push(campaignConstants.countries[country])
  })

  res.platform.forEach(platform => {
    selectedPlatforms.value.push(campaignConstants.platforms[platform])
  })
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

  try {
    const res = await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/campaign/${route.query.id}/edit/`, {
      method: 'PATCH',
      body: {
        "title": itemTitle.value,
        "telegram_premium": isPremium.value,
        "platform": patchPlatforms,
        "country": patchCountries,
        "language": patchLangs,
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
              <VCard title="Device">
                <VCardText>
                  <DemoSelectChips />
                </VCardText>
              </VCard>
            </VCol>
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
          </VRow>
        </VCardText>
        <VCardText>
          <VRow>
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
                  <DemoSelectBasic label="Task type" />
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
                  <DemoSelectBasic label="Task type" />
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
                    label="Camaing limit"
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
