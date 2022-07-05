

HableCurve = ScriptableObject()

local Segment = { offsetX =1.0 ,offsetY = 1.0 , scaleX = 1.0, scaleY = 1.0,lnA =1.0,B =1.0 }
function Segment : new(o)
    o = o or {}
    setmetatable(o, self)
    self.__index = self
    return o
end
local function Exp2(x)
    return math.exp(x * 0.69314718055994530941723212145818)
end

function Segment : Eval(x)
    local x0 = (x - self.offsetX) * self.scaleX;
    local y0 = 0
    if x0 > 0 then
        y0 = math.exp(self.lnA + self.B * math.log(x0));
    end
    return y0 * self.scaleY + self.offsetY;
end


local DirectParams = { x0 =1.0 ,y0 = 1.0 , x1 = 1.0, y1 = 1.0,W =1.0,overshootX=0.0,overshootY =0.0,gamma = 0.0}
function DirectParams : new(o)
    o = o or {}
    setmetatable(o, self)
    self.__index = self
    return o
end

local function Exp2(x)
    return math.exp(x * 0.69314718055994530941723212145818)
end

local function clamp(x,min,max)
    if x<min then
        return min
    elseif x >max then
        return max
    else
        return x
    end
end
local function clamp01(x)
    return clamp(x, 0, 1)
end

local function  SolveAB(lnA, B, x0, y0, m)
    local B0 = (m * x0) / y0;
    local lnA0 = math.log(y0) - B0 * math.log(x0)
    return lnA0,B0
end


local function AsSlopeIntercept(m, b, x0, x1, y0, y1)
    local dy = (y1 - y0);
    local dx = (x1 - x0);
    local m0
    local b0
    if (dx == 0) then
        m0 = 1.0
    else
        m0 = dy / dx;
    end
    b0 = y0 - x0 * m0;
    return m0,b0

end

-- --f(x) = (mx+b)^g
-- --f'(x) = gm(mx+b)^(g-1)
local function EvalDerivativeLinearGamma( m,  b,  g,  x)
    local ret = g * m * math.pow(m * x + b, g - 1)
    return ret
end

function HableCurve : ctor()
    self.whitePoint = 1.0
    self.inverseWhitePoint = 1.0
    self.x0 =0.5
    self.x1 =0.5
    self.m_Segments = {}
    for i=1,3 do
        local seg = Segment:new(nil)
        table.insert(self.m_Segments,seg)
    end
    -- self.uniforms
end

function HableCurve : Eval(x)
    local normX = x * self.inverseWhitePoint
    local index
    if normX <self.x0 then
        index = 0
    else
        if normX<self.x1 then
            index = 1
        else
            index = 2
        end
    end
    local seg = self.m_Segments[index];
    local ret = seg:Eval(normX)
    return ret
end


function HableCurve : InitSegments(srcParams)

    local paramsCopy = DirectParams:new(nil)
    paramsCopy.x0 = srcParams.x0
    paramsCopy.y0 = srcParams.y0
    paramsCopy.x1 = srcParams.x1
    paramsCopy.y1 = srcParams.y1
    paramsCopy.W = srcParams.W
    paramsCopy.overshootX = srcParams.overshootX
    paramsCopy.overshootY = srcParams.overshootY
    paramsCopy.gamma = srcParams.gamma


    self.whitePoint = srcParams.W;
    self.inverseWhitePoint = 1.0 / srcParams.W;

    paramsCopy.W = 1;
    paramsCopy.x0 = paramsCopy.x0/srcParams.W;
    paramsCopy.x1 = paramsCopy.x1/srcParams.W;
    paramsCopy.overshootX = srcParams.overshootX / srcParams.W;

    local toeM = 0.0;
    local shoulderM = 0.0;



    local m0, b0
    m0, b0 = AsSlopeIntercept(m0, b0, paramsCopy.x0, paramsCopy.x1, paramsCopy.y0, paramsCopy.y1)
    local g = srcParams.gamma
    
    local midSegment = self.m_Segments[2];
    midSegment.offsetX = -(b0 / m0);
    midSegment.offsetY = 0;
    midSegment.scaleX = 1;
    midSegment.scaleY = 1;
    midSegment.lnA = g * math.log(m0);
    midSegment.B = g;

    toeM = EvalDerivativeLinearGamma(m0, b0, g, paramsCopy.x0);
    shoulderM = EvalDerivativeLinearGamma(m0, b0, g, paramsCopy.x1);

    paramsCopy.y0 = math.max(1e-5, math.pow(paramsCopy.y0, paramsCopy.gamma));
    paramsCopy.y1 = math.max(1e-5, math.pow(paramsCopy.y1, paramsCopy.gamma));

    paramsCopy.overshootY = math.pow(1 + paramsCopy.overshootY, paramsCopy.gamma) - 1;

    self.x0 = paramsCopy.x0
    self.x1 = paramsCopy.x1
    -- Toe section
    
        local toeSegment = self.m_Segments[1]
        toeSegment.offsetX = 0;
        toeSegment.offsetY = 0;
        toeSegment.scaleX = 1;
        toeSegment.scaleY = 1;

        local lnA0, B0
        lnA0, B0 = SolveAB(lnA0, B0, paramsCopy.x0, paramsCopy.y0, toeM);
        toeSegment.lnA = lnA0;
        toeSegment.B = B0;
    

    -- Shoulder section

    local shoulderSegment = self.m_Segments[3];

    local x0 = (1 + paramsCopy.overshootX) - paramsCopy.x1;
    local y0 = (1 + paramsCopy.overshootY) - paramsCopy.y1;

    local lnA1, B1;
    lnA1, B1 = SolveAB(lnA1, B1, x0, y0, shoulderM);

    shoulderSegment.offsetX = (1 + paramsCopy.overshootX);
    shoulderSegment.offsetY = (1 + paramsCopy.overshootY);

    shoulderSegment.scaleX = -1
    shoulderSegment.scaleY = -1
    shoulderSegment.lnA = lnA1;
    shoulderSegment.B = B1;


    local scale = self.m_Segments[3]:Eval(1.0);
    local invScale = 1 / scale;

    self.m_Segments[1].offsetY = self.m_Segments[1].offsetY*invScale
    self.m_Segments[1].scaleY = self.m_Segments[1].scaleY*invScale

    self.m_Segments[2].offsetY =self.m_Segments[2].offsetY* invScale
    self.m_Segments[2].scaleY =self.m_Segments[2].scaleY* invScale

    self.m_Segments[3].offsetY = self.m_Segments[3].offsetY*invScale
    self.m_Segments[3].scaleY =self.m_Segments[3].scaleY* invScale

