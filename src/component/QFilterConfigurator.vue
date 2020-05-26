<template>
  <div class="row q-gutter-y-xs" :class="{ reverse }">
    <div class="col-auto">
      <q-btn v-bind="btnAttrs">
        <q-menu cover anchor="top left" ref="menu" @before-show="initCopy()">
          <div class="row" style="min-width: 700px">
            <div class="col">
              <q-tabs v-model="tab" v-bind="tabsAttrs">
                <q-tab v-for="({ label, icon }, idxN) in validNodes" :key="`tab-${idxN}`" v-bind="{ label, icon, name: idxN, class: 'custom-tab' }" />
              </q-tabs>
            </div>

            <q-separator vertical style="width: 2px" />

            <div class="col">
              <q-input v-model="search" dense borderless class="q-mx-sm custom-input" clearable :placeholder="$q.lang.label.search">
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-separator />
              <q-list dense>
                <q-scroll-area style="height: 250px">
                  <q-expansion-item v-bind="expItemAttrs({ model, multiple, range, idxF })" :key="`filter-${model}`" v-for="({ model, multiple, range, label, options }, idxF) in validFilters(validNodes[tab].filters)">
                    <template #header>
                      <q-item-section>{{label}}</q-item-section>
                      <template v-if="multiple">
                        <q-item-section side>
                          <q-item-label caption v-if="validOptions(options).length !== filteredOptions(options).length">
                            {{filteredOptions(options).length}}/{{validOptions(options).length}}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="mdi-checkbox-multiple-marked" v-if="validOptions(options).length === copy[model].length" @click.stop="$set(copy, model, [])" />
                          <q-icon name="mdi-check-box-multiple-outline" v-else @click.stop="selectAllByModel(validOptions(options), model)" />
                        </q-item-section>
                      </template>
                      <q-item-section side v-else-if="range">
                        <q-icon name="touch_app" />
                      </q-item-section>
                    </template>

                    <q-item v-if="range">
                      <q-item-section>
                        <q-range :color="color" v-model="copy[model]" label v-bind="range" />
                      </q-item-section>
                    </q-item>

                    <q-item v-else dense tag="label" v-for="({ label, value }, idxO) in filteredOptions(options)" :key="`option-${idxO}`">
                      <q-item-section side>
                        <q-checkbox :color="color" dense v-model="copy[model]" :val="value" v-if="multiple" />
                        <q-radio :color="color" dense v-model="copy[model]" :val="value" v-else />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{label}}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item-label caption class="q-px-md q-py-sm" v-if="!range && filteredOptions(options).length === 0">{{$q.lang.table.noResults}}</q-item-label>
                  </q-expansion-item>
                </q-scroll-area>
                <q-separator />
                <q-item-label caption class="custom-header ellipsis">{{validNodes[tab].filters.length}} {{propertiesLabel}}</q-item-label>
              </q-list>
            </div>

            <q-separator vertical style="width: 2px" />

            <div class="col">
              <q-item-label header class="custom-header">
                {{$q.lang.table.selectedRecords(settedValues.length)}}
              </q-item-label>
              <q-separator />
              <q-list dense>
                <q-scroll-area style="height: 281px">
                  <div v-for="([filter, values], idxV) in settedValues" :key="`result-filter-${idxV}`">
                    <template v-if="Array.isArray(values)">
                      <q-item dense class="q-px-sm">
                        <q-item-section>
                          <q-item-label header class="q-pa-none">{{getFilter(filter).label}}</q-item-label>
                        </q-item-section>
                        <q-item-section side v-if="values.length > 1">
                          <q-btn dense flat rounded icon-right="cancel" :color="color" :label="values.length" class="q-pl-sm" @click="$set(copy, filter, [])" />
                        </q-item-section>
                      </q-item>
                      <q-item v-for="(val, index) in values" :key="`result-${filter}-option-${index}`" dense class="q-pl-sm q-pr-md">
                        <q-item-section>
                          <q-item-label class="q-pa-none q-pl-xs">{{getOption(filter, val).label}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="cancel" class="cursor-pointer" @click="removeOption(filter, val)" />
                        </q-item-section>
                      </q-item>
                      <q-separator />
                    </template>

                    <template v-else-if="!!getFilter(filter).range">
                      <q-item-label header class="q-px-sm q-py-xs">{{getFilter(filter).label}}</q-item-label>
                      <q-item dense class="q-pl-sm q-pr-md">
                        <q-item-section>
                          <q-item-label class="q-pl-xs">{{values.min}} - {{values.max}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="cancel" class="cursor-pointer" @click="$set(copy, filter, { min: null, max: null })" />
                        </q-item-section>
                      </q-item>
                      <q-separator />
                    </template>

                    <template v-else>
                      <q-item-label header class="q-px-sm q-py-xs">{{getFilter(filter).label}}</q-item-label>
                      <q-item dense class="q-pl-sm q-pr-md">
                        <q-item-section>
                          <q-item-label class="q-pl-xs">{{getOption(filter, values).label}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="cancel" class="cursor-pointer" @click="$set(copy, filter, null)" />
                        </q-item-section>
                      </q-item>
                      <q-separator />
                    </template>
                  </div>
                </q-scroll-area>
              </q-list>
            </div>
          </div>
          <q-separator />
          <q-card-actions align="right">
            <q-btn no-caps flat dense :label="$q.lang.label.cancel" color="grey-7" @click="$refs.menu.hide()" />
            <q-btn no-caps flat dense :label="$q.lang.label.refresh" color="secondary" @click="initCopy()" />
            <q-btn no-caps flat dense :label="$q.lang.label.clear" color="red" @click="resetCopy()" />
            <q-btn no-caps flat dense :label="$q.lang.label.set" color="primary" @click="emitInput(), $refs.menu.hide()" />
          </q-card-actions>
        </q-menu>
      </q-btn>
    </div>

    <div class="col row" :class="{ reverse }">
      <q-chip @remove="removeFilter(filter, values)" v-bind="chipAttrs" v-for="(values, filter) in removableFilters" :key="`chip-${filter}`">
        <template v-if="Array.isArray(values)">
          {{getFilter(filter).label}} = {{getAllOptionLabels(filter, values, values.length > maxDisplay)}}
          <q-tooltip v-if="values.length > maxDisplay" content-class="q-py-xs q-px-sm text-caption">{{getAllOptionLabels(filter, values, false)}}</q-tooltip>
        </template>
        <template v-else-if="!!getFilter(filter).range">
          {{getFilter(filter).label}} = {{values.min}} - {{values.max}}
        </template>
        <template v-else>
          {{getFilter(filter).label}} = {{getOption(filter, values).label}}
        </template>
      </q-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QFilterConfigurator',
  props: {
    value: {
      type: Object,
      required: true
    },
    propertiesLabel: {
      type: String,
      default: () => 'filter(s) available'
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
    maxDisplay: {
      type: Number,
      default: () => 5,
      validation: val => val > 1
    },
    reverse: Boolean
  },

  data () {
    return {
      tab: 0,
      search: '',
      copy: {}
    }
  },

  created () {
    this.initCopy()
  },

  computed: {
    // css configs
    btnAttrs () {
      return {
        dense: true,
        rounded: true,
        unelevated: true,
        color: this.$q.dark.isActive ? 'grey-9' : this.color + '-1',
        textColor: this.color,
        icon: 'add',
        size: '12px',
        class: 'dashed-border custom-button full-height'
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
      return ({ model, multiple, range, idxF }) => ({
        dense: true,
        expandIconClass: 'custom-toggle',
        denseToggle: true,
        defaultOpened: idxF === 0,
        headerClass: {
          [`text-${this.color} ${this.$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'}`]: this.isSetted({ model, multiple, range }),
          'q-px-sm': true
        }
      })
    },

    // validators
    validNodes () {
      return this.nodes.filter(({ filters }) => this.validFilters(filters).length > 0)
    },
    validFilters () {
      return filters => filters.filter(({ options, model, multiple, range, label }) => {
        let isValid = !this.ignore.includes(model)
        if (multiple) isValid = isValid && options ? this.validOptions(options).length > 0 : false
        if (range) isValid = isValid && (this.search ? this.computeSearch(label) : true)
        return isValid
      })
    },
    validOptions () {
      return opts => (opts[0] && opts[0].label) ? opts : opts.map(label => ({ label, value: label }))
    },

    // others
    computeSearch () {
      return label => label.toLowerCase().indexOf(this.search.toLowerCase()) > -1
    },
    filteredOptions () {
      return opts => this.search ?
        this.validOptions(opts).filter(({ label }) => this.computeSearch(label))
        : this.validOptions(opts)
    },
    removableFilters () {
      return Object.fromEntries(Object.entries(this.value).filter(([key]) => !this.ignore.includes(key)))
    },
    ignoredValues () {
      return Object.fromEntries(Object.entries(this.value).filter(([key]) => this.ignore.includes(key)))
    },

    // getters
    allFilters () {
      return this.validNodes.map(({ filters }) => filters).flat()
    },
    getFilter () {
      return key => this.allFilters.find(({ model }) => key === model)
    },
    getOption () {
      return (key, val) => this.validOptions(this.getFilter(key).options).find(({ value }) => val === value)
    },
    getAllOptionLabels () {
      return (key, values, dense = false) => dense ?
        `${values.length}` :
        this.validOptions(this.getFilter(key).options).filter(({ value }) => values.includes(value)).map(({ label }) => label).join(', ')
    },

    // controls
    isSetted () {
      return ({ model, multiple, range }) => multiple
        ? this.copy[model].length > 0
        : (
          range
            ? (!!this.copy[model].min || this.copy[model].min === 0) && !!this.copy[model].max
            : !!this.copy[model]
        )
    },
    settedValues () {
      return Object.entries(this.copy)
        .filter(([key, value]) => Array.isArray(value)
          ? value.length > 0
          : (
            !!this.getFilter(key).range
              ? (!!value.min || value.min === 0) && !!value.max
              : !!value
          ))
    }
  },

  methods: {
    initCopy () {
      this.validNodes.forEach(({ filters }) => {
        filters.forEach(({ model, multiple, range }) => {
          if (multiple) this.$set(this.copy, model, this.value[model] || [])
          else if (range) this.$set(this.copy, model, {
            min: this.value[model] ? this.value[model].min : null,
            max: this.value[model] ? this.value[model].max : null
          })
          else this.$set(this.copy, model, this.value[model] || null)
        })
      })
    },
    resetCopy () {
      this.validNodes.forEach(({ filters }) => {
        filters.forEach(({ model, multiple, range }) => {
          if (multiple) this.$set(this.copy, model, [])
          else if (range) this.$set(this.copy, model, { min: null, max: null })
          else this.$set(this.copy, model, null)
        })
      })
    },
    removeOption (key, val) {
      let index = this.copy[key].findIndex(value => value === val)
      this.copy[key].splice(index, 1)
    },
    removeFilter (key, value) {
      if (Array.isArray(value)) this.$set(this.copy, key, [])
      else if (this.getFilter(key).range) this.$set(this.copy, key, { min: null, max: null })
      else this.$set(this.copy, key, null)
      this.$delete(this.value, key)
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
