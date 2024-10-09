import { defineStore } from 'pinia'

export const useCampaignConstants = defineStore('campaignConstants', {
  state: () => ({
    countries: {},
    languages: {},
    platforms: {},
  }),
  actions: {
    async initializeSets() {
      try {
        const countriesResponse = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/campaign/countries/', {
          method: 'GET',
        })

        this.countries = countriesResponse

        const langsResponse = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/campaign/languages/', {
          method: 'GET',
        })

        this.languages = langsResponse

        const platformsResponse = await $api('https://tg-adsnet-api-proxy.goourl.ru/api/campaign/platforms/', {
          method: 'GET',
        })

        this.platforms = platformsResponse
      } catch (error) {
        console.log(error)
      } finally {
        console.log('constants initialized')
      }
    },
  },
})
