<template>
  <div class="row q-gutter-y-xs" :class="{ reverse }">
    <div class="col-auto">
      <q-btn v-bind="btnAttrs">
        <div class="q-px-sm" v-if="placeholder && Object.keys(removableFilters).length === 0">{{ placeholder }}</div>
        <q-menu cover anchor="top left" ref="menu" @before-show="initCopy()">
          <div class="row" style="min-width: 750px">
            <div class="col">
              <q-tabs v-bind="tabsAttrs" v-model="tab">
                <q-tab v-bind="{ label, icon, name: idxN, class: 'custom-tab' }" v-for="({ label, icon }, idxN) in validNodes" :key="`tab-${idxN}`" />
              </q-tabs>
            </div>

            <q-separator vertical style="width: 2px" />

            <div class="col">
              <q-input dense borderless class="q-mx-sm custom-input" clearable :placeholder="$q.lang.label.search" v-model="search">
                <template #prepend>
                  <q-icon :name="mdiMagnify" />
                </template>
              </q-input>
              <q-separator />
              <q-list dense>
                <q-scroll-area :style="`height: ${propertiesLabel ? 250 : 281}px`">
                  <q-expansion-item v-bind="expItemAttrs({ model, multiple, range, date, idxF })" v-for="({ model, multiple, range, date, label, options }, idxF) in validFilters(validNodes[tab].filters)" :key="`filter-${model}`">
                    <template #header>
                      <q-item-section>{{ label }}</q-item-section>
                      <template v-if="multiple">
                        <q-item-section side>
                          <q-item-label caption v-if="validOptions(options).length !== filteredOptions(options).length">
                            {{ filteredOptions(options).length }}/{{ validOptions(options).length }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon :name="mdiCheckboxMultipleMarked" v-if="validOptions(options).length === copy[model].length" @click.stop="setCopy(model, [])" />
                          <q-icon :name="mdiCheckBoxMultipleOutline" v-else @click.stop="selectAllByModel(validOptions(options), model)" />
                        </q-item-section>
                      </template>
                      <q-item-section side v-else-if="range">
                        <q-icon :name="mdiGestureTap" />
                      </q-item-section>
                      <q-item-section side v-else-if="date">
                        <q-icon :name="mdiCalendarBlank" />
                      </q-item-section>
                    </template>

                    <slot :name="model" v-bind="{ copy, multiple, range, date, label, options }" v-if="Boolean($scopedSlots[model])" />

                    <q-item v-else-if="range">
                      <q-item-section>
                        <q-range :color="color" label v-bind="range" v-model="copy[model]" />
                      </q-item-section>
                    </q-item>

                    <q-item dense class="q-px-xs q-py-none" v-else-if="date">
                      <q-item-section>
                        <q-input dense borderless :color="color" type="date" v-model="copy[model].from" />
                      </q-item-section>
                      <q-item-section>
                        <q-input dense borderless :color="color" type="date" v-model="copy[model].to" />
                      </q-item-section>
                    </q-item>

                    <q-item dense tag="label" v-for="({ label, value }, idxO) in filteredOptions(options)" v-else :key="`option-${idxO}`">
                      <q-item-section side>
                        <q-checkbox :color="color" dense :val="value" v-if="multiple" v-model="copy[model]" />
                        <q-radio :color="color" dense :val="value" v-else v-model="copy[model]" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ label }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item-label caption class="q-px-md q-py-sm" v-if="!Boolean($scopedSlots[model]) && !range && !date && filteredOptions(options).length === 0">{{ $q.lang.table.noResults }}</q-item-label>
                  </q-expansion-item>
                </q-scroll-area>
                <template v-if="propertiesLabel">
                  <q-separator />
                  <q-item-label caption class="custom-header ellipsis">{{ validNodes[tab].filters.length }} {{ propertiesLabel }}</q-item-label>
                </template>
              </q-list>
            </div>

            <q-separator vertical style="width: 2px" />

            <div class="col">
              <q-item-label header class="custom-header">
                {{ $q.lang.table.selectedRecords(settedValues.length) }}
              </q-item-label>
              <q-separator />
              <q-list dense>
                <q-scroll-area style="height: 281px">
                  <template v-for="([filter, values], idxV) in settedValues">
                    <template v-if="Array.isArray(values)">
                      <q-item dense class="q-px-sm" :key="`result-filter-${idxV}`">
                        <q-item-section>
                          <q-item-label header class="q-pa-none">{{ getFilter(filter).label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side v-if="values.length > 1">
                          <q-icon :color="color" class="cursor-pointer q-mr-sm" :name="mdiCheckboxMultipleMarked" @click="setCopy(filter, [])" />
                        </q-item-section>
                      </q-item>
                      <q-item dense class="q-pl-sm q-pr-md" v-for="(val, index) in values" :key="`result-${filter}-option-${index}`">
                        <q-item-section>
                          <q-item-label class="q-pa-none q-pl-xs">{{ getOption(filter, val).label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon :name="mdiClose" class="cursor-pointer" @click="removeOption(filter, val)" />
                        </q-item-section>
                      </q-item>
                      <q-separator :key="`result-filter-s-${idxV}`" />
                    </template>

                    <template v-else-if="getFilter(filter).date">
                      <q-item-label header class="q-px-sm q-py-xs" :key="`result-filter-l-${idxV}`">{{ getFilter(filter).label }}</q-item-label>
                      <q-item dense class="q-pl-sm q-pr-md" :key="`result-filter-${idxV}`">
                        <q-item-section>
                          <q-item-label class="q-pl-xs">{{ values.from | format(dateFormat) }} - {{ values.to | format(dateFormat) }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon :name="mdiClose" class="cursor-pointer" @click="setCopy(filter, { from: null, to: null })" />
                        </q-item-section>
                      </q-item>
                      <q-separator :key="`result-filter-s-${idxV}`" />
                    </template>

                    <template v-else-if="getFilter(filter).range">
                      <q-item-label header class="q-px-sm q-py-xs" :key="`result-filter-l-${idxV}`">{{ getFilter(filter).label }}</q-item-label>
                      <q-item dense class="q-pl-sm q-pr-md" :key="`result-filter-${idxV}`">
                        <q-item-section>
                          <q-item-label class="q-pl-xs">{{ values.min }} - {{ values.max }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon :name="mdiClose" class="cursor-pointer" @click="setCopy(filter, { min: null, max: null })" />
                        </q-item-section>
                      </q-item>
                      <q-separator :key="`result-filter-s-${idxV}`" />
                    </template>

                    <template v-else>
                      <q-item-label header class="q-px-sm q-py-xs" :key="`result-filter-l-${idxV}`">{{ getFilter(filter).label }}</q-item-label>
                      <q-item dense class="q-pl-sm q-pr-md" :key="`result-filter-${idxV}`">
                        <q-item-section>
                          <q-item-label class="q-pl-xs">{{ getOption(filter, values).label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon :name="mdiClose" class="cursor-pointer" @click="setCopy(filter, null)" />
                        </q-item-section>
                      </q-item>
                      <q-separator :key="`result-filter-s-${idxV}`" />
                    </template>
                  </template>
                </q-scroll-area>
              </q-list>
            </div>
          </div>
          <q-separator />
          <q-card-actions align="right">
            <slot name="actions" />
            <q-btn :no-caps="!uppercase" flat dense :label="$q.lang.label.cancel" color="grey-7" @click="$refs.menu.hide()" />
            <q-btn :no-caps="!uppercase" flat dense :label="$q.lang.label.refresh" color="secondary" @click="initCopy()" />
            <q-btn :no-caps="!uppercase" flat dense :label="$q.lang.label.clear" color="red" @click="resetCopy()" />
            <q-btn :no-caps="!uppercase" flat dense :label="$q.lang.label.set" color="primary" @click="emitInput(), $refs.menu.hide()" />
          </q-card-actions>
        </q-menu>
      </q-btn>
    </div>

    <div class="col row" :class="{ reverse }">
      <q-chip v-bind="chipAttrs" v-for="(values, filter) in removableFilters" :key="`chip-${filter}`" @remove="removeFilter(filter, values)">
        <template v-if="Array.isArray(values)">
          <template v-if="showNodeLabel">
            <q-icon :name="getNodeFromFilter(filter).icon" v-if="showNodeIcon" />
            {{ getNodeFromFilter(filter).label }}:
          </template>
          {{ getFilter(filter).label }} = {{ getAllOptionLabels(filter, values, values.length > maxDisplay) }}
          <q-tooltip v-bind="tooltipProps" v-if="values.length > maxDisplay">{{ getAllOptionLabels(filter, values, false) }}</q-tooltip>
        </template>
        <template v-else-if="getFilter(filter).date">
          <template v-if="showNodeLabel">
            <q-icon :name="getNodeFromFilter(filter).icon" v-if="showNodeIcon" />
            {{ getNodeFromFilter(filter).label }}:
          </template>
          {{ getFilter(filter).label }} = {{ values.from | format(dateFormat) }} - {{ values.to | format(dateFormat) }}
        </template>
        <template v-else-if="getFilter(filter).range">
          <template v-if="showNodeLabel">
            <q-icon :name="getNodeFromFilter(filter).icon" v-if="showNodeIcon" />
            {{ getNodeFromFilter(filter).label }}:
          </template>
          {{ getFilter(filter).label }} = {{ values.min }} - {{ values.max }}
        </template>
        <template v-else>
          <template v-if="showNodeLabel">
            <q-icon :name="getNodeFromFilter(filter).icon" v-if="showNodeIcon" />
            {{ getNodeFromFilter(filter).label }}:
          </template>
          {{ getFilter(filter).label }} = {{ getOption(filter, values).label }}
        </template>
      </q-chip>
    </div>
  </div>
</template>

<script>
import { mdiFilter, mdiPlus, mdiMagnify, mdiClose, mdiGestureTap, mdiCheckboxMultipleMarked, mdiCheckBoxMultipleOutline, mdiCalendarBlank } from '@quasar/extras/mdi-v5'
import { date } from 'quasar'
export default {
  name: 'QFilterConfigurator',
  props: {
    value: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: () => 'blue'
    },
    nodes: {
      type: Array,
      default: () => [],
      validation: nodes => nodes.map(({ filters }) => !!filters && Array.isArray(filters))
    },
    ignore: {
      type: Array,
      default: () => []
    },
    dateFormat: {
      type: String,
      default: () => 'DD/MM/YY'
    },
    maxDisplay: {
      type: [Number, String],
      default: () => 5,
      validation: val => val > 1
    },
    tooltipProps: {
      type: Object,
      default: () => ({
        transitionShow: 'scale',
        transitionHide: 'scale',
        contentClass: 'text-caption'
      })
    },
    placeholder: String,
    propertiesLabel: String,
    reverse: Boolean,
    showNodeLabel: Boolean,
    showNodeIcon: Boolean,
    uppercase: Boolean
  },

  filters: {
    format: (val, format) => date.formatDate(val, format)
  },

  data () {
    return {
      tab: 0,
      search: '',
      copy: {},
      mdiMagnify,
      mdiClose,
      mdiGestureTap,
      mdiCheckboxMultipleMarked,
      mdiCheckBoxMultipleOutline,
      mdiCalendarBlank
    }
  },

  created () {
    this.initCopy()
  },

  computed: {
    // css configs
    btnAttrs () {
      return {
        noCaps: true,
        rounded: true,
        unelevated: true,
        color: this.$q.dark.isActive ? 'grey-9' : this.color + '-1',
        textColor: this.color,
        iconRight: Object.keys(this.removableFilters).length === 0 ? mdiPlus : mdiFilter,
        size: '13px',
        padding: Object.keys(this.removableFilters).length === 0 && this.placeholder ? 'xs sm' : 'xs',
        class: 'dashed-border full-height'
      }
    },
    chipAttrs () {
      return {
        removable: true,
        dense: true,
        color: this.$q.dark.isActive ? 'grey-10' : this.color + '-1',
        textColor: this.color,
        class: 'custom-chip'
      }
    },
    tabsAttrs () {
      return {
        dense: true,
        noCaps: true,
        vertical: true,
        inlineLabel: true,
        switchIndicator: true,
        activeColor: this.color,
        activeBgColor: this.$q.dark.isActive ? 'grey-9' : 'grey-2'
      }
    },
    expItemAttrs () {
      return ({ model, multiple, range, date, idxF }) => ({
        dense: true,
        expandIconClass: 'custom-toggle',
        denseToggle: true,
        expandSeparator: true,
        defaultOpened: idxF === 0,
        headerClass: {
          [`text-${this.color} ${this.$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'}`]: this.isSetted({ model, multiple, range, date }),
          'q-px-sm': true
        }
      })
    },

    // validators
    validNodes () {
      return this.nodes.filter(({ filters }) => this.validFilters(filters).length > 0)
    },
    validFilters () {
      return filters => filters.filter(({ options, model, multiple, range, date, label }) => {
        let isValid = !this.ignore.includes(model)
        if (multiple) isValid = isValid && options ? this.validOptions(options).length > 0 : false
        if (date || range || Boolean(this.$scopedSlots[model])) isValid = isValid && (this.search ? this.computeSearch(label) : true)
        return isValid
      })
    },
    validOptions () {
      return opts => (opts && opts[0] && opts[0].label) ? opts : opts.map(label => ({ label, value: label }))
    },

    // others
    computeSearch () {
      return label => label.toLowerCase().indexOf(this.search.toLowerCase()) > -1
    },
    filteredOptions () {
      return opts => this.search
        ? this.validOptions(opts).filter(({ label }) => this.computeSearch(label))
        : this.validOptions(opts)
    },
    removableFilters () {
      return Object.fromEntries(Object.entries(this.value).filter(([key]) => !this.ignore.includes(key)))
    },
    ignoredValues () {
      return Object.fromEntries(Object.entries(this.value).filter(([key]) => this.ignore.includes(key)))
    },

    // getters
    getNodeFromFilter () {
      return key => {
        return this.validNodes.reduce((t, { filters, ...node }) => {
          if (filters.map(({ model }) => model).includes(key)) t = node
          return t
        }, {})
      }
    },
    allFilters () {
      return this.nodes.map(({ filters }) => filters).flat()
    },
    getFilter () {
      return key => this.allFilters.find(({ model }) => key === model)
    },
    getOption () {
      return (key, val) => this.validOptions(this.getFilter(key).options).find(({ value }) => val === value)
    },
    getAllOptionLabels () {
      return (key, values, dense = false) => dense
        ? `${values.length}`
        : this.validOptions(this.getFilter(key).options).filter(({ value }) => values.includes(value)).map(({ label }) => label).join(', ')
    },

    // controls
    isSetted () {
      return ({ model, multiple, range, date }) => {
        if (multiple) return this.copy[model].length > 0
        else if (date) return !!this.copy[model].from || this.copy[model].to
        else if (range) return (!!this.copy[model].min || this.copy[model].min === 0) && !!this.copy[model].max
        else return !!this.copy[model]
      }
    },
    settedValues () {
      return Object.entries(this.copy)
        .filter(([key, value]) => {
          if (Array.isArray(value)) return value.length > 0
          else if (this.getFilter(key).date) return !!value.from || !!value.to
          else if (this.getFilter(key).range) return (!!value.min || value.min === 0) && !!value.max
          else return !!value
        })
    }
  },

  methods: {
    initCopy () {
      this.validNodes.forEach(({ filters }) => {
        filters.forEach(({ model, multiple, range, date }) => {
          if (multiple) this.$set(this.copy, model, this.value[model] || [])
          else if (date) {
            this.$set(this.copy, model, {
              from: this.value[model] ? this.value[model].from : null,
              to: this.value[model] ? this.value[model].to : null
            })
          } else if (range) {
            this.$set(this.copy, model, {
              min: this.value[model] ? this.value[model].min : null,
              max: this.value[model] ? this.value[model].max : null
            })
          } else this.$set(this.copy, model, this.value[model] || null)
        })
      })
    },
    resetCopy () {
      this.validNodes.forEach(({ filters }) => {
        filters.forEach(({ model, multiple, range, date }) => {
          if (multiple) this.$set(this.copy, model, [])
          else if (date) this.$set(this.copy, model, { from: null, to: null })
          else if (range) this.$set(this.copy, model, { min: null, max: null })
          else this.$set(this.copy, model, null)
        })
      })
    },
    setCopy (key, value) {
      this.$set(this.copy, key, value)
    },
    removeOption (key, val) {
      const index = this.copy[key].findIndex(value => value === val)
      this.copy[key].splice(index, 1)
    },
    removeFilter (key, value) {
      if (Array.isArray(value)) this.$set(this.copy, key, [])
      else if (this.getFilter(key).date) this.$set(this.copy, key, { from: null, to: null })
      else if (this.getFilter(key).range) this.$set(this.copy, key, { min: null, max: null })
      else this.$set(this.copy, key, null)
      this.$delete(this.value, key)
      this.emitInput()
    },
    selectAllByModel (opts, key) {
      opts.forEach(({ value }) => {
        if (!this.copy[key].includes(value)) this.copy[key].push(value)
      })
    },
    emitInput () {
      this.$emit('input', { ...this.ignoredValues, ...Object.fromEntries(this.settedValues) })
    }
  }
}
</script>

<style lang="stylus" scoped>
.dashed-border
  border 1px dashed

.custom-chip
  padding 0 0.6em 0 0.4em

.custom-header
  padding 8px 16px

.q-expansion-item >>>
  .custom-toggle
    padding-left 4px !important

.custom-input
  height 33px

.custom-tab
  justify-content flex-start !important
</style>
