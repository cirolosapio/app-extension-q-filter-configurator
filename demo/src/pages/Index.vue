<template>
  <q-page padding>
    <q-filter-configurator
      v-model="filter"
      :categories="categories"
      :reverse="reverse"
      :btnLabel="btnLabel"
      :propertiesLabel="propertiesLabel"
      :maxDisplay="maxDisplay"
      :color="color"
      :ignore="ignore"
    />

    <q-badge :color="color">model: {{filter}}</q-badge>

    <q-list dense separator bordered style="max-wdith: 500px" class="q-my-md rounded-borders">
      <q-item-label header>Playground</q-item-label>
      <q-item>
        <q-item-section>
          <q-select dense :color="color" borderless options-dense :options="colors" v-model="color" label="Color" :options-selected-class="`text-${color}`" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select v-model="locale" :options="langOptions" label="Quasar Language" dense borderless emit-value map-options options-dense />
        </q-item-section>
      </q-item>
      <q-item tag="label">
        <q-item-section>
          <q-item-label>Reverse direction</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-checkbox :color="color" v-model="reverse" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input dense :color="color" borderless v-model="btnLabel" label="Button label" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input dense :color="color" borderless v-model="propertiesLabel" label="Label: properties" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input dense :color="color" borderless v-model="maxDisplay" label="maxDisplay" type="number" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select dense :color="color" borderless options-dense :options="filters" multiple v-model="ignore" label="Ignored filters" :options-selected-class="`text-${color}`" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-item-label header>Categories</q-item-label>
    <q-tree :nodes="nodes" node-key="label" />
  </q-page>
</template>

<style>
</style>

<script>
import languages from 'quasar/lang/index.json'
import { QBadge, QSelect, QCheckbox, QInput, QTree } from 'quasar'
export default {
  name: 'PageIndex',
  components: { QBadge, QSelect, QCheckbox, QInput, QTree },

  data () {
    return {
      locale: this.$q.lang.isoName,
      reverse: false,
      maxDisplay: 3,
      color: 'blue',
      btnLabel: 'add filter',
      propertiesLabel: 'properties',
      ignore: ['custom_filter'],
      colors: ['blue', 'green', 'purple', 'orange', 'red', 'brown', 'blue-grey', 'teal', 'amber', 'yellow', 'cyan', 'black', 'grey'],
      langOptions: [],

      filter: {
        custom_filter: 'some filter',
        city_id: [10]
      },

      categories: [
        {
          label: 'General',
          icon: 'tune',
          filters: [
            {
              label: 'Provenience',
              model: 'provenience_ids',
              multiple: true,
              options: [
                { label: 'Leaflet', value: 2 },
                { label: 'Advertising', value: 3 },
                { label: 'Tv', value: 4 },
                { label: 'Social', value: 5 },
                { label: 'Web Site', value: 6 }
              ]
            }
          ]
        },
        {
          label: 'Map',
          icon: 'navigation',
          filters: [
            { label: 'City', model: 'city_id', multiple: true, options: [{ label: 'California', value: 10 }, { label: 'Naples', value: 20 }] }
          ]
        },
        {
          label: 'Products',
          icon: 'local_offer',
          filters: [
            { label: 'Categories', model: 'category_id', multiple: true, options: [{ label: 'Electronic', value: 10 }, { label: 'Phones', value: 20 }] },
            { label: 'Brand', model: 'brand_id', multiple: true, options: [{ label: 'Samsung', value: 10 }, { label: 'Sony', value: 20 }] }
          ]
        },
        {
          label: 'Orders',
          icon: 'shopping_cart',
          filters: [
            { label: 'Client', model: 'client_ids', multiple: true, options: ['John Doe', 'fobar'] },
            { label: 'Status', model: 'status', options: ['delivered', 'purchased'] }
          ]
        }
      ]
    }
  },

  created () {
    this.langOptions = languages.map(lang => ({
      label: lang.nativeName, value: lang.isoName
    }))
  },

  computed: {
    filters () {
      let cats = this.categories.map(({ filters }) => filters.map(({ model }) => model)).flat()
      cats.unshift('custom_filter')
      return cats
    },
    nodes () {
      return this.categories.map(({ filters, ...cat }) => ({
        ...cat,
        children: filters.map(({ multiple, options, ...filter }) => ({
          ...filter,
          icon: multiple ? 'mdi-checkbox-multiple-marked-outline' : 'mdi-check-box-outline',
          children: options.map(opt => ({ label: opt.label ? opt.label : opt, value: opt.value ? opt.value : opt }))
        }))
      }))
    }
  },

  watch: {
    ignore () {
      this.resetModel()
    },
    locale (lang) {
      import(`quasar/lang/${lang}`).then(lang => {
        this.$q.lang.set(lang.default)
      })
    }
  },

  methods: {
    resetModel () {
      this.filter = {}
    }
  }
}
</script>
