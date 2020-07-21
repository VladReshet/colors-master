<template>
  <div>
    <div id="unknown">
      <div class="btn btn-green" id="new-game-button" @click="reset">
        NEW GAME
      </div>
      <div class="unknown-points">
        <div class="unknown" 
             v-for="(color, index) of setup" 
             :key="index" 
             :style="gameOver ? `background-color: ${color};` : ''">
          <span>?</span>
        </div>
      </div>
    </div>
    <div id="game">
      <div class="turn" 
           v-for="(turn, index) of turns" 
           :key="index">
        <div class="results">
          <div class="result-point"
               title="Purple - you guessed one color and position. Yellow - you guessed only color, but not position."
               v-bind:class="{
                'result-full': result === 'full',
                'result-partial': result === 'partial',
               }"
               v-for="(result, id) of turn.results" 
               :key="id"></div>
        </div>
        <div class="turn-choices">
          <color-picker v-for="(color, position) of turn.points"
                        :key="position"
                        :index="position"
                        @picked="picked"
                        :active="index == current"
                        :color="color"></color-picker>
        </div>
        <div class="action-button"
             @click="checkTurn"
             v-show="index == current && ready">
          <div class="img">
            👌
          </div>
        </div>
      </div>
      <div class="gameover" v-show="result === 'win'">
        Congratulations! You Win!
        <br>
        <br>
        <div class="gameover-emoji">
          🎉🥳🎉
        </div>
        <br>
        <div class="btn btn-green" @click="reset">
          NEW GAME
        </div>
      </div>
      <div class="gameover" v-show="result === 'fail'">
        <span style="color: black;">
          Game over! You used all your turns.
        </span>
        <br>
        <br>
        <div class="gameover-emoji">
          😕
        </div>
        <br>
        <div class="btn btn-green" @click="reset">
          NEW GAME
        </div>
      </div>
      <br v-for="i in 5" v-show="!gameOver">
    </div>
  </div>
</template>
<script>
  import ColorPicker from '@/components/ColorPicker.vue'
  import {eventBus} from '@/eventBus.js'

  class Turn {
    constructor () {
      this.state = 'in-progress';

      this.points = {
        '0': undefined,
        '1': undefined,
        '2': undefined,
        '3': undefined,
      };

      this.results = new Array(4).fill(null);
    }
  }

  export default {
    components: {
      [ColorPicker.name]: ColorPicker
    },
    data () {
      return {
        setup: {
          '0': '',
          '1': '',
          '2': '',
          '3': '',
        },
        turns: [],
        result: '',
        gameOver: false
      }
    },
    mounted () {
      this.init();
    },
    computed: {
      current () {
        return this.turns.length - 1;
      },
      currentTurn () {
        return this.turns[this.turns.length - 1];
      },
      ready () {
        for (let field in this.currentTurn.points) {
          if (this.currentTurn.points[field] === undefined) {
            return false;
          }
        }

        return true;
      }
    },
    methods: {
      reset () {
        this.turns = [];
        this.result = '';
        this.gameOver = false;

        for (let i = 0; i < 4; i++) {
          this.setup[i] = this.getRandomColor();
        }

        this.turns.push(new Turn());
      },
      picked ({color, index}) {
        this.turns[this.current].points[index] = color;
      },
      win () {
        this.gameOver = true;

        this.result = 'win';
      },
      fail () {
        this.gameOver = true;

        this.result = 'fail';
      },
      checkTurn () {
        let win = true;

        for (let field in this.currentTurn.points) {
          win = win && (this.currentTurn.points[field] === this.setup[field]);
        }

        win ? this.win() : this.nextTurn();
      },
      calculateResultsOfLastTurn () {
        const result = [];
        let setup = JSON.parse(JSON.stringify(this.setup));
        const points = JSON.parse(JSON.stringify(this.currentTurn.points));

        for (let field in points) {
          let set = Object.values(setup);

          if (points[field] === this.setup[field]) {
            result.push('full');

            delete setup[field];
            delete points[field];
          }
        }

        setup = Object.values(setup);

        for (let field in points) {
          const index = setup.indexOf(points[field]);

          if (index !== -1) {
            result.push('partial');
            
            setup[index] = null;
          }
        }

        while (result.length !== 4) {
          result.push(null);
        }

        this.$set(this.turns[this.current], 'results', result);
      },
      nextTurn () {
        if (this.turns.length === 9) {
          return this.fail();
        }

        this.calculateResultsOfLastTurn();

        this.turns.push(new Turn());
      },
      init () {
        for (let i = 0; i < 4; i++) {
          this.setup[i] = this.getRandomColor();
        }

        this.turns.push(new Turn());
      },
      getRandomColor () {
        const colors = Object.values(this.$colors);

        return colors[(Math.random()  * colors.length) >> 0];
      }
    }
  }
