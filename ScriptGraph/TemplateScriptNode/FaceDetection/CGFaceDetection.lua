local CGFaceDetection = CGFaceDetection or {}
CGFaceDetection.__index = CGFaceDetection

function CGFaceDetection.new()
    local self = setmetatable({}, CGFaceDetection)
    self.inputs = {}
    self.outputs = {}
    self.nexts = {}
    self.face2ID = {}
    self.faceCount = 0
    return self
end

function CGFaceDetection:setNext(index, func)
    self.nexts[index] = func
end

function CGFaceDetection:setInput(index, func)
    self.inputs[index] = func
end

function CGFaceDetection:getOutput(index)
    return self.outputs[index]
end

function CGFaceDetection:update()
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local selectedFace = self.inputs[0]()
    local curFaceCount = result:getFaceCount()
    if selectedFace == 0 then
        if self.nexts[0] and curFaceCount > 0 then
            self.nexts[0]()
        end
        if self.nexts[1] and curFaceCount == 0 then
            self.nexts[1]()
        end
        if self.nexts[2] and curFaceCount > 0 and self.faceCount == 0 then
            self.nexts[2]()
        end
        if self.nexts[3] and curFaceCount == 0 and self.faceCount > 0 then
            self.nexts[3]()
        end
        self.faceCount = curFaceCount
    else
        local lastFaceID = self.face2ID[selectedFace]
        for i = 1, 5 do
            if self.face2ID[i] then
                local IDFound = false
                for j = 0, curFaceCount - 1 do
                    local face = result:getFaceBaseInfo(j)
                    if face.ID == self.face2ID[i] then
                        IDFound = true
                    end
                end
                if not IDFound then
                    self.face2ID[i] = nil
                end
            end 
        end
        for i = 0, curFaceCount - 1 do
            local face = result:getFaceBaseInfo(i)
            local IDNotFound = true
            for j = 1, 5 do
                if self.face2ID[j] == face.ID then
                    IDNotFound = false
                end
            end
            if IDNotFound then
                for j = 1, 5 do
                    if not self.face2ID[j] then
                        self.face2ID[j] = face.ID
                        break
                    end
                end
            end
        end

        local curFaceID = self.face2ID[selectedFace]
        if self.nexts[0] and curFaceID then
            self.nexts[0]()
        end
        if self.nexts[1] and not curFaceID then
            self.nexts[1]()
        end
        if self.nexts[2] and not lastFaceID and curFaceID then
            self.nexts[2]()
        end
        if self.nexts[3] and lastFaceID and not curFaceID then
            self.nexts[3]()
        end
    end
    -- face rect
    local face = result:getFaceBaseInfo(selectedFace - 1)
    if face then
        self.outputs[4] = face.rect
    end
    
end

return CGFaceDetection