end



function HableCurve : Init(toeStrength,toeLength,shoulderStrength,shoulderLength,shoulderAngle,gamma)

    local dstParams0 = DirectParams:new(nil)
    local kPerceptualGamma = 2.2

    
    toeLength = math.pow(clamp01(toeLength), kPerceptualGamma);
    toeStrength = clamp01(toeStrength);
    shoulderAngle = clamp01(shoulderAngle);
    shoulderStrength = clamp(shoulderStrength, 1e-5, 1 - 1e-5);
    -- shoulderStrength =0

    shoulderLength = math.max(0, shoulderLength);
    gamma = math.max(1e-5, gamma);

    local x0 = toeLength * 0.5;
    local y0 = (1.0 - toeStrength) * x0

    local remainingY = 1.0 - y0;

    local initialW = x0 + remainingY;

    local y1_offset = (1.0 - shoulderStrength) * remainingY;
    local x1 = x0 + y1_offset;
    local y1 = y0 + y1_offset

    local extraW = Exp2(shoulderLength) - 1.0;

    local W = initialW + extraW;

    dstParams0.x0 = x0;
    dstParams0.y0 = y0;
    dstParams0.x1 = x1;
    dstParams0.y1 = y1;
    dstParams0.W = W;

    dstParams0.gamma = gamma;

    dstParams0.overshootX = (dstParams0.W * 2.0) * shoulderAngle * shoulderLength;
    dstParams0.overshootY = 0.5 * shoulderAngle * shoulderLength;

    self:InitSegments(dstParams0)

end


function HableCurve : getCurve()
    return Amaz.Vector4f(self.inverseWhitePoint,self.x0,self.x1,0.0)
end


function HableCurve : getToeSegmentA()
    return Amaz.Vector4f(self.m_Segments[1].offsetX,self.m_Segments[1].offsetY,self.m_Segments[1].scaleX,self.m_Segments[1].scaleY)
end

function HableCurve : getToeSegmentB()
    return Amaz.Vector4f(self.m_Segments[1].lnA,self.m_Segments[1].B,0.0,0.0)
end

function HableCurve : getMidSegmentA()
    return Amaz.Vector4f(self.m_Segments[2].offsetX,self.m_Segments[2].offsetY,self.m_Segments[2].scaleX,self.m_Segments[2].scaleY)
end


function HableCurve : getMidSegmentB()
    return Amaz.Vector4f(self.m_Segments[2].lnA,self.m_Segments[2].B,0.0,0.0)
end

function HableCurve : getShoSegmentA()
    return Amaz.Vector4f(self.m_Segments[3].offsetX,self.m_Segments[3].offsetY,self.m_Segments[3].scaleX,self.m_Segments[3].scaleY)
end

function HableCurve : getShoSegmentB()
    return Amaz.Vector4f(self.m_Segments[3].lnA,self.m_Segments[3].B,0.0,0.0)
end
