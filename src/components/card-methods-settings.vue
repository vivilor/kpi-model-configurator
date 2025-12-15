<script setup lang="ts">
import { Card, Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue';
import { inject } from 'vue';
import MethodCurveBasedTab from './method-curve-based-tab.vue';
import MethodStepsBasedTab from './method-steps-based-tab.vue';
import MethodLinearBasedTab from './method-linear-based-tab.vue';

const App = inject('App')

const { methodTab, methodTabs } = App

</script>

<template>
  <Card>
    <template #title>
      Настройка методов расчета
    </template>

    <template #content>
      <Tabs v-model:value="methodTab">
        <TabList>
          <Tab v-for="t in methodTabs.slice(0, 3)" :key="t.name" :value="t.name">{{ t.label }}</Tab>
        </TabList>
        <TabPanels>
          <MethodStepsBasedTab />

          <MethodLinearBasedTab />

          <MethodCurveBasedTab />

          <TabPanel value="Accum">
            <p class="m-0">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
              totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
              sunt explicabo. Nemo enim
              ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius
              modi.
            </p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>
  </Card>
</template>