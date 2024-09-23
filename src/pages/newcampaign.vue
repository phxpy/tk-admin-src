<script setup>
import { useCampaignConstants } from "@/assets/campaignConstants"
import DemoSelectBasic from "@/components/DemoSelectBasic.vue"
import DemoSelectChips from "@/components/DemoSelectChips.vue"

const campaignConstants = useCampaignConstants()

const campTitle = ref("")
const campGeo = ref([])
const campLangs = ref([])
const campPlatforms = ref([])
const isPremium = ref("No")

const createCampaing = async () => {
  const patchPlatforms = []
  for (let key in campaignConstants.platforms) {
    if (campPlatforms.value.includes(campaignConstants.platforms[key])) {
      patchPlatforms.push(key)
    }
  }

  const patchCountries = []
  for (let key in campaignConstants.countries) {
    if (campGeo.value.includes(campaignConstants.countries[key])) {
      patchCountries.push(key)
    }
  }

  const patchLangs = []
  for (let key in campaignConstants.languages) {
    if (campLangs.value.includes(campaignConstants.languages[key])) {
      patchLangs.push(key)
    }
  }

  try {
    await $api('https://tg-adsnet-api-proxy.goourl.ru/api/campaign/add/', {
      method: 'POST',
      body: {
        "title": campTitle.value,
        "description": "test",
        "target_url": "https://web.telegram.org/k/",
        "category": 4,
        "cpc": 1,
        "scf": 1,
        "daily_views_limit": 10000,
        "total_budget": "100",
        "telegram_premium": "true",
        "motivated_traffic": "true",
        "task_type": "2",
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
        title="New campaing"
      >
        <VCardText>
          <AppTextField
            v-model="campTitle"
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
                    v-model="campGeo"
                    :items="Object.values(campaignConstants.countries)"
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
                    v-model="campLangs"
                    :items="Object.values(campaignConstants.languages)"
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
                    v-model="campPlatforms"
                    :items="Object.values(campaignConstants.platforms)"
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
                  Information about system macros
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
            @click="createCampaing"
          >
            Create
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
