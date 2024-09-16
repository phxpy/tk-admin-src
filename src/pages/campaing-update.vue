<script setup>
import DemoSelectBasic from "@/components/DemoSelectBasic.vue"
import DemoSelectChips from "@/components/DemoSelectChips.vue"

const updateCampaign = async () => {
  try {
    const res = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/campaign/142/edit/', {
      method: 'PATCH',
      body: {
        "title": `test_create_camp_${new Date().getDate()}`,
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
        "platform": ["all"],
        "country": ["France"],
        "language": ["FR", "EN"],
      },
    })

    console.log(res)
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
                  <DemoSelectChips />
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
                  <DemoSelectChips />
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
                  <DemoSelectChips />
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
                  <DemoSelectChips />
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
            <VCol
              cols="3"
              md="3"
            >
              <VCard>
                <VCardText>
                  <VBtn
                    color="primary"
                    block
                  >
                    Get test
                  </VBtn>
                </VCardText>
              </VCard>
            </VCol>
            <VCol
              cols="3"
              md="3"
            >
              <VCard>
                <VCardText>
                  <VBtn
                    color="success"
                    block
                  >
                    Test status bar
                  </VBtn>
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
