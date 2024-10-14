<script setup>
import { useCommonStore } from '@/assets/global'
import { computed, ref } from 'vue'

const commonStore = useCommonStore()
const siteData = ref([])
const sortedSites = ref([])

const page = ref(1)
const itemsPerPage = ref(10)

const headers = [
  {
    title: 'Site Id',
    key: 'id',
    sortable: true,
  },
  {
    title: 'Name',
    key: 'name',
    sortable: true,
  },
  {
    title: 'description',
    key: 'description',
    sortable: true,
  },
  {
    title: 'Target URL',
    key: 'target_url',
    sortable: true,
  },
  {
    title: 'Action',
    key: 'actions',
    sortable: false,
  },
]

const loadings = ref({})

const sortSites = options => {
  if (!options || !options.sortBy.length) {
    sortedSites.value = siteData.value
  } else {
    if (options.sortBy[0].key === "date") {
      sortedSites.value = siteData.value.toSorted((a, b) => {
        const aDate = +(new Date(a["created_at"]))
        const bDate = +(new Date(b["created_at"]))

        if (options.sortBy.length && options.sortBy[0]["order"] === "asc") {
          return aDate > bDate
        } else if (options.sortBy.length && options.sortBy[0]["order"] === "desc") {
          return aDate < bDate
        }
      })
    } else {
      sortedSites.value = siteData.value.toSorted((a, b) => {
        if (options.sortBy.length && options.sortBy[0]["order"] === "asc") {
          return a[options.sortBy[0]["key"]] > b[options.sortBy[0]["key"]]
        } else if (options.sortBy.length && options.sortBy[0]["order"] === "desc") {
          return a[options.sortBy[0]["key"]] < b[options.sortBy[0]["key"]]
        }
      })
    }
  }
}

const updateOptions = options => sortSites(options)

const getSites = async () => {
  const data = await $api("https://tg-adsnet-api-proxy.goourl.ru/api/site/", {
    method: 'GET',
  })
  
  siteData.value = data.toSorted((a, b) => {
    return a.id < b.id
  })
  sortSites()
}

const deleteSite = async id => {
  loadings.value[id] = 1

  try {
    await $api(`https://tg-adsnet-api-proxy.goourl.ru/api/site/${id}/delete/`, {
      method: 'DELETE',
    })
    
    getSites()
  } catch (error) {
    console.log(error)
  } finally {
    loadings.value[id] = false
  }
}

onMounted(async () => {
  getSites()
})

const sites = computed(() => {
  if (!sortedSites.value || !sortedSites.value.length) {
    return []
  } else {
    return sortedSites.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
  }
})

const totalOrder = computed(() => {
  if (!siteData.value || !siteData.value.length) {
    return 0
  } else {
    return siteData.value.length
  }
})
</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-space-between align-center flex-wrap gap-4">
      <div class="d-flex gap-4 align-center flex-wrap">
        <div class="d-flex align-center gap-2">
          <span>Show on page</span>
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: 1000, title: 'All' },
            ]"
            style="inline-size: 5.5rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
        </div>
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'newsite' }"
        >
          New site
        </VBtn>
      </div>
    </VCardText>
    <VDivider />
    <!-- 👉 Order Table -->
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="sites"
      :items-length="totalOrder"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <template #item.id="{ item }">
        {{ item.id }}
      </template>

      <template #item.name="{ item }">
        {{ item.name }}
      </template>

      <template #item.description="{ item }">
        {{ item.description }}
      </template>

      <template #item.target_url="{ item }">
        <a
          :href="item.target_url"
          class="target-url__link"
          :class="{'target-url__link--disabled': loadings[item.id] }"
        >{{ item.target_url }}</a>
      </template>

      <template #item.actions="{ item }">
        <IconBtn
          :to="{ name: 'widgets', query: { id: item.id } }"
          :disabled="loadings[item.id]"
        >
          <VIcon icon="tabler-eye" />
        </IconBtn>

        <IconBtn
          :loading="loadings[item.id]"
          :disabled="loadings[item.id]"
          @click="deleteSite(item.id)"
        >
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>

      <!-- pagination -->
      <template #bottom>
        <TablePagination
          v-model:page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalOrder"
        />
      </template>
    </VDataTableServer>
  </VCard>
</template>

<style lang="scss" scoped>
.customer-title:hover {
  color: rgba(var(--v-theme-primary)) !important;
}

.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}

.target-url__link--disabled,
.target-url__link--disabled:hover {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  pointer-events: none;
}
</style>

