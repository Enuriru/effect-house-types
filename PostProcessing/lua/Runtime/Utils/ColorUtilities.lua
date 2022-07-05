ColorUtilities = {}

ColorUtilities.CIExyToLMS = function(x, y)
    local Y = 1.0
    local X = Y * x / y
    local Z = Y * ( 1.0 - x - y)/y 

    local L = 0.7328 * X + 0.4296 * Y - 0.1624 * Z
    local M = -0.7036 * X + 1.6975 * Y + 0.0061 * Z
    local S = 0.0030 * X + 0.0136 * Y + 0.9834 * Z

    return Amaz.Vector3f(L, M, S)
end

ColorUtilities.StandardIlluminantY = function(x)
    return 2.87 * x - 3 * x * x - 0.27509507
end

ColorUtilities.ComputeColorBalance = function(temperature, tint)
    -- Range ~ [-1.67;1.67] works best
    local t1 = temperature / 60.0
    local t2 = tint / 60.0

    --Get the CIE xy chromaticity of the reference white point.
    --Note: 0.31271 = x value on the D65 white point
    local x = 0.31271
    if t1 < 0 then
        x = x - t1 * 0.1
    else
        x = x - t1 * 0.05
    end
    local y = ColorUtilities.StandardIlluminantY(x) + t2 * 0.05

    -- Caclulate the coefficients in the LMS space
    local w1 = Amaz.Vector3f(0.949237, 1.03542, 1.08728)
    local w2 = ColorUtilities.CIExyToLMS(x, y)
    return Amaz.Vector3f(w1.x / w2.x , w1.y / w2.y, w1.z / w2.z)
end

ColorUtilities.ColorToLift = function(color)
    local S = Amaz.Vector3f(color.x, color.y, color.z)
    local lumLift = S.x * 0.2126 + S.y * 0.7152 + S.z * 0.0722
    S = Amaz.Vector3f(S.x - lumLift, S.y - lumLift, S.z - lumLift)

    local liftOffset = color.w
    return Amaz.Vector3f(S.x + liftOffset, S.y + liftOffset, S.z + liftOffset)
end

ColorUtilities.ColorToInverseGamma = function(color)
    local M = Amaz.Vector3f(color.x, color.y, color.z)
    local lumaGamma = M.x * 0.2126 + M.y * 0.7152 + M.z * 0.0722
    M = Amaz.Vector3f(M.x - lumaGamma, M.y - lumaGamma, M.z - lumaGamma)

    local gammaOffset = color.w + 1.0
    return Amaz.Vector3f(1.0/math.max(M.x+ gammaOffset, 1e-03), 1.0/math.max(M.y+ gammaOffset, 1e-03), 1.0/math.max(M.z+ gammaOffset, 1e-03))
end

ColorUtilities.ColorToGain = function(color)
    local H = Amaz.Vector3f(color.x, color.y, color.z)
    local lumGain = H.x * 0.2126 + H.y * 0.7152 + H.z * 0.0722
    H = Amaz.Vector3f(H.x - lumGain, H.y - lumGain, H.z - lumGain)

    local gainOffset = color.w + 1.0
    return Amaz.Vector3f(H.x + gainOffset, H.y + gainOffset, H.z + gainOffset)
end
