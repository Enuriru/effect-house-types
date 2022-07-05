const InsetConstants = {};

InsetConstants.Keys = {
    FACE_INDEX : "_faceIndex",
    FACE_TYPE : "_faceType",
    FACE_AREA : "_faceArea", 
    USE_FACE_EXTRA : "_useFaceExtra", 
    FILL_COLOR : "_fillColor", 
    OPACITY : "_opacity",
    BLEND_MODE : "_blendMode",
    USE_OUTLINE : "_useOutline", 
    OUTLINE_THICKNESS : "_outlineThickness", 
    OUTLINE_COLOR : "_outlineColor",
    USE_FEATHERING : "_useFeathering", 
    FEATHERING_SCALE : "_featheringScale", 
    FEATHERING_SIGMA : "_featheringSigma", 
    CENTER_MODE : "_centerMode", 
    USE_DEPTH_TEST : "_useDepthTest",
    QUALITY : "_qualityLevel",
    INPUT_TEXTURE: "_inputTexture",

    CAMERA_INPUT_TEXTURE: 'Camera input texture',
    FINAL_RENDER_TEXTURE: 'Final render output',

    HUMAN : "Human face",
    CAT : "Cat face",
    DOG : "Dog face",
    
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

    QUALITY_HIGH : "HQ",
    QUALITY_MEDIUM : "MQ",
    QUALITY_LOW : "LQ",
};

exports.InsetConstants = InsetConstants;