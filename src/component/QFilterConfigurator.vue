<template>
  <div class="row q-gutter-y-xs" :class="{ reverse }">
    <q-btn rounded no-caps unelevated :color="$q.dark.isActive ? 'grey-9' : color + '-1'" :text-color="color" :label="btnLabel" icon-right="add" class="dashed-border custom-button">
      <q-menu cover anchor="top left" ref="menu" @before-show="initMyModel()">
        <div class="row" :style="{ minWidth }">
          <div class="col">
            <q-tabs dense no-caps v-model="category" vertical inline-label switch-indicator :active-color="color"
              :active-bg-color="$q.dark.isActive ? 'grey-9' : 'grey-2'">
              <q-tab v-for="({ label, icon }, indexC) in validCategories"
                :key="`category-${indexC}`"
                :name="indexC"
                :label="label"
                :icon="icon"
                class="custom-tab" />
            </q-tabs>
          </div>

          <q-separator vertical style="width: 2px" />

          <div class="col">
            <q-input v-model="search" dense borderless class="q-mx-sm custom-input" clearable input-style="padding: 2px 0" :placeholder="$q.lang.label.search">
              <!-- :placeholder="`Filtra su ${validCategories[category].label}`" > -->
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-separator />
            <q-list dense>
              <q-scroll-area style="height: 250px">
                <q-expansion-item v-for="({ model, multiple, label, options }, indexF) in validFilters(validCategories[category].filters)" :default-opened="indexF === 0"
                  :header-class="{ [`text-${color} ${$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'}`]: isSetted({ model, multiple }), 'q-px-sm': true }" dense-toggle dense :key="`filter-${model}`" expand-icon-class="custom-toggle">

                  <template #header>
                    <q-item-section>{{label}}</q-item-section>
                    <q-item-section side>
                      <q-item-label caption v-if="validOptions(options).length !== filteredOptions(options).length">
                        {{filteredOptions(options).length}}/{{validOptions(options).length}}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="multiple">
                      <q-icon name="mdi-checkbox-multiple-marked" v-if="validOptions(options).length === myModel[model].length" @click.stop="$set(myModel, model, [])" />
                      <q-icon name="mdi-check-box-multiple-outline" v-else @click.stop="selectAll(validOptions(options), model)" />
                    </q-item-section>
                  </template>

                  <q-item dense tag="label" v-for="({ label, value }, indexO) in filteredOptions(options)" :key="`option-${indexO}`">
                    <q-item-section side v-if="multiple">
                      <q-checkbox :color="color" dense v-model="myModel[model]" :val="value" />
                    </q-item-section>
                    <q-item-section side v-else>
                      <q-radio :color="color" dense v-model="myModel[model]" :val="value" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{label}}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item-label caption class="q-px-md q-py-sm" v-if="filteredOptions(options).length === 0">{{$q.lang.table.noResults}}</q-item-label>
                </q-expansion-item>

                <q-expansion-item v-for="{ model, label } in rangeFilters(validCategories[category].filters)" dense-toggle dense
                  :header-class="{ [`text-${color} ${$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'}`]: isSetted({ model, range: true }), 'q-px-sm': true }" :key="`filter-${model}`" expand-icon-class="custom-toggle">

                  <template #header>
                    <q-item-section>{{label}}</q-item-section>
                    <q-item-section side>
                      <q-icon name="touch_app" />
                    </q-item-section>
                  </template>

                  <q-item>
                    <q-item-section>
                      <q-range :color="color" v-model="myModel[model]" label />
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-scroll-area>
              <q-separator />
              <q-item-label caption class="custom-header ellipsis">{{validCategories[category].filters.length}} {{propertiesLabel}}</q-item-label>
            </q-list>
          </div>

          <q-separator vertical style="width: 2px" />

          <div class="col">
            <q-item-label header class="custom-header">
              {{$q.lang.table.selectedRecords(filtersCount)}}
            </q-item-label>
            <q-separator />
            <q-list dense>
              <q-scroll-area style="height: 281px">
                <div v-for="([filter, values], index) in settedValues" :key="`result-filter-${index}`">
                  <template v-if="Array.isArray(values)">
                    <q-item dense class="q-px-sm">
                      <q-item-section>
                        <q-item-label header class="q-pa-none">{{getFilter(filter).label}}</q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="values.length > 1">
                        <q-btn dense flat rounded icon-right="cancel" :color="color" :label="values.length" class="q-pl-sm" @click="$set(myModel, filter, [])"/>
                      </q-item-section>
                    </q-item>
                    <q-item v-for="(val, index) in values" :key="`result-${filter}-option-${index}`" dense class="q-pl-sm q-pr-md">
                      <q-item-section>
                        <q-item-label class="q-pa-none q-pl-xs">{{getOption(filter, val).label}}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-icon name="cancel" class="cursor-pointer" @click="removeOption(filter, val)"/>
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
                        <q-icon name="cancel" class="cursor-pointer" @click="$set(myModel, filter, { min: null, max: null })" />
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
                        <q-icon name="cancel" class="cursor-pointer" @click="$set(myModel, filter, null)" />
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
          <q-btn no-caps flat dense :label="$q.lang.label.refresh" color="secondary" @click="initMyModel()" />
          <q-btn no-caps flat dense :label="$q.lang.label.clear" color="red" @click="resetMyModel()" />
          <q-btn no-caps flat dense :label="$q.lang.label.set" color="primary" @click="ok(), $refs.menu.hide()" />
        </q-card-actions>
      </q-menu>
    </q-btn>

    <q-chip v-for="(values, filter) in removableFilters" :key="`chip-${filter}`" :color="$q.dark.isActive ? 'grey-10' : color + '-1'" :text-color="color"
      class="custom-chip" :dense="Object.keys(value).length > 5" removable @remove="removeFilter(filter, values)">
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
</template>

