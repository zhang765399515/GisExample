
<script lang="ts" setup>

</script>
<template>
    <div class="card">
      <div class="cardHeader">
        <div>
          <div class="control">
            <slot name="header-control"></slot>
          </div>
        </div>
        <slot name="end-control"></slot>
      </div>
      <slot></slot>
    </div>
</template>
  
<style lang='scss' scoped>
  $color-blue: blue;
  $btn-box-shadow: 1px 1px 2px 2px #a8a8a870;
  $color-white: white;
  $color-font: green;
  
  .card {
    // box-shadow: $btn-box-shadow;
    border-radius: 6px;
    background: $color-white;
    flex:1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  
    .defaultPadding {
      // padding: 30px 40px;
    }
  
    .cardHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      // padding: 30px 40px;
  
      .title {
        font-size: 18px;
        color: #131523;
        font-weight: bold;
      }
  
      div,
      span {
        font-size: 20px;
      }
  
      .control {
        display: inline-block;
      }
  
      .el-icon-arrow-up {
        transition: all 0.5s;
      }
  
      .rotate {
        transform: rotate(180deg);
        color: $color-blue;
      }
  
      .collapse {
        font-size: 20px;
        color: #D3D3DB;
  
        &:hover {
          color: $color-blue;
        }
      }
    }
  
    .cardBody {
      height: 100%;
      display: flex;
      flex-direction: column;
      // padding: 30px 40px;
    }
  
    .bodyShow {
      // padding: 0px 40px;
    }
  }
  
  .tabCard {
    .cardHeader {
      padding-bottom: 8px;
  
      .title {
        color: $color-font;
        font-size: 18px;
        font-weight: bold;
        line-height: 25px;
      }
    }
  }
  
  .required {
    color: #E30B0D;
    font-size: 18px;
    font-weight: normal;
  }
  .spf_card_content{
    flex:1;
    overflow: hidden;
    height:0;
  }
</style>