local exports = exports or {}
local GraphSystem = GraphSystem or {}
GraphSystem.__index = GraphSystem

local nodes = {}
local variables = {}
local __callbackNode ={}
__callbackNode["onStart"] = {}
__callbackNode["onUpdate"] = {}
__callbackNode["onEvent"] = {}
__callbackNode["onCallBack"] = {}
__callbackNode["beforeOnStart"] = {}


function GraphSystem.new(construct, ...)
    local self = setmetatable({}, GraphSystem)
    self.comps = {}
    self.compsdirty = true

    local lua = {}
    -- member variable init
    -- init all variables

    variables["var0"] = 0 

    -- nodeInit
    --include all needed file first


    -- init node properties




    -- nodeConnect


    -- init callback table

    return self
end

function GraphSystem:constructor()
    -- Amaz.LOGE("INFO: ", "GraphSystem:constructor")
end

function GraphSystem:onComponentAdded(sys, comp)
    -- Amaz.LOGE("INFO: ", "GraphSystem:onComponentAdded")
end

function GraphSystem:onComponentRemoved(sys, comp)
    -- Amaz.LOGE("INFO: ", "GraphSystem:onComponentRemoved")
end

function GraphSystem:onStart(sys)
    -- Amaz.LOGE("INFO: ", "GraphSystem:onStart")
    for i=1, #__callbackNode["onStart"] do
        __callbackNode["onStart"][i]:execute(sys)
    end
end

function GraphSystem:onEvent(sys, event)
    -- Amaz.LOGE("INFO: ", "GraphSystem:onEvent")
    for i=1, #__callbackNode["onEvent"] do
        __callbackNode["onEvent"][i]:execute(sys, event)
    end
end

function GraphSystem:onCallBack(sys, userData, eventType)
    -- Amaz.LOGE("INFO: ", "GraphSystem:onCallBack")
    for i=1, #__callbackNode["onCallBack"] do
        __callbackNode["onCallBack"][i]:callback(sys, userData, eventType)
    end
end

function GraphSystem:onUpdate(sys,deltaTime)
    -- Amaz.LOGE("INFO: ", "GraphSystem:onUpdate")
    for i=1, #__callbackNode["onUpdate"] do
        __callbackNode["onUpdate"][i]:update(sys, deltaTime)
    end
end


function generateEmptyNode()
    local node = {}
    node.nexts = {}
    node.inputs = {}
    node.setNext = function(__self, __index, __next) __self.nexts[__index] = __next end
    node.setInput = function(__self, __index, __func) __self.inputs[__index] = __func end
    return node
end

exports.GraphSystem = GraphSystem
return exports
