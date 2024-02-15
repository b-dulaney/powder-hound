<script lang="ts">
    import {Chart, Svg, Group, LinearGradient, Arc, Text } from 'layerchart'
	  import { cubicInOut } from 'svelte/easing';
    export let url: string
    export let open: number
    export let total: number
    export let type: 'Lifts' | 'Runs'

    const pctOpen = open / total * 100
    let arcGradient = ["rgba(var(--color-primary-500) / 1)", "rgba(var(--color-secondary-500) / 1)"]
    if(pctOpen <= 33){
      arcGradient = ["rgba(var(--color-primary-600) / 1)", "rgba(var(--color-primary-500) / 1)"]
    }
    if(pctOpen >= 33 && pctOpen <= 66) {
      arcGradient = ["rgba(var(--color-warning-600) / 1)", "rgba(var(--color-warning-500) / 1)"]
    }
    if(pctOpen >= 66 && pctOpen <= 75) {
      arcGradient = ["rgba(var(--color-warning-500) / 1)", "#0a7854"]
    }
    if(pctOpen >= 75) {
      arcGradient = ["#0a7854", "#0FBA81"]
    }
</script>

<div class="flex flex-col items-center h-full p-4 gap-2 w-full">
    <div class="p-4 h-[100px] w-full">
    <Chart ssr>
        <Svg title="Number of open {type}">
          <Group center>
            <Group y={16}>
              <LinearGradient
                stops={arcGradient}
                let:url
              >
                <Arc
                  initialValue={0}
                  value={open / total * 100}
                  range={[-120, 120]}
                  outerRadius={60}
                  innerRadius={50}
                  cornerRadius={5}
                  spring
                  fill={url}
                  track={{ class: "fill-surface-600" }}
                >
                  <Text
                    value={`${open} / ${total}`}
                    textAnchor="middle"
                    verticalAnchor="middle"
                    class="text-xl fill-surface-100"
                  />
                </Arc>
              </LinearGradient>
            </Group>
          </Group>
        </Svg>
      </Chart>
    </div>
    <a class="anchor xl:text-lg !text-surface-50" href={url} target="_blank" rel="noopener">{type} Open <span class="text-2xl">&rsaquo;</span></a>
</div>
