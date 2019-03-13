<template>
  <div class="page-not-found-container dialog">
    <div class="head">
      <h1>{{$t('m.notFoundTitle')}}</h1>
      <p>{{$t('m.notFoundCopy')}}</p>
    </div>
    <div class="nav">
      <a href="/#/">{{$t('m.notFoundGotop')}}</a>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .page-not-found-container {
    width: 95%;
    max-width: 33em;
    background-color: #EFEFEF;
    color: #2E2F30;
    text-align: center;
    margin: 4em auto 0;
  }

  .head {
    border: 1px solid #CCC;
    border-right-color: #999;
    border-left-color: #999;
    border-bottom-color: #BBB;
    border-top: #B00100 solid 4px;
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    background-color: white;
    padding: 7px 12% 0;
    box-shadow: 0 3px 8px rgba(50, 50, 50, 0.17);
    > h1 {
      font-size: 18px;
      font-weight: bold;
      color: #730E15;
      line-height: 1.5em;
      margin: 0.67em 0;
    }
    > p {
      margin: 1em 0;
    }
  }

  .nav {
    margin: 0 0 1em;
    padding: 1em;
    background-color: #F7F7F7;
    border: 1px solid #CCC;
    border-right-color: #999;
    border-left-color: #999;
    border-bottom-color: #999;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top-color: #DADADA;
    color: #666;
    box-shadow: 0 3px 8px rgba(50, 50, 50, 0.17);
    a {
      font-size: 15px;
    }
  }
</style>