const InsetConstants = {};

InsetConstants.Keys = {
    FACE_INDEX : "faceIndex",
    FACE_TYPE : "faceType",
    FACE_AREA : "faceArea", 
    USE_FACE_EXTRA : "useFaceExtra", 
    FILL_COLOR : "fillColor", 
    OPACITY : "opacity",
    BLEND_MODE : "blendMode",
    USE_OUTLINE : "useOutline", 
    OUTLINE_THICKNESS : "outlineThickness", 
    OUTLINE_COLOR : "outlineColor",
    USE_FEATHERING : "useFeathering", 
    FEATHERING_SCALE : "featheringScale", 
    FEATHERING_SIGMA : "featheringSigma", 
    FEATHERING_QUALITY : "featheringQuality", 
    RT_SIZE : "rtSize", 
    CENTER_MODE : "centerMode", 
    USE_DEPTH_TEST : "useDepthTest",
    USE_HIGH_QUALITY : "highQuality",
    INPUT_TEXTURE: "inputTexture",

    CAT : "Cat face",
    DOG : "Dog face",
    HUMAN : "Human face",
    
    // Human face cutout parts
    RIGHT_EYE : "Right eye",
    LEFT_EYE : "Left eye",
    RIGHT_BROW : "Right brow",
    LEFT_BROW : "Left brow",
    NOSE : "Nose",
    MOUTH : "Mouth",
    INNER_MOUTH : "Inner mouth",
    HEAD : "Whole face",
    LEFT_IRIS : "Left iris",
    RIGHT_IRIS : "Right iris",
    WHOLE_HEAD : "Whole head",
    
    // Unique to pets
    RIGHT_EAR : "Right ear",
    LEFT_EAR : "Left ear",
    NOSE_MOUTH : "Nose and mouth",
    
    RT_SIZE_SMALL : "256 * 256",
    RT_SIZE_MEDIUM : "512 * 512",
    RT_SIZE_LARGE : "1024 * 1024",
    
    BLEND_MODE_DISABLE : "Disable",
    BLEND_MODE_NORMAL : "Normal",
    BLEND_MODE_DARKEN : "Darken",
    BLEND_MODE_MULTIPLY : "Multiply",
    BLEND_MODE_COLOR_BURN : "Color burn",
    BLEND_MODE_LIGHTEN : "Lighten",
    BLEND_MODE_SCREEN : "Screen",
    BLEND_MODE_COLOR_DODGE : "Color dodge",
    BLEND_MODE_OVERLAY : "Overlay",
    BLEND_MODE_ADD : "Add",
    BLEND_MODE_EXCLUSION : "Exclusion",
    BLEND_MODE_SOFT_LIGHT : "Soft light",
    BLEND_MODE_HARD_LIGHT : "Hard light",

    BLUR_VERTICAL : "Vertical",
    BLUR_HORIZONTAL : "Horizontal",
};

// Property list for testing
InsetConstants.Keys.PropertyKeys = [
    InsetConstants.Keys.FACE_INDEX,
    InsetConstants.Keys.FACE_TYPE,
    InsetConstants.Keys.FACE_AREA,
    InsetConstants.Keys.USE_FACE_EXTRA,
    InsetConstants.Keys.FILL_COLOR,
    InsetConstants.Keys.OPACITY,
    InsetConstants.Keys.BLEND_MODE,
    InsetConstants.Keys.USE_OUTLINE,
    InsetConstants.Keys.OUTLINE_THICKNESS,
    InsetConstants.Keys.OUTLINE_COLOR,
    InsetConstants.Keys.USE_FEATHERING,
    InsetConstants.Keys.FEATHERING_SCALE,
    InsetConstants.Keys.FEATHERING_QUALITY,
    InsetConstants.Keys.RT_SIZE,
    InsetConstants.Keys.USE_DEPTH_TEST,
    InsetConstants.Keys.INPUT_TEXTURE,
];

exports.InsetConstants = InsetConstants;