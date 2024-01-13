<script lang="ts">
    import {Chart, Svg, Group, LinearGradient, Arc, Text } from 'layerchart'
	import { cubicInOut } from 'svelte/easing';
    export let open: number
    export let total: number
    export let type: 'Lifts' | 'Runs'
</script>


<div class="flex flex-col items-center h-full p-4 gap-2">
    <div class="p-4 h-[100px]">
    <Chart>
        <Svg title="Number of open {type}">
          <Group center>
            <Group y={16}>
              <LinearGradient
                stops={["rgba(var(--color-tertiary-500) / 1)", "rgba(var(--color-primary-500) / 1)"]}
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
                  tweened={{ duration: 1000, easing: cubicInOut }}
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
    <h4 class="!font-semibold xl:text-lg">{type} Open</h4>
</div>
