<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu" />

        <q-toolbar-title>
          QFilterConfigurator
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-item-label header>Menu</q-item-label>
      <q-list>
        <q-expansion-item group="links" expand-separator default-opened icon="mdi-github-circle" label="Other App Extensions" caption="@heartbeatLV" dark header-class="bg-teal">
          <q-item clickable tag="a" target="_blank" href="https://github.com/heartbeatLV/app-extension-q-filter-configurator" class="text-teal">
            <q-item-section avatar>
              <q-icon name="tune" color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>QFilterConfigurator</q-item-label>
              <q-item-label caption>q-filter-configurator</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://github.com/heartbeatLV/app-extension-q-date-filter" class="text-teal">
            <q-item-section avatar>
              <q-icon name="mdi-calendar-blank" color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>QDateFilter</q-item-label>
              <q-item-label caption>q-date-filter</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item group="links" expand-separator icon="link" label="Quasar Framework" caption="@quasar" dark header-class="bg-primary">
          <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
            <q-item-section avatar>
              <q-icon name="school" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Docs</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://github.quasar.dev">
            <q-item-section avatar>
              <q-icon name="code" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Github</q-item-label>
              <q-item-label caption>github.com/quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
            <q-item-section avatar>
              <q-icon name="chat" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Discord Chat Channel</q-item-label>
              <q-item-label caption>chat.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
            <q-item-section avatar>
              <q-icon name="record_voice_over" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Forum</q-item-label>
              <q-item-label caption>forum.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
            <q-item-section avatar>
              <q-icon name="rss_feed" color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Twitter</q-item-label>
              <q-item-label caption>@quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable tag="a" target="_blank" href="https://facebook.quasar.dev">
            <q-item-section avatar>
              <q-icon name="public" color="blue" />
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
  methods: {
    openURL
  }
}
</script>

<style lang="stylus" scoped>
.q-expansion-item__content a
  padding-left 25px
</style>