<script>
export default {
  name: 'QFilterConfigurator',
  props: {
    value: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      required: true,
      validation: cats => cats.map(({ filters }) => !!filters && Array.isArray(filters))
    },
    ignore: {
      type: Array,
      default: () => []
    },
    maxDisplay: {
      type: [Number, String],
      default: () => 5,
      validation: val => val > 1
    },

    reverse: Boolean,
    minWidth: {
      type: String,
      default: () => '700px'
    },
    color: {
      type: String,
      default: () => 'blue'
    },

    btnLabel: {
      type: String,
      default: () => 'add filter'
    },
    propertiesLabel: {
      type: String,
      default: () => 'properties'
    },
    selectedsLabel: {
      type: String,
      default: () => 'selecteds'
    }
  },

  data () {
    return {
      category: 0,
      search: null,
      myModel: {}
    }
  },

  created () {
    this.initMyModel()
  },

  watch: {
    ignore () {
      this.initMyModel()
    }
  },

  computed: {
    ignoredValues () {
      return Object.fromEntries(Object.entries(this.value).filter(([key]) => this.ignore.includes(key)))
    },

    validCategories () {
      return this.categories.filter(({ filters }) => this.validFilters(filters).length > 0)
    },
    removableFilters () {
      return Object.fromEntries(Object.entries(this.value).filter(([key]) => !this.ignore.includes(key)))
    },
    validFilters () {
      return filters => filters.filter(({ options, model }) =>
        !this.ignore.includes(model) &&
        options ? this.validOptions(options).length > 0 : false
      )
    },
    rangeFilters () { // nome dubbio
      return filters => filters.filter(({ range }) => !!range)
    },
    validOptions () {
      return opts => opts[0] && opts[0].label ? opts : opts.map(label => ({ label, value: label }))
    },

    filteredFilters () {
      return filters => this.search ? this.validFilters(filters).filter(({ label }) =>
        label.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      ) : this.validFilters(filters)
    },
    filteredOptions () {
      return opts => this.search ? this.validOptions(opts).filter(({ label }) =>
        label.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      ) : this.validOptions(opts)
    },

    isSetted () {
      return ({ model, multiple, range }) => multiple
        ? this.myModel[model].length > 0
        : (
          range
            ? (!!this.myModel[model].min || this.myModel[model].min === 0) && !!this.myModel[model].max
            : !!this.myModel[model]
        )
    },
    settedValues () {
      return Object.entries(this.myModel)
        .filter(([key, value]) => Array.isArray(value)
          ? value.length > 0
          : (
            !!this.getFilter(key).range
              ? (!!value.min || value.min === 0) && !!value.max
              : !!value
          ))
    },
    filtersCount () {
      return this.settedValues.length
    },

    allFilters () {
      return this.validCategories.map(category => category.filters).flat()
    },
    getFilter () {
      return key => this.allFilters.find(({ model }) => key === model)
    },
    getOption () {
      return (key, val) => this.validOptions(this.getFilter(key).options).find(({ value }) => val === value)
    },
    getAllOptionLabels () {
      return (key, values, dense = false) => dense ?
        `${values.length} ${this.selectedsLabel}` :
        this.validOptions(this.getFilter(key).options).filter(({ value }) => values.includes(value)).map(({ label }) => label).join(', ')
    }
  },

  methods: {
    initMyModel () {
      this.validCategories.forEach(({ filters }) => {
        filters.forEach(({ model, multiple, range }) => {
          if (multiple) this.$set(this.myModel, model, this.value[model] || [])
          else if (range) this.$set(this.myModel, model, {
            min: !!this.value[model] ? this.value[model].min : null,
            max: !!this.value[model] ? this.value[model].max : null
          })
          else this.$set(this.myModel, model, this.value[model] || null)
        })
      })
    },
    resetMyModel () {
      this.validCategories.forEach(({ filters }) => {
        filters.forEach(({ model, multiple, range }) => {
          if (multiple) this.$set(this.myModel, model, [])
          else if (range) this.$set(this.myModel, model, { min: null, max: null })
          else this.$set(this.myModel, model, null)
        })
      })
    },
    removeOption (key, val) {
      let index = this.myModel[key].findIndex(value => value === val)
      this.myModel[key].splice(index, 1)
    },
    removeFilter (key, value) {
      if (Array.isArray(value)) this.$set(this.myModel, key, [])
      else if (this.getFilter(key).range) this.$set(this.myModel, key, { min: null, max: null })
      else this.$set(this.myModel, key, null)
      this.$delete(this.value, key)
    },
    selectAll (opts, key) {
      opts.forEach(({ value }) => {
        if (!this.myModel[key].includes(value)) this.myModel[key].push(value)
      })
    },
    ok () {
      this.$emit('input', { ...this.ignoredValues, ...Object.fromEntries(this.settedValues) })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .dashed-border
    border 1px dashed
  .custom-button
    font-weight 400
    font-size 14px
    min-height 26px
    height 26px
    padding 0px 10px
  .custom-tab
    justify-content flex-start !important
  .custom-input
    height 33px
  .custom-header
    padding 8px 16px
  .q-expansion-item >>>
    .custom-toggle
      padding-left 4px !important
  .custom-chip
    height 26px
    padding 2px 14px 2px 8px
</style>
