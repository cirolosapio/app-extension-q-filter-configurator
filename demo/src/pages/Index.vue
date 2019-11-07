<template>
  <q-page padding>
    <q-filter-configurator
      v-model="filter"
      :categories="categories"
      :reverse="reverse"
      :btnLabel="btnLabel"
      :propertiesLabel="propertiesLabel"
      :selectedsLabel="selectedsLabel"
      :maxDisplay="maxDisplay"
      :color="color"
      :ignore="ignore"
    />

    <q-badge :color="color" class="q-my-sm">model: {{filter}}</q-badge>

    <div class="row q-mt-md">
      <div class="col-3">
        <q-item-label header>Categories</q-item-label>
        <q-tree :nodes="nodes" node-key="label" default-expand-all>
          <template #default-header="{ node: { label, icon, model } }">
            <div :class="{ 'row items-center': true, 'text-primary': isSelected(model) }">
              <q-icon :name="icon" left />
              <div>{{ label }}</div>
            </div>
          </template>
        </q-tree>
      </div>
      <div class="col-5">
        <q-item-label header>Playground</q-item-label>
        <q-list dense separator bordered class="rounded-borders">
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
              <q-input dense :color="color" borderless v-model="selectedsLabel" label="Label: selecteds" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input hide-bottom-space dense :color="color" borderless v-model="maxDisplay" label="maxDisplay" type="number" :rules="[
                val => val > 1 || 'Number must be positive and > 1'
              ]" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-select dense :color="color" borderless options-dense :options="filters" multiple v-model="ignore" label="Ignored filters" :options-selected-class="`text-${color}`" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import languages from 'quasar/lang/index.json'
export default {
  name: 'PageIndex',

  data () {
    return {
      locale: this.$q.lang.isoName,
      reverse: false,
      maxDisplay: 3,
      color: 'blue',
      btnLabel: 'add filter',
      propertiesLabel: 'properties',
      selectedsLabel: 'selecteds',
      ignore: ['custom_filter'],
      colors: ['blue', 'green', 'purple', 'orange', 'red', 'brown', 'blue-grey', 'teal', 'amber', 'yellow', 'cyan', 'black', 'grey'],
      langOptions: [],

      filter: {
        custom_filter: 'some filter',
        city_id: [10],
        region_flag: 'Italy'
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
            { label: 'Nation', model: 'region_flag', options: ['Italy', 'Los Angeles'] },
            { label: 'City', model: 'city_id', multiple: true, options: [{ label: 'California', value: 10 }, { label: 'Naples', value: 20 }] },
            { label: 'Radius', model: 'radius', range: { min: 10, max: 200 } }
          ]
        },
        {
          label: 'Products',
          icon: 'local_offer',
          filters: [
            { label: 'Categories', model: 'category_id', multiple: true, options: [{ label: 'Electronic', value: 10 }, { label: 'Phones', value: 20 }] },
            { label: 'Brand', model: 'brand_id', multiple: true, options: [{ label: 'Asus', value: 10 }, { label: 'MSI', value: 20 }] }
          ]
        },
        {
          label: 'Phone',
          icon: 'phone',
          filters: [
            { label: 'Screen', model: 'screen_id', options: [{ label: 'Large', value: 'lg' }, { label: 'Medium', value: 'md' }, { label: 'Small', value: 'sm' }] },
            { label: 'Device', model: 'device_id', multiple: true, options: [{ label: 'Samsung', value: 10 }, { label: 'Sony', value: 20 }] }
          ]
        },
        {
          label: 'Orders',
          icon: 'shopping_cart',
          filters: [
            { label: 'Client', model: 'client_ids', multiple: true, options: ['John Doe', 'foobar'] },
            { label: 'Status', model: 'status', options: ['delivered', 'purchased'] }
          ]
        }
      ]
    }
  },

  created () {
    this.langOptions = languages.map(({ isoName, nativeName }) => ({
      label: nativeName, value: isoName
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
        children: filters.map(({ multiple, range, options, ...filter }) => ({
          ...filter,
          icon: multiple ? 'mdi-checkbox-multiple-marked-outline' : (range ? 'touch_app' : 'mdi-check-box-outline')
          // children: options ? options.map(opt => ({ label: opt.label ? opt.label : opt, value: opt.value ? opt.value : opt })) : null
        }))
      }))
    },
    isSelected () {
      return model => Object.entries(this.filter).map(([key]) => key).includes(model)
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
