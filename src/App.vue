<template>
  <div id="app">
    <br>
    <div class="view">
      <router-view/>
    </div>
  </div>
</template>
<style lang="scss">
  .view {
    position: relative;
  }
  .navbar {
    padding: 3vmin 5vmin;
  }
  .btn {
    display: inline-block;
    padding: 1.2vmin 3vmin;
    text-decoration: none;
    border-radius: 1.2vmin;
    font-family: monospace;
    font-size: 2.5vmin;
    letter-spacing: .3vmin;
    font-weight: 700;
  }
  .btn-green {
    background-color: #63e23a;
    color: #fff;
    text-align: center;
    border-bottom: .2vmin #398c1f solid;

    &:hover {
      cursor: pointer;
      background-color: #91f571;
    }

    &:active{
      border-top: .2vmin #398c1f solid;
      border-bottom: none;
      background-color: #56c731;
    }
  }
</style>
