<template>
  <q-layout view="hHh Lpr lFf">
    <q-header :elevated="!$q.dark.isActive" :bordered="$q.dark.isActive" :class="{ 'bg-dark': $q.dark.isActive }">
      <q-toolbar>
        <q-btn flat dense round aria-label="Menu" icon="mdi-menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          QFilterConfigurator
        </q-toolbar-title>

        <q-btn flat round :icon="$q.dark.isActive ? 'mdi-brightness-2' : 'mdi-brightness-5'" @click="$q.dark.set(!$q.dark.isActive)" />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer bordered :content-class="$q.dark.isActive ? '' : 'bg-grey-2'" v-model="leftDrawerOpen">
      <q-item-label header>Menu</q-item-label>
      <q-list>
        <q-expansion-item group="links" expand-separator default-opened icon="mdi-github" label="Other App Extensions" caption="@heartbeatLV" dark header-class="bg-teal">
          <q-item clickable tag="a" target="_blank" href="https://github.com/heartbeatLV/app-extension-q-filter-configurator" class="text-teal">
            <q-item-section avatar>
              <q-icon name="mdi-tune-vertical" color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>QFilterConfigurator</q-item-label>
              <q-item-label caption>q-filter-configurator</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://github.com/heartbeatLV/app-extension-q-date-picker" class="text-teal">
            <q-item-section avatar>
              <q-icon name="mdi-calendar-blank" color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>QDatePicker</q-item-label>
              <q-item-label caption>q-date-picker</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item group="links" expand-separator icon="mdi-link" label="Quasar Framework" caption="@quasar" dark header-class="bg-primary">
          <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
            <q-item-section avatar>
              <q-icon name="mdi-school" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Docs</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://github.quasar.dev">
            <q-item-section avatar>
              <q-icon name="mdi-code-tags" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Github</q-item-label>
              <q-item-label caption>github.com/quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
            <q-item-section avatar>
              <q-icon name="mdi-message-text" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Discord Chat Channel</q-item-label>
              <q-item-label caption>chat.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
            <q-item-section avatar>
              <q-icon name="mdi-account-voice" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Forum</q-item-label>
              <q-item-label caption>forum.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
            <q-item-section avatar>
              <q-icon name="mdi-rss" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Twitter</q-item-label>
              <q-item-label caption>@quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://facebook.quasar.dev">
            <q-item-section avatar>
              <q-icon name="mdi-earth" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Facebook</q-item-label>
              <q-item-label caption>@QuasarFramework</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL, QExpansionItem } from 'quasar'

export default {
  name: 'MyLayout',
  components: { QExpansionItem },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  created () {
    this.$q.dark.set('auto')
  },

  methods: {
    openURL
  }
}
</script>

<style lang="stylus" scoped>
.q-expansion-item__content a
  padding-left 25px
</style>
