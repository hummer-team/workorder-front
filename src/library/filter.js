const plugin = {
  install: function(Vue) {
    Vue.filter("datetime", function(time) {
      if (!time) {
        return "";
      }
      let date = new Date();
      if (typeof time === "string") {
        let newTime = time.split('-').join('/');
        date = new Date(newTime);
      } else if (val instanceof Date) {
        date = time;
      }
      return date.Format("yyyy/MM/dd hh:mm:ss");
    });

    Vue.filter("date", function(time) {
      if (!time) {
        return "";
      }
      let date = new Date();
      if (typeof time === "string") {
        let newTime = time.split('-').join('/');
        date = new Date(newTime);
      } else if (val instanceof Date) {
        date = time;
      }
      return date.Format("yyyy/MM/dd");
    });

    Vue.filter("channelName", function(channelCode) {
      if (channelCode === "BROS") return "官网";
      if (channelCode === "WXMP") return "微信小程序";
      return "";
    });

    Vue.filter("isEffective", function(isEffective) {
      if (isEffective === true) return "有效";
      if (isEffective === false) return "无效";
      return "";
    });
  }
};

export default plugin;
