<template>
  <div class="player">
    <div class="shirt">
      <img :src="isTeamA
        ? 'https://mdn.alipayobjects.com/huamei_92awrc/afts/img/A*0oAaS42vqWcAAAAAAAAAAAAADsvfAQ/original'
        : 'https://mdn.alipayobjects.com/huamei_92awrc/afts/img/A*BYH5SauBNecAAAAAAAAAAAAADsvfAQ/original'
      " />
      <div class="number">{{ player_shirtnumber }}</div>
    </div>
    <div class="label">{{ player_name }}</div>
  </div>
</template>

<script>
export default {
  name: 'PlayerNode',
  props: {
    playerInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isTeamA() {
      return this.playerInfo.isTeamA;
    },
    player_shirtnumber() {
      return this.playerInfo.player_shirtnumber;
    },
    player_name() {
      return this.playerInfo.player_name;
    }
  }
};
</script>

<style scoped>
.player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.shirt {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.shirt img {
  width: 40px;
  position: absolute;
  left: 0;
  top: 0;
}

.number {
  color: #fff;
  font-family: 'DingTalk-JinBuTi';
  font-size: 10px;
  top: 20px;
  left: 15px;
  z-index: 1;
  margin-top: 16px;
  margin-left: -2px;
}

.label {
  max-width: 120px;
  padding: 0 8px;
  color: #fff;
  font-size: 10px;
  background-image: url('https://mdn.alipayobjects.com/huamei_92awrc/afts/img/A*s2csQ48M0AkAAAAAAAAAAAAADsvfAQ/original');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
