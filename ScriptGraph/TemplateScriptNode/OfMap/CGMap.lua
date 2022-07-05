local CGMap = CGMap or {}
CGMap.__index = CGMap

function CGMap.new()
    local self = setmetatable({}, CGMap)
    self.inputs = {}
    return self
end

function CGMap:setInput(index, func)
    self.inputs[index] = func
end

function CGMap:getOutput(index)
    local _value = self.inputs[0]()
    local _input_min = self.inputs[1]()
    local _input_max = self.inputs[2]()
    local _output_min = self.inputs[3]()
    local _output_max = self.inputs[4]()
    local _clamp = self.inputs[5]()
    local FLT_EPSILON = 1.19209290e-07
    if _value == nil or _input_min == nil or _input_max == nil or _output_min == nil or _output_max == nil or _clamp == nil then
        return nil
    end

    if math.abs(_input_min - _input_max) < FLT_EPSILON then
        return _output_min
    else
        local _out_value = ((_value - _input_min) / (_input_max - _input_min) * (_output_max - _output_min) + _output_min)
        if _clamp then
            if _output_max < _output_min then
                if _out_value < _output_max then
                    _out_value = _output_max
                elseif _out_value > _output_min then
                    _out_value = _output_min
                end
            else
                if _out_value > _output_max then
                    _out_value = _output_max
                elseif _out_value < _output_min then
                    _out_value = _output_min
                end
            end
        end
        return _out_value
    end
end

return CGMap
