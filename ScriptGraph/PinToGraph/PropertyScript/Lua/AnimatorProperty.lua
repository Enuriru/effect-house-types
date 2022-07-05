local AnimatorProperty = AnimatorProperty or {}
AnimatorProperty.__index = AnimatorProperty

function AnimatorProperty.new()
  local self = setmetatable({}, AnimatorProperty)
  self.wrapMode = nil
  self.animazId = nil
  return self
end

-- setProperty animaz - Animaz
--             wrapMode - wrapModeMap: {string, id}
function AnimatorProperty:getRunningClip(animator)
  local layer = animator:getAnimationLayer(0)
  local clip = layer.currentState.clips:get(0)
  return clip
end

function AnimatorProperty:setWrapMode(animator, animazId, mode)
  local animations = animator.animations
  local animaz = animations:get(animazId)
  local clip = animaz:getClip("", animator)
  clip:setWrapMode(mode)
end

function AnimatorProperty:getWrapMode(animator, animazId)
  local animations = animator.animations
  local animaz = animations:get(animazId)
  local clip = animaz:getClip("", animator)
  return clip:getWrapMode(mode)
end

function AnimatorProperty:setProperty(objects, property, value)
  if #objects == 0 then
    return
  end
  local animator = objects[1];
  if property == 'playback' and self.wrapMode ~= nil then
    local clip = value:getClip("", animator)
    -- Amaz.LOGE("Animaz clip: ", clip.name)
    -- Amaz.LOGE("Animaz Wrap Mode: ", tostring(clip:getWrapMode()))
    animator:play(clip.name, clip:getWrapMode())
  elseif property == 'playMode' and self.animazId ~= nil then
    local animations = animator.animations
    local animaz = animations:get(self.animazId)
    local clip = animaz:getClip("", animator)
    local runningClip = self:getRunningClip(animator)
    clip:setWrapMode(value)
    -- Amaz.LOGE("Clip name: ", clip.name)
    -- Amaz.LOGE("Clip mode: ", tostring(clip:getWrapMode()))
    if clip == runningClip then
      -- Amaz.LOGE("Current clip: ", runningClip.name)
      animator:play(clip.name, clip:getWrapMode())
    end
  end 
end

function AnimatorProperty:getProperty(objects, property)
  if #objects == 0 then
    return nil
  end
  local animator = objects[1];
  if property == 'playback' then
    local runningClip = self:getRunningClip(animator)
    local animations = animator.animations
    for i = 0, animations:size() - 1 do
      local animaz = animations:get(i)
      local clip = animaz:getClip("", animator)
      if clip == runningClip then
        return animaz
      end
    end
    return nil
  elseif property == 'playMode' then
    return self:getWrapMode(animator, self.animazId)
  end
end

return AnimatorProperty