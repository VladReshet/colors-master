<template>
  <div class="turn-choice turn-choice__active"
       @click.stop="togglePicker"
       v-click-outside="hidePicker"
       v-bind:class="{
        'pickable': picker
       }"
       :style="`background-color: ${color};`">
    <div class="color-picker" v-show="picker">
      <div v-for="color in colors" class="color" 
           :style="`background-color: ${color};`"
           @click.stop="picked(color)">
        {{color}}
      </div>
    </div>
  </div>
</template>
<script>
  import {eventBus} from '@/eventBus.js'
  import ClickOutside from 'vue-click-outside'

  export default {
    name: 'color-picker',
    props: {
      color: {
        type: String,
        default: '#d1d1d1'
      },
      index: {
        type: String
      },
      active: {
        type: Boolean
      }
    },
    directives: {
      ClickOutside
    },
    data () {
      return {
        picker: false
      }
    },
    created () {
      eventBus.$on('close-all-pickers', () => {
        this.picker = false;
      });
    },
    methods: {
      picked (color) {
        this.$emit('picked', {
          color,
          index: this.index 
        });

        this.$nextTick(() => {
          this.picker = false;
        })
      },
      hidePicker () {
        this.picker = false;
      },
      togglePicker () {
        if (!this.active) {
          this.picker = false;

          return;
        }

        eventBus.$emit('close-all-pickers');

        this.picker = !this.picker;   
      }
    },
    computed: {
      colors () {
        return Object.values(this.$colors);
      },
      readyToSubmit () {
        for (let i = 0; i < this.turn.results.length; i++) {
          if (this.turn.results === null) {
            return false;
          }         
        }

        this.$emit('ready');
      }
    }
  }
</script>
<style lang="scss">
  .turn-choice {
    background: #FE0000;
    border: .3vmin solid #FFFFFF;
    box-sizing: border-box;
    border-radius: 1.1vmin;
    display: inline-block;
    width: 8vmin;
    height: 8vmin;
    margin-right: 4vmin;
    position: relative;

    &:last-of-type {
      margin-right: 0px;
    }
  }

  .turn-choice__active {
    cursor: pointer;

    .color-picker {
      position: absolute;
      bottom: -13vmin;
      z-index: 9;
      width: 60vmin;
      left: -15vmin;
      padding: 1.5vmin 0;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 3vmin;

      .color {
        border: .3vmin solid #FFFFFF;
        box-sizing: border-box;
        border-radius: 1.1vmin;
        display: inline-block;
        width: 8vmin;
        height: 8vmin;
        margin-right: 4vmin;
        position: relative;

        &:hover {
          filter: brightness(1.3);
        }

        &:last-of-type {
          margin-right: 0px;
        }
      }
    }
  }

  .pickable {
    border-color: #626262;
  }
</style>