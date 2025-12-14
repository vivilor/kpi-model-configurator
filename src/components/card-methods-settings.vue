<script setup lang="ts">
import { Card, Tab, TabList, TabPanel, TabPanels, Tabs } from 'primevue';
import MethodStepsBasedTab from './method-steps-based-tab.vue';
import MethodCurveBasedTab from './method-curve-based-tab.vue';
import { inject } from 'vue';

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
          <Tab v-for="t in methodTabs" :key="t.name" :value="t.name">{{ t.label }}</Tab>
        </TabList>
        <TabPanels>
          <MethodStepsBasedTab />

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
          <TabPanel value="Linear">
            <p class="m-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
              deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa
              qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est
              et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
              quo minus.
            </p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </template>
  </Card>
</template>