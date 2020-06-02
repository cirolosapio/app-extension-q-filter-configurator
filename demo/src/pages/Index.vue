<template>
  <q-page padding>
    <q-filter-configurator v-bind="config" v-model="model">
      <template #actions>
        <q-btn label="Save" no-caps flat color="amber" @click="saveConfiguration" />
      </template>
    </q-filter-configurator>

    <q-badge multi-line :outline="$q.dark.isActive" :color="config.color" class="q-my-sm">model: {{ model }}</q-badge>

    <div class="row q-mt-md q-col-gutter-x-md">
      <div class="col">
        <q-item-label header>Nodes</q-item-label>
        <q-tree :nodes="nodes" node-key="model" :selected.sync="selected">
          <template #default-header="{ node: { label, icon, model } }">
            <div :class="{ 'row items-center': true, 'text-primary': isSelected(model) }">
              <q-icon :name="icon" left />
              <div>{{ label }}</div>
            </div>
          </template>
        </q-tree>
      </div>

      <div class="col">
        <q-item-label header>Configuration</q-item-label>
        <template v-if="selected">
          <q-item-label class="q-mb-md text-overline">{{ selected }}</q-item-label>
          <q-markdown no-line-numbers v-for="model in models" v-show="model === selected" :key="model">
```js
{{ getFilter(model) }}
```
          </q-markdown>
        </template>
        <span class="text-caption" v-else>Click on a child node</span>
      </div>

      <div class="col">
        <q-item-label header>Playground</q-item-label>
        <q-list dense separator bordered class="rounded-borders">
          <q-item>
            <q-item-section>
              <q-select v-bind="defaultAttrs" options-dense :options="colors" label="Color" :options-selected-class="`text-${config.color}`" v-model="config.color">
                <template #option="{ opt, itemProps, itemEvents }">
                  <q-item v-bind="itemProps" v-on="itemEvents">
                    <q-item-section>
                      <q-item-label>{{ opt }}</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-badge :color="opt" />
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-select v-bind="defaultAttrs" options-dense :options="langOptions" label="Quasar Language" emit-value map-options v-model="locale" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section>
              <q-item-label>Reverse direction</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-checkbox :color="config.color" v-model="config.reverse" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section>
              <q-item-label>Prepend chip label with node label</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-checkbox :color="config.color" v-model="config.showNodeLabel" />
            </q-item-section>
          </q-item>
          <q-item tag="label" v-if="config.showNodeLabel">
            <q-item-section>
              <q-item-label>Prepend node label with node icon</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-checkbox :color="config.color" v-model="config.showNodeIcon" />
            </q-item-section>
          </q-item>
          <q-item tag="label">
            <q-item-section>
              <q-item-label>Set buttons label to uppercase state</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-checkbox :color="config.color" v-model="config.uppercase" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input v-bind="defaultAttrs" label="Date format" v-model="config.dateFormat">
                <template #append>
                  <q-btn flat dense round icon="mdi-open-in-new" @click="openURL('https://quasar.dev/quasar-utils/date-utils#Format-for-display')">
                    <q-tooltip content-class="text-caption bg-grey-9" transition-show="scale" transition-hide="scale">Available Formats</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input v-bind="defaultAttrs" clearable label="Custom label for 'filters available'" v-model="config.propertiesLabel" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input :min="2" v-bind="defaultAttrs" hide-bottom-space :value="config.maxDisplay" label="Maximum number of values to display" type="number" @input="val => $set(config, 'maxDisplay', val > 1 ? Number(val) : config.maxDisplay)" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-select v-bind="defaultAttrs" readonly options-dense :options="models" multiple label="Ignored filters" :options-selected-class="`text-${config.color}`" v-model="config.ignore" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import languages from 'quasar/lang/index.json'
