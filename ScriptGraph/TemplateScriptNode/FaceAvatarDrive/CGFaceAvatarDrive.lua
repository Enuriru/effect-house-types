local CGFaceAvatarDrive = CGFaceAvatarDrive or {}
CGFaceAvatarDrive.__index = CGFaceAvatarDrive

function CGFaceAvatarDrive.new()
    local self = setmetatable({}, CGFaceAvatarDrive)
    self.inputs = {}
    self.nexts = {}
    self.channels = {
      'browDown_L',
      'browDown_R',
      'browInnerUp',
      'browOuterUp_L',
      'browOuterUp_R',
      'cheekPuff',
      'cheekSquint_L',
      'cheekSquint_R',
      'eyeBlink_L',
      'eyeBlink_R',
      'eyeLookDown_L',
      'eyeLookDown_R',
      'eyeLookIn_L',
      'eyeLookIn_R',
      'eyeLookOut_L',
      'eyeLookOut_R',
      'eyeLookUp_L',
      'eyeLookUp_R',
      'eyeSquint_L',
      'eyeSquint_R',
      'eyeWide_L',
      'eyeWide_R',
      'jawForward',
      'jawLeft',
      'jawOpen',
      'jawRight',
      'mouthClose',
      'mouthDimple_L',
      'mouthDimple_R',
      'mouthFrown_L',
      'mouthFrown_R',
      'mouthFunnel',
      'mouthLeft',
      'mouthLowerDown_L',
      'mouthLowerDown_R',
      'mouthPress_L',
      'mouthPress_R',
      'mouthPucker',
      'mouthRight',
      'mouthRollLower',
      'mouthRollUpper',
      'mouthShrugLower',
      'mouthShrugUpper',
      'mouthSmile_L',
      'mouthSmile_R',
      'mouthStretch_L',
      'mouthStretch_R',
      'mouthUpperUp_L',
      'mouthUpperUp_R',
      'noseSneer_L',
      'noseSneer_R',
      'tongueOut'
    };
    return self
end

function CGFaceAvatarDrive:setNext(index, func)
    self.nexts[index] = func
end

function CGFaceAvatarDrive:setInput(index, func)
    self.inputs[index] = func
end

function CGFaceAvatarDrive:getIndex(key)
  for i = 1, #self.channels do
    if self.channels[i] == key then
      return i - 1;
    end
  end
  return -1;
end

function CGFaceAvatarDrive:execute()
  local result = Amaz.Algorithm.getAEAlgorithmResult()
  if result ~= nil and self.inputs[1] ~= nil then
    local naviAvatarDriveInfo = result:getNaviAvatarDriveInfo()
    local morpher = self.inputs[1]()
    if naviAvatarDriveInfo ~= nil and morpher ~= nil then
      local weights = morpher.channelWeights
      local keys = weights:getVectorKeys()
      for i = 0, keys:size() do
        local key = keys:get(i)
        local index = self:getIndex(key)
        if index >= 0 then 
          morpher:setChannelWeight(key, naviAvatarDriveInfo.blendshapeWeights:get(index))
        end
      end
    end
  end
  if self.nexts[0] then
    self.nexts[0]()
  end
end

return CGFaceAvatarDrive