</script>
<style lang="scss">
  $game-width: 56vmin;
  $unknown-width: 53.1vmin;

  body {
    background-size: cover;
  }

  .gameover{
    text-align: center;
    font-family: monospace;
    color: #21ff1e;
    font-size: 3vmin;

    .gameover-emoji {
      font-size: 5vmin;
    }
  }

  #unknown {
    width: $unknown-width;
    left: calc(50% - (#{$unknown-width} / 2 - 1vmin));
    background-color: #54545452;
    position: absolute;
    height: 11vmin;
    border-radius: 2.3vmin;

    .unknown-points {
      text-align: center;
      padding-top: 1.3vmin;
    }

    .unknown{
      background: #a9a9a9ad;
      border: 0.3vmin solid #FFFFFF;
      box-sizing: border-box;
      border-radius: 1.1vmin;
      display: inline-block;
      width: 8vmin;
      height: 8vmin;
      margin-right: 4vmin;

      &:last-of-type {
        margin-right: 0px;
      }

      span {
        color: #fff;
        font-size: 6vmin;
        font-family: monospace;
      }
    }
  }

  #game {
    user-select: none;

    width: $game-width;
    left: calc(50% - (#{$game-width} / 2 + 2vmin));
    background-color: #54545452;

    position: absolute;
    top: 14vmin;
    border: .8vmin rgba(255, 255, 255, 0.76) dashed;
    border-radius: 2.3vmin;
    padding: 2vmin 1vmin;
    margin-bottom: 1.2vmin;

    .turn {
      font-size: 0px;
      margin-bottom: 2.3vmin;
      position: relative;

      &:last-of-type {
        margin-bottom: 0px;
      }

      .action-button {
        font-size: 10vmin;
        position: absolute;
        width: 6vmin;
        height: 6vmin;
        left: calc(100% + 3.05vmin);
        top: 1.6vmin;
        border: 0.8vmin rgba(255, 255, 255, 0.76) double;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.36);
        border-radius: 100px;

        &:hover {
          border-color: #3fff6852;

          .img {
            transform: rotateZ(360deg);
          }
        }

        .img {
          transition: .25s;
          width: 90%;
          position: absolute;
          left: 0.3vmin;
          top: 0.7vmin;
          display: inline-block;
          font-size: 4vmin;
          text-align: center;
        }
      }

      .results {
        display: inline-block;
        width: 2.9vmin;
        height: 11vmin;
        vertical-align: top;
        
        .result-point {
          cursor: help;
          border: .1vmin #fff solid;
          border-radius: 100vmin;
          width: 1.8vmin;
          height: 1.8vmin;
          margin-bottom: .3vmin;

          &:last-of-type {
            margin-bottom: 0px;
          }

          &:first-of-type {
            margin-top: 1.1vmin;
          }
        } 
      }

      .turn-choice {
        &:hover {
          filter: brightness(1.1);
        }
      }

      .pickable {
        &:hover {
          filter: brightness(1) !important;
        }
      }

      .turn-choices {
        display: inline-block;
        width: calc(#{$game-width} - 2.9vmin);
        background: rgba(255, 255, 255, 0.22);
        border: .3vmin solid rgba(255, 255, 255, 0.48);
        box-sizing: border-box;
        border-radius: 2.9vmin;
        text-align: center;
        padding: 1vmin;
        height: 11vmin;
        vertical-align: top;
        width: 53.1vmin;
      }
    }

    .result-full {
      background-color: purple;
    }
    .result-partial {
      background-color: yellow;
    }
  }
  #new-game-button {
    position: absolute;
    left: -30vmin;
    top: 2vmin;
  }
</style>