import { openURL } from 'quasar'
export default {
  name: 'Index',
  data () {
    return {
      selected: '',

      locale: this.$q.lang.isoName,
      langOptions: [],
      colors: ['blue', 'green', 'purple', 'orange', 'red', 'brown', 'blue-grey', 'teal', 'amber', 'yellow', 'cyan', 'black', 'grey'],

      model: {
        custom_filter: 'some filter',
        city_id: [10],
        region_flag: 'Italy'
      },

      config: {
        color: 'blue',
        uppercase: false,
        reverse: false,
        showNodeLabel: true,
        showNodeIcon: false,
        ignore: ['custom_filter'],
        nodes: [
          {
            label: 'General',
            icon: 'mdi-tune-vertical',
            filters: [
              { label: 'When', model: 'created', date: true },
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
            icon: 'mdi-navigation',
            filters: [
              { label: 'Nation', model: 'region_flag', options: ['Italy', 'Los Angeles'] },
              { label: 'City', model: 'city_id', multiple: true, options: [{ label: 'California', value: 10 }, { label: 'Naples', value: 20 }] },
              { label: 'Radius', model: 'radius', range: { min: 10, max: 200 } }
            ]
          },
          {
            label: 'Products',
            icon: 'mdi-tag',
            filters: [
              { label: 'Categories', model: 'category_id', multiple: true, options: [{ label: 'Electronic', value: 10 }, { label: 'Phones', value: 20 }] },
              { label: 'Brand', model: 'brand_id', multiple: true, options: [{ label: 'Asus', value: 10 }, { label: 'MSI', value: 20 }] },
              { label: 'Price (markers)', model: 'price', range: { min: 0, max: 80, step: 20, markers: true } }
            ]
          },
          {
            label: 'Phone',
            icon: 'mdi-phone',
            filters: [
              { label: 'Screen', model: 'screen_id', options: [{ label: 'Large', value: 'lg' }, { label: 'Medium', value: 'md' }, { label: 'Small', value: 'sm' }] },
              { label: 'Device', model: 'device_id', multiple: true, options: [{ label: 'Samsung', value: 10 }, { label: 'Sony', value: 20 }] },
              { label: 'Display (drag-range)', model: 'display', range: { min: 0, max: 200, step: 50, dragRange: true } }
            ]
          },
          {
            label: 'Orders',
            icon: 'mdi-cart',
            filters: [
              { label: 'Client', model: 'client_ids', multiple: true, options: ['John Doe', 'foobar'] },
              { label: 'Status', model: 'status', options: ['delivered', 'purchased'] },
              { label: 'Tax (snap)', model: 'tax', range: { min: 0, max: 200, step: 40, snap: true } }
            ]
          }
        ]
      }
    }
  },

  created () {
    this.langOptions = languages.map(lang => ({
      label: lang.nativeName, value: lang.isoName
    }))
  },

  computed: {
    defaultAttrs () {
      return {
        dense: true,
        borderless: true,
        color: this.config.color
      }
    },
    allFilters () {
      return this.config.nodes.map(({ filters }) => filters).flat()
    },
    models () {
      return ['custom_filter', ...this.allFilters.map(({ model }) => model)]
    },
    getFilter () {
      return key => {
        if (key === 'custom_filter') return {}
        const { label, model, ...rest } = this.allFilters.find(({ model }) => key === model)
        return rest
      }
    },
    nodes () {
      return this.config.nodes.map(({ filters, ...node }) => ({
        ...node,
        model: node.label,
        selectable: false,
        children: filters.map(({ multiple, range, date, options, ...childNode }) => {
          let icon = 'mdi-check-box-outline'
          if (multiple) icon = 'mdi-checkbox-multiple-marked-outline'
          else if (date) icon = 'mdi-calendar-blank'
          else if (range) icon = 'mdi-gesture-tap'
          return { ...childNode, icon }
        })
      }))
    },
    isSelected () {
      return model => Object.entries(this.model).map(([key]) => key).includes(model)
    }
  },

  watch: {
    locale (lang) {
      import(`quasar/lang/${lang}`).then(lang => {
        this.$q.lang.set(lang.default)
      })
    }
  },

  methods: {
    openURL,
    saveConfiguration () {
      this.$q.notify({
        message: 'Filters configurations saved successfully',
        caption: 'example',
        color: this.$q.dark.isActive ? 'dark' : 'primary',
        icon: 'mdi-content-copy'
      })
    }
  }
}
</script>
