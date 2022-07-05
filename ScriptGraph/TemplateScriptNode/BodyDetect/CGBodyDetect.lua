local CGBodyDetect = CGBodyDetect or {}
CGBodyDetect.__index = CGBodyDetect

function CGBodyDetect.new()
  local self = setmetatable({}, CGBodyDetect)
  self.inputs = {}
  self.outputs = {}
  self.nexts = {}
  self.detected = false
  return self
end

function CGBodyDetect:getOutput(index)
  return self.outputs[index]
end

function CGBodyDetect:setNext(index, func)
  self.nexts[index] = func
end

function CGBodyDetect:update()
  if self.nexts[0] == nil and self.nexts[1] == nil and self.nexts[2] == nil then
    return
  end
  
  local result = Amaz.Algorithm.getAEAlgorithmResult()
  local count = result:getSkeletonCount()
  if count > 0 and self.detected == false then
    self.detected = true
    if self.nexts[0] then
      self.nexts[0]()
    end
  elseif count == 0 and self.detected == true then
    self.detected = false
    if self.nexts[2] then
      self.nexts[2]()
    end
  end
  if count > 0 then
    local skeleton = result:getSkeletonInfo(0)
    local rect = skeleton.rect
    -- Amaz.LOGE("skeleton rect x: ", tostring(rect.x))
    -- Amaz.LOGE("skeleton rect y: ", tostring(rect.y))
    -- Amaz.LOGE("skeleton rect w: ", tostring(rect.width))
    -- Amaz.LOGE("skeleton rect h: ", tostring(rect.height))
    if rect.x > 0 and rect.x + rect.width < 1 and rect.y > 0 and rect.y + rect.height < 1 then
      if self.nexts[1] then
        self.nexts[1]()
      end
    end
  end 
end

return CGBodyDetect