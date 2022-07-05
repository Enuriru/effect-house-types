/**
 * @file GraphUtils.js
 * @author xuyuan
 * @date 2021/8/15
 * @brief GraphUtils.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
class GraphUtils {
  constructor() {}

  guidToPointer(guidA, guidB) {
    return Amaz.AmazingUtil.guidToPointer(new Amaz.Guid(guidA, guidB));
  }

  setWatchValue(key, value) {
    Amaz.AmazingUtil.setWatchValue(key, value);
  }

  setWatchValueList(watchList) {
    Amaz.AmazingUtil.setWatchValueList(watchList);
  }
}

exports.GraphUtils = GraphUtils;
