<template>
    <div>
        <div id="editor" style="width: 100%; height: 250px; margin: 0 auto"></div>
    </div>
</template>
<script>
export default {
  name: "UE",
  data() {
    return { 
      editor: null,
    };
  },
  props: {
    defaultMsg: {  //因为使用传值的方法执行完了才传过来,所以不使用,改用setUEContent方法,父组件直接使用方法传过来
      type: String
    },
    config: {
      type: Object
    }
  },
  mounted() {
    const _this = this;
    this.editor = UE.getEditor("editor", this.config); // 初始化UE
    this.editor.addListener("ready", function() {
      _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
    });
  },
  methods: {
    getUEContent() {
      // 获取内容方法
      return this.editor.getContent();
    },
    setUEContent(val){ //将该有的内容放入UE中
      this.editor.setContent(val);
    },
    getUENoEdit(){ //禁止编辑
      this.editor.setDisabled('fullscreen');
    },
  },
  destroyed() {
    this.editor.destroy();
   
  }
};
</script>