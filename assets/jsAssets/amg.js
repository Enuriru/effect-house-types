'use strict';Object.defineProperty(exports,"__esModule",{value:!0});class e{constructor(){this._callbacks={},this._callbackActive={}}_addCallback(e,t,n,a=!1){e&&"string"==typeof e&&t&&(!this._callbacks[e]&&(this._callbacks[e]=[]),this._callbackActive[e]&&this._callbackActive[e]===this._callbacks[e]&&(this._callbackActive[e]=this._callbackActive[e].slice()),this._callbacks[e].push({callback:t,scope:n||this,once:a}))}on(e,t,n){return this._addCallback(e,t,n,!1),this}off(e,t,n){if(e)this._callbackActive[e]&&this._callbackActive[e]===this._callbacks[e]&&(this._callbackActive[e]=this._callbackActive[e].slice());else for(const e in this._callbackActive)this._callbacks[e]&&this._callbacks[e]===this._callbackActive[e]&&(this._callbackActive[e]=this._callbackActive[e].slice());if(!e)this._callbacks={};else if(!t)this._callbacks[e]&&(this._callbacks[e]=[]);else{const a=this._callbacks[e];if(!a)return this;let r=a.length;for(let e=0;e<r;e++)a[e].callback===t&&(n&&a[e].scope!==n||(a[e--]=a[--r]));a.length=r}return this}fire(e,t,n,a,r,o,s,d,l){if(!e||!this._callbacks[e])return this;let c;this._callbackActive[e]?(this._callbackActive[e]===this._callbacks[e]&&(this._callbackActive[e]=this._callbackActive[e].slice()),c=this._callbacks[e].slice()):this._callbackActive[e]=this._callbacks[e];for(let p=0;(c||this._callbackActive[e])&&p<(c||this._callbackActive[e]).length;p++){const i=(c||this._callbackActive[e])[p];if(i.callback.call(i.scope,t,n,a,r,o,s,d,l),i.once){const t=this._callbacks[e].indexOf(i);-1!==t&&(this._callbackActive[e]===this._callbacks[e]&&(this._callbackActive[e]=this._callbackActive[e].slice()),this._callbacks[e].splice(t,1))}}return c||(this._callbackActive[e]=void 0),this}once(e,t,n){return this._addCallback(e,t,n,!0),this}hasEvent(e){return this._callbacks[e]&&0!==this._callbacks[e].length||!1}}const t=effect.Amaz,n=effect;class a extends e{constructor(e,t){super(),this.entity=e,this.nativeClass=t,e&&t&&(this.native=e.native.addComponent(t))}initialize(e,t){for(let n=0;n<t.length;n++){const a=t[n];e&&e.hasOwnProperty(a)&&(this[a]=e[a])}}initWithNative(e,t,n){this.entity=e,this.native=t,this.nativeClass=n}destroy(){this.entity&&this.nativeClass&&(this.entity.native.removeComponent(this.nativeClass),this.entity=void 0)}addListener(e,n,a){if(this.native)t.AmazingManager.addListener(this.native,e,n,a);else throw new Error("Invalid native component in Component:addListener")}removeListener(e,n){if(this.native)t.AmazingManager.removeListener(this.native,e,n);else throw new Error("Invalid native component in Component:removeListener")}get enabled(){return this.native.enabled}set enabled(e){this.native.enabled=e}}var i=t.PixelFormat;(function(e){e[e.Portrait=0]="Portrait",e[e.Landscape=1]="Landscape"})(exports.DeviceOrientationMode||(exports.DeviceOrientationMode={})),function(e){e[e.Perspective=t.CameraType.PERSPECTIVE]="Perspective",e[e.Orthographic=t.CameraType.ORTHO]="Orthographic"}(exports.CameraType||(exports.CameraType={})),function(e){e[e.AfterRender=t.CameraEvent.AFTER_RENDER]="AfterRender",e[e.BeforeRender=t.CameraEvent.BEFORE_RENDER]="BeforeRender",e[e.AfterEverything=t.CameraEvent.AFTER_EVERYTHING]="AfterEverything",e[e.AfterImageEffects=t.CameraEvent.AFTER_IMAGE_EFFECTS]="AfterImageEffects",e[e.RenderImageEffects=t.CameraEvent.RENDER_IMAGE_EFFECTS]="RenderImageEffects"}(exports.CameraRenderEvent||(exports.CameraRenderEvent={})),function(e){e[e.Nearest=t.FilterMode.NEAREST]="Nearest",e[e.Linear=t.FilterMode.LINEAR]="Linear"}(exports.TextureFilterMode||(exports.TextureFilterMode={})),function(e){e[e.Position=t.VertexAttribType.POSITION]="Position",e[e.Normal=t.VertexAttribType.NORMAL]="Normal",e[e.Tangent=t.VertexAttribType.TANGENT]="Tangent",e[e.Color=t.VertexAttribType.COLOR]="Color",e[e.Texcoord0=t.VertexAttribType.TEXCOORD0]="Texcoord0"}(exports.VertexAttribType||(exports.VertexAttribType={})),function(e){e[e.Directional=0]="Directional",e[e.Point=1]="Point",e[e.Spot=2]="Spot"}(exports.LightType||(exports.LightType={})),function(e){e[e.Box=0]="Box",e[e.Sphere=1]="Sphere",e[e.Capsule=2]="Capsule"}(exports.Collider3DType||(exports.Collider3DType={})),function(e){e[e.Static=t.RigidBodyType.STATIC]="Static",e[e.Kinematic=t.RigidBodyType.KINEMATIC]="Kinematic",e[e.Dynamic=t.RigidBodyType.DYNAMIC]="Dynamic"}(exports.Physics3DType||(exports.Physics3DType={})),function(e){e[e.Fit=t.StretchMode.fit]="Fit",e[e.Fill=t.StretchMode.fill]="Fill",e[e.FitWidth=t.StretchMode.fit_width]="FitWidth",e[e.FitHeight=t.StretchMode.fit_height]="FitHeight",e[e.Stretch=t.StretchMode.stretch]="Stretch",e[e.FillCut=t.StretchMode.fill_cut]="FillCut",e[e.ImageSize=t.StretchMode.texture_size]="ImageSize"}(exports.SpriteRenderMode||(exports.SpriteRenderMode={})),function(e){e[e.Normal=t.IFSprite2dType.Normal]="Normal",e[e.Tiled=t.IFSprite2dType.Tiled]="Tiled",e[e.Sliced=t.IFSprite2dType.Sliced]="Sliced",e[e.Filled=t.IFSprite2dType.Filled]="Filled",e[e.Ellipse=t.IFSprite2dType.Ellipse]="Ellipse",e[e.Free=t.IFSprite2dType.Free]="Free",e[e.Corner=t.IFSprite2dType.Corner]="Corner"}(exports.ImageRenderMode||(exports.ImageRenderMode={})),function(e){e[e.Horizontal=t.IFFilledType.Horizontal]="Horizontal",e[e.Vertical=t.IFFilledType.Vertical]="Vertical",e[e.Radial=t.IFFilledType.Radial]="Radial"}(exports.ImageFillType||(exports.ImageFillType={})),function(e){e[e.Normal=t.IFBlendMode.Normal]="Normal",e[e.Add=t.IFBlendMode.Add]="Add",e[e.Average=t.IFBlendMode.Average]="Average",e[e.Burn=t.IFBlendMode.Burn]="Burn",e[e.Dodge=t.IFBlendMode.Dodge]="Dodge",e[e.Darken=t.IFBlendMode.Darken]="Darken",e[e.Difference=t.IFBlendMode.Difference]="Difference",e[e.Exclusion=t.IFBlendMode.Exclusion]="Exclusion",e[e.Glow=t.IFBlendMode.Glow]="Glow",e[e.HardLight=t.IFBlendMode.Hardlight]="HardLight",e[e.HardMix=t.IFBlendMode.Hardmix]="HardMix",e[e.Lighten=t.IFBlendMode.Lighten]="Lighten",e[e.LinearBurn=t.IFBlendMode.Linearburn]="LinearBurn",e[e.LinearDodge=t.IFBlendMode.Lineardodge]="LinearDodge",e[e.LinearLight=t.IFBlendMode.Linearlight]="LinearLight",e[e.Multiply=t.IFBlendMode.Multiply]="Multiply",e[e.Negation=t.IFBlendMode.Negation]="Negation",e[e.Overlay=t.IFBlendMode.Overlay]="Overlay",e[e.Phoenix=t.IFBlendMode.Phoenix]="Phoenix",e[e.PinLight=t.IFBlendMode.Pinlight]="PinLight",e[e.Reflect=t.IFBlendMode.Reflect]="Reflect",e[e.Screen=t.IFBlendMode.Screen]="Screen",e[e.Softlight=t.IFBlendMode.Softlight]="Softlight",e[e.Substract=t.IFBlendMode.Substract]="Substract",e[e.VividLight=t.IFBlendMode.Vividlight]="VividLight",e[e.SnowColor=t.IFBlendMode.Snowcolor]="SnowColor",e[e.SnowHue=t.IFBlendMode.Snowhue]="SnowHue",e[e.EndFlag=t.IFBlendMode.EndFlag]="EndFlag"}(exports.CanvasBlendMode||(exports.CanvasBlendMode={})),function(e){e[e.None=t.IFMaskType.None]="None",e[e.Rect=t.IFMaskType.Rect]="Rect",e[e.Ellipse=t.IFMaskType.Ellipse]="Ellipse",e[e.Sprites=t.IFMaskType.MaskSprites]="Sprites"}(exports.CanvasMaskType||(exports.CanvasMaskType={})),function(e){e[e.Overlay=t.IFLayer2dRenderOrderMode.ScreenOverlay]="Overlay",e[e.Custom=t.IFLayer2dRenderOrderMode.SceneCustom]="Custom"}(exports.CanvasRenderOrder||(exports.CanvasRenderOrder={})),function(e){e[e.Once=t.PlayMode.once]="Once",e[e.Loop=t.PlayMode.loop]="Loop",e[e.PingPong=t.PlayMode.pingpong]="PingPong",e[e.Random=t.PlayMode.random]="Random"}(exports.SeqAnimationPlayMode||(exports.SeqAnimationPlayMode={})),function(e){e[e.Origin=t.IFResolutionType.Origin]="Origin",e[e.FitWidth=t.IFResolutionType.FitWidth]="FitWidth",e[e.FitHeight=t.IFResolutionType.FitHeight]="FitHeight",e[e.Fit=t.IFResolutionType.Fit]="Fit",e[e.Fill=t.IFResolutionType.Fill]="Fill"}(exports.CanvasScalerType||(exports.CanvasScalerType={})),function(e){e[e.Box=0]="Box"}(exports.UIColliderType||(exports.UIColliderType={})),function(e){e[e.Follow=t.IFUISliderMode.FOLLOW]="Follow",e[e.Offset=t.IFUISliderMode.OFFSET]="Offset",e[e.DragThumb=t.IFUISliderMode.DRAG_THUMB]="DragThumb"}(exports.SliderMode||(exports.SliderMode={})),function(e){e[e.LeftRight=t.IFUIMoveDirection.LEFT_TO_RIGHT]="LeftRight",e[e.RightLeft=t.IFUIMoveDirection.RIGHT_TO_LEFT]="RightLeft",e[e.BottomTop=t.IFUIMoveDirection.BOTTOM_TO_TOP]="BottomTop",e[e.TopBottom=t.IFUIMoveDirection.TOP_TO_BOTTOM]="TopBottom"}(exports.UIMoveDirection||(exports.UIMoveDirection={})),function(e){e[e.System=t.IFUILabelFontType.System]="System",e[e.TrueType=t.IFUILabelFontType.TrueType]="TrueType",e[e.Bitmap=t.IFUILabelFontType.Bitmap]="Bitmap"}(exports.LabelFontType||(exports.LabelFontType={})),function(e){e[e.Left=t.IFUILabelAlignment.Left]="Left",e[e.Right=t.IFUILabelAlignment.Right]="Right",e[e.Center=t.IFUILabelAlignment.Center]="Center"}(exports.LabelAlignment||(exports.LabelAlignment={})),function(e){e[e.AutoSize=t.IFUILabelFitType.AutoSize]="AutoSize",e[e.FitWidth=t.IFUILabelFitType.FitWidth]="FitWidth",e[e.FitSize=t.IFUILabelFitType.FitSize]="FitSize"}(exports.LabelFitType||(exports.LabelFitType={})),function(e){e[e.None=t.IFUIGridType.NONE]="None",e[e.Horizontal=t.IFUIGridType.HORIZONTAL]="Horizontal",e[e.Vertical=t.IFUIGridType.VERTICAL]="Vertical",e[e.Grid=t.IFUIGridType.GRID]="Grid"}(exports.LayoutType||(exports.LayoutType={})),function(e){e[e.None=t.IFUIGridResizeMode.NONE]="None",e[e.Container=t.IFUIGridResizeMode.CONTAINER]="Container",e[e.Children=t.IFUIGridResizeMode.CHILDREN]="Children"}(exports.LayoutSizeMode||(exports.LayoutSizeMode={})),function(e){e[e.Horizontal=t.IFUIGridStartAxis.HORIZONTAL]="Horizontal",e[e.Vertical=t.IFUIGridStartAxis.VERTICAL]="Vertical"}(exports.LayoutGridMode||(exports.LayoutGridMode={})),function(e){e[e.TopBottom=t.IFUIGridVerticalDirection.TOP_TO_BOTTOM]="TopBottom",e[e.BottomTop=t.IFUIGridVerticalDirection.BOTTOM_TO_TOP]="BottomTop"}(exports.LayoutVerticalDirection||(exports.LayoutVerticalDirection={})),function(e){e[e.LeftRight=t.IFUIGridHorizontalDirection.LEFT_TO_RIGHT]="LeftRight",e[e.RightLeft=t.IFUIGridHorizontalDirection.RIGHT_TO_LEFT]="RightLeft"}(exports.LayoutHorizontalDirection||(exports.LayoutHorizontalDirection={})),function(e){e[e.None=t.IFUIGridSortingType.NONE]="None",e[e.Alphabetic=t.IFUIGridSortingType.ALPHABETIC]="Alphabetic"}(exports.LayoutSortMode||(exports.LayoutSortMode={})),function(e){e.Head="head",e.Body="body",e.Hair="hair",e.Sky="sky",e.Building="building",e.Cloth="cloth",e.Ground="ground"}(exports.SegmentationType||(exports.SegmentationType={}));const r=64,o=32;(function(e){e[e.Once=1]="Once",e[e.Loop=0]="Loop",e[e.PingPong=-1]="PingPong",e[e.Clamp=-2]="Clamp",e[e.Seek=-3]="Seek"})(exports.AnimationPlayMode||(exports.AnimationPlayMode={})),function(e){e[e.Billboard=t.ParticleQuatRendererOrientationType.BILLBOARD]="Billboard",e[e.Direction=t.ParticleQuatRendererOrientationType.DIRECTION]="Direction",e[e.Shape=t.ParticleQuatRendererOrientationType.SHAPE]="Shape",e[e.Fixed=t.ParticleQuatRendererOrientationType.FIXED]="Fixed"}(exports.ParticleSystemRenderOrientation||(exports.ParticleSystemRenderOrientation={})),function(e){e[e.ByDistance=t.ParticleRenderSortingMode.BY_DISTANCE]="ByDistance",e[e.OldestInFront=t.ParticleRenderSortingMode.OLDEST_IN_FRONT]="OldestInFront",e[e.YoungestInFront=t.ParticleRenderSortingMode.YOUNGEST_IN_FRONT]="YoungestInFront"}(exports.ParticleSystemRenderSortingMode||(exports.ParticleSystemRenderSortingMode={})),function(e){e[e.Quad=0]="Quad",e[e.Mesh=1]="Mesh"}(exports.ParticleSystemRenderType||(exports.ParticleSystemRenderType={})),function(e){e[e.ScaleByParticle=t.ParticleMeshRendererType.SCALE_BY_PARTICLE]="ScaleByParticle",e[e.SizeByParticle=t.ParticleMeshRendererType.SIZE_BY_PARTICLE]="SizeByParticle"}(exports.ParticleSystemRenderDisplayMode||(exports.ParticleSystemRenderDisplayMode={})),function(e){e[e.None=0]="None",e[e.Color=1]="Color"}(exports.ParticleSystemAffector||(exports.ParticleSystemAffector={})),function(e){e[e.Set=t.ColorOperation.SET]="Set",e[e.Multiply=t.ColorOperation.MULTIPLY]="Multiply",e[e.Random=t.ColorOperation.RANDOM]="Random"}(exports.ParticleSystemColorAffectorOperation||(exports.ParticleSystemColorAffectorOperation={})),function(e){e[e.Whole=0]="Whole",e[e.LeftEye=1]="LeftEye",e[e.RightEye=2]="RightEye",e[e.Nose=3]="Nose",e[e.Mouth=4]="Mouth",e[e.LeftEyeBrow=5]="LeftEyeBrow",e[e.RightEyeBrow=6]="RightEyeBrow"}(exports.FacePart||(exports.FacePart={})),function(e){e[e.Unknown=0]="Unknown",e[e.Angry=1]="Angry",e[e.Disgust=2]="Disgust",e[e.Fear=3]="Fear",e[e.Happy=4]="Happy",e[e.Sad=5]="Sad",e[e.Surprise=6]="Surprise",e[e.Neutral=7]="Neutral"}(exports.FaceExpression||(exports.FaceExpression={})),function(e){e.Detected="detected",e.Lost="lost"}(exports.FaceEvent||(exports.FaceEvent={})),function(e){e[e.None=0]="None",e[e.EyeBlink=1]="EyeBlink",e[e.EyeBlinkLeft=2]="EyeBlinkLeft",e[e.EyeBlinkRight=3]="EyeBlinkRight",e[e.MouthAh=4]="MouthAh",e[e.MouthPout=5]="MouthPout",e[e.HeadYaw=6]="HeadYaw",e[e.HeadPitch=7]="HeadPitch",e[e.BrowJump=8]="BrowJump",e[e.SideNod=9]="SideNod"}(exports.FaceAction||(exports.FaceAction={})),function(e){e[e.Face106=0]="Face106",e[e.Face240=1]="Face240",e[e.Face280=2]="Face280",e[e.Face3d=3]="Face3d"}(exports.FaceLandmarkType||(exports.FaceLandmarkType={})),function(e){e.Lost="lost",e.Detected="detected",e.StaticGesture="staticGesture",e.DynamicGesture="dynamicGesture"}(exports.HandEvent||(exports.HandEvent={})),function(e){e[e.HeartA=0]="HeartA",e[e.HeartB=1]="HeartB",e[e.HeartC=2]="HeartC",e[e.HeartD=3]="HeartD",e[e.OK=4]="OK",e[e.HandOpen=5]="HandOpen",e[e.ThumbUp=6]="ThumbUp",e[e.ThumbDown=7]="ThumbDown",e[e.Rock=8]="Rock",e[e.Namaste=9]="Namaste",e[e.PalmUp=10]="PalmUp",e[e.Fist=11]="Fist",e[e.IndexFingerUp=12]="IndexFingerUp",e[e.DoubleFingerUp=13]="DoubleFingerUp",e[e.Victory=14]="Victory",e[e.BigV=15]="BigV",e[e.PhoneCall=16]="PhoneCall",e[e.Beg=17]="Beg",e[e.Thanks=18]="Thanks",e[e.Unknown=19]="Unknown",e[e.Cabbage=20]="Cabbage",e[e.Three=21]="Three",e[e.Four=22]="Four",e[e.Pistol=23]="Pistol",e[e.Rock2=24]="Rock2",e[e.Swear=25]="Swear",e[e.HoldFace=26]="HoldFace",e[e.Salute=27]="Salute",e[e.Spread=28]="Spread",e[e.Pray=29]="Pray",e[e.QiGong=30]="QiGong",e[e.Slide=31]="Slide",e[e.PalmDown=32]="PalmDown",e[e.Pistol2=33]="Pistol2",e[e.NinjaMudra1=34]="NinjaMudra1",e[e.NinjaMudra2=35]="NinjaMudra2",e[e.NinjaMudra3=36]="NinjaMudra3",e[e.NinjaMudra4=37]="NinjaMudra4",e[e.NinjaMudra5=38]="NinjaMudra5",e[e.NinjaMudra6=39]="NinjaMudra6",e[e.NinjaMudra7=40]="NinjaMudra7",e[e.NinjaMudra8=41]="NinjaMudra8",e[e.NinjaMudra9=42]="NinjaMudra9",e[e.NinjaMudra10=43]="NinjaMudra10",e[e.NinjaMudra11=44]="NinjaMudra11",e[e.SpiderHand=45]="SpiderHand",e[e.AvengerHand=46]="AvengerHand",e[e.MaxCount=47]="MaxCount",e[e.Undetect=48]="Undetect",e[e.None=99]="None"}(exports.HandStaticGesture||(exports.HandStaticGesture={})),function(e){e[e.None=0]="None",e[e.Punching=1]="Punching",e[e.Clapping=2]="Clapping",e[e.HighFive=4]="HighFive"}(exports.HandDynamicGesture||(exports.HandDynamicGesture={})),function(e){e[e.Wrist=0]="Wrist",e[e.Thumb3=1]="Thumb3",e[e.Thumb2=2]="Thumb2",e[e.Thumb1=3]="Thumb1",e[e.Thumb0=4]="Thumb0",e[e.Index3=5]="Index3",e[e.Index2=6]="Index2",e[e.Index1=7]="Index1",e[e.Index0=8]="Index0",e[e.Middle3=9]="Middle3",e[e.Middle2=10]="Middle2",e[e.Middle1=11]="Middle1",e[e.Middle0=12]="Middle0",e[e.Ring3=13]="Ring3",e[e.Ring2=14]="Ring2",e[e.Ring1=15]="Ring1",e[e.Ring0=16]="Ring0",e[e.Pinky3=17]="Pinky3",e[e.Pinky2=18]="Pinky2",e[e.Pinky1=19]="Pinky1",e[e.Pinky0=20]="Pinky0",e[e.Center=21]="Center"}(exports.HandKeyPoint||(exports.HandKeyPoint={})),function(e){e.Detected="detected",e.Lost="lost",e.Action="action"}(exports.BodyEvent||(exports.BodyEvent={})),function(e){e[e.Nose=0]="Nose",e[e.Neck=1]="Neck",e[e.RightShoulder=2]="RightShoulder",e[e.RightElbow=3]="RightElbow",e[e.RightWrist=4]="RightWrist",e[e.LeftShoulder=5]="LeftShoulder",e[e.LeftElbow=6]="LeftElbow",e[e.LeftWrist=7]="LeftWrist",e[e.RightHip=8]="RightHip",e[e.RightKnee=9]="RightKnee",e[e.RightAnkle=10]="RightAnkle",e[e.LeftHip=11]="LeftHip",e[e.LeftKnee=12]="LeftKnee",e[e.LeftAnkle=13]="LeftAnkle",e[e.RightEye=14]="RightEye",e[e.LeftEye=15]="LeftEye",e[e.RightEar=16]="RightEar",e[e.LeftEar=17]="LeftEar"}(exports.Body2DKeyPointType||(exports.Body2DKeyPointType={})),function(e){e[e.Hips=0]="Hips",e[e.LeftUpLeg=1]="LeftUpLeg",e[e.RightUpLeg=2]="RightUpLeg",e[e.Spine=3]="Spine",e[e.LeftLeg=4]="LeftLeg",e[e.RightLeg=5]="RightLeg",e[e.Spine1=6]="Spine1",e[e.LeftFoot=7]="LeftFoot",e[e.RightFoot=8]="RightFoot",e[e.Spine2=9]="Spine2",e[e.LeftToe=10]="LeftToe",e[e.RightToe=11]="RightToe",e[e.Neck=12]="Neck",e[e.LeftShoulder=13]="LeftShoulder",e[e.RightShoulder=14]="RightShoulder",e[e.Head=15]="Head",e[e.LeftArm=16]="LeftArm",e[e.RightArm=17]="RightArm",e[e.LeftForeArm=18]="LeftForeArm",e[e.RightForeArm=19]="RightForeArm",e[e.LeftHand=20]="LeftHand",e[e.RightHand=21]="RightHand"}(exports.Body3DKeyPointType||(exports.Body3DKeyPointType={})),function(e){e.Detected="detected",e.Lost="lost"}(exports.AvatarDriveEvent||(exports.AvatarDriveEvent={})),function(e){e[e.LeftEyeLookDown=0]="LeftEyeLookDown",e[e.LeftNoseSneer=1]="LeftNoseSneer",e[e.LeftEyeLookIn=2]="LeftEyeLookIn",e[e.BrowInnerUp=3]="BrowInnerUp",e[e.LeftEyeSquint=4]="LeftEyeSquint",e[e.MouthClose=5]="MouthClose",e[e.RightMouthLowerDown=6]="RightMouthLowerDown",e[e.JawOpen=7]="JawOpen",e[e.MouthShrugLower=8]="MouthShrugLower",e[e.LeftMouthLowerDown=9]="LeftMouthLowerDown",e[e.MouthFunnel=10]="MouthFunnel",e[e.RightEyeLookIn=11]="RightEyeLookIn",e[e.RightEyeLookDown=12]="RightEyeLookDown",e[e.RightNoseSneer=13]="RightNoseSneer",e[e.MouthRollUpper=14]="MouthRollUpper",e[e.JawRight=15]="JawRight",e[e.LeftMouthDimple=16]="LeftMouthDimple",e[e.MouthRollLower=17]="MouthRollLower",e[e.LeftMouthSmile=18]="LeftMouthSmile",e[e.LeftMouthPress=19]="LeftMouthPress",e[e.RightMouthSmile=20]="RightMouthSmile",e[e.RightMouthPress=21]="RightMouthPress",e[e.RightMouthDimple=22]="RightMouthDimple",e[e.MouthLeft=23]="MouthLeft",e[e.RightBrowDown=24]="RightBrowDown",e[e.LeftBrowDown=25]="LeftBrowDown",e[e.LeftMouthFrown=26]="LeftMouthFrown",e[e.LeftEyeBlink=27]="LeftEyeBlink",e[e.LeftCheekSquint=28]="LeftCheekSquint",e[e.LeftBrowOuterUp=29]="LeftBrowOuterUp",e[e.LeftEyeLookUp=30]="LeftEyeLookUp",e[e.JawLeft=31]="JawLeft",e[e.LeftMouthStretch=32]="LeftMouthStretch",e[e.RightMouthStretch=33]="RightMouthStretch",e[e.MouthPucker=34]="MouthPucker",e[e.RightEyeLookUp=35]="RightEyeLookUp",e[e.RightBrowOuterUp=36]="RightBrowOuterUp",e[e.RightCheekSquint=37]="RightCheekSquint",e[e.RightEyeBlink=38]="RightEyeBlink",e[e.LeftMouthUpperUp=39]="LeftMouthUpperUp",e[e.RightMouthFrown=40]="RightMouthFrown",e[e.RightEyeSquint=41]="RightEyeSquint",e[e.JawForward=42]="JawForward",e[e.RightMouthUpperUp=43]="RightMouthUpperUp",e[e.CheekPuff=44]="CheekPuff",e[e.LeftEyeLookOut=45]="LeftEyeLookOut",e[e.RightEyeLookOut=46]="RightEyeLookOut",e[e.RightEyeWide=47]="RightEyeWide",e[e.MouthRight=48]="MouthRight",e[e.LeftEyeWide=49]="LeftEyeWide",e[e.MouthShrugUpper=50]="MouthShrugUpper",e[e.TongueOut=51]="TongueOut"}(exports.AvatarDriveBlendShapeType||(exports.AvatarDriveBlendShapeType={})),function(e){e.Texture="texture",e.Mesh="mesh"}(exports.AssetType||(exports.AssetType={})),function(e){e.Segmentation="segmentation",e.Face="face",e.CameraInput="cameraInput"}(exports.AssetSubType||(exports.AssetSubType={}));const s=["clearColor","clearColorBuffer","clearDepthBuffer","clearStencilBuffer","orthoHeight","near","far","fov","type","viewport","layers","renderOrder"];class d extends a{constructor(e,n){if(e){super(e,"Camera");const a=new t.DynamicBitset(r,0);a.set(0,1),this.native.layerVisibleMask=a,this.initialize(n,s),this.native.renderTexture=new t.SceneOutputRT}else super()}static fromNative(e,n){const a=new d;if(n instanceof t.Camera)a.initWithNative(e,n,"Camera");else throw new Error("Incorrect argument to CameraComponent::fromNative");return a}get renderTexture(){return this.native.renderTexture}set renderTexture(e){this.native.renderTexture=e}get clearColor(){return this.native.clearColor}set clearColor(e){this.native.clearColor=e}get clearColorBuffer(){const e=this.native.clearType;return 1===e||3===e||7===e}set clearColorBuffer(e){let t=this.native.clearType;0===t||4===t||5===t?t=e?1:t:1===t?t=e?1:5:2===t||3===t?t=e?3:2:6===t||7===t?t=e?7:6:void 0;this.native.clearType=t}get clearDepthBuffer(){const e=this.native.clearType;return 2===e||3===e||6===e||7===e}set clearDepthBuffer(e){let t=this.native.clearType;0===t||4===t||5===t?t=e?2:t:1===t||3===t?t=e?3:1:2===t?t=e?e:5:6===t?t=e?6:5:7===t?t=e?7:1:void 0;this.native.clearType=t}get clearStencilBuffer(){const e=this.native.clearType;return 6===e||7===e}set clearStencilBuffer(e){let t=this.native.clearType;0===t||4===t||5===t?t=e?6:t:1===t||3===t?t=e?7:t:2===t||6===t?t=e?6:2:7===t?t=e?7:1:void 0;this.native.clearType=t}get orthoHeight(){return this.native.orthoScale}set orthoHeight(e){this.native.orthoScale=e}get near(){return this.native.zNear}set near(e){this.native.zNear=e}get far(){return this.native.zFar}set far(e){this.native.zFar=e}get fov(){return this.native.fovy}set fov(e){this.native.fovy=e}get type(){return this.native.type}set type(e){this.native.type=e}get viewport(){return this.native.viewport}set viewport(e){this.native.viewport=e}get layers(){const e=[];for(let t=0;t<r;++t)this.native.layerVisibleMask.test(t)&&e.push(t);return e}set layers(e){const n=new t.DynamicBitset(r,0);for(const t of e)if(0<=t&&t<r)n.set(t);else throw new Error("Invalid layer value!");this.native.layerVisibleMask=n}get renderOrder(){return this.native.renderOrder}set renderOrder(e){this.native.renderOrder=e}screenToWorld(e){return this.native.screenToWorldPoint(e)}worldToScreen(e){return this.native.worldToScreenPoint(e)}}d.nativeClasses=["Camera"];const l=["type","offset","halfExtents","radius","height"],c=new Map([[exports.Collider3DType.Box,"BoxCollider3D"],[exports.Collider3DType.Sphere,"SphereCollider3D"],[exports.Collider3DType.Capsule,"CapsuleCollider3D"]]);function p(e){if(!c.has(e))throw new Error("Unknown type of shape");return c.get(e)}class m extends a{constructor(e,t){if(e){const n=t&&t.hasOwnProperty("type")?t:{type:exports.Collider3DType.Box};super(e,p(n.type)),this.initialize(n,l)}else super()}static fromNative(e,n){const a=new m;if(n instanceof t.BoxCollider3D)a.initWithNative(e,n,"BoxCollider3D"),a.type=exports.Collider3DType.Box;else if(n instanceof t.SphereCollider3D)a.initWithNative(e,n,"SphereCollider3D"),a.type=exports.Collider3DType.Sphere;else if(n instanceof t.CapsuleCollider3D)a.initWithNative(e,n,"CapsuleCollider3D"),a.type=exports.Collider3DType.Capsule;else throw new Error("Incorrect argument to CollisionComponent::fromNative");return a}get offset(){return this.native.offset}set offset(e){this.native.offset=e}get radius(){return this.native.radius}set radius(e){this.native.radius=e}get height(){return this.native.height}set height(e){this.native.height=e}get halfExtents(){return this.native.halfExtent}set halfExtents(e){this.native.halfExtent=e}}m.nativeClasses=["BoxCollider3D","SphereCollider3D","CapsuleCollider3D"];var u=t.Color,g=t.Vector3f;g.prototype.clone=function(){return this.copy()},g.prototype.subtract=function(e,t){if(t){const n=g.sub(e,t);this.set(n.x,n.y,n.z)}else this.sub(e);return this},g.prototype.cross2=function(e,t){const n=e.cross(t);return this.set(n.x,n.y,n.z),this};const f=new Map([[exports.LightType.Directional,"DirectionalLight"],[exports.LightType.Point,"PointLight"],[exports.LightType.Spot,"SpotLight"]]);function h(e){if(!f.has(e))throw new Error("Unknown type of light");return f.get(e)}const v=["type","color","intensity","castShadow","enableSoftShadow","shadowSoftness","shadowBias","camera","shadowResolution","attenuationRange"];class y extends a{constructor(e,t){if(e){const n=t&&t.hasOwnProperty("type")?t:{type:exports.LightType.Directional};super(e,h(n.type)),this.initialize(n,v)}else super()}static fromNative(e,n){const a=new y;if(n instanceof t.DirectionalLight)a.initWithNative(e,n,"DirectionalLight"),a.type=exports.LightType.Directional;else if(n instanceof t.PointLight)a.initWithNative(e,n,"PointLight"),a.type=exports.LightType.Point;else if(n instanceof t.SpotLight)a.initWithNative(e,n,"SpotLight"),a.type=exports.LightType.Spot;else throw new Error("Incorrect argument to LightComponent::fromNative");return a}get color(){const e=this.native.color;return new u(e.x,e.y,e.z,1)}set color(e){this.native.color=new g(e.r,e.g,e.b)}get intensity(){return this.native.intensiy}set intensity(e){this.native.intensiy=e}get castShadow(){return this.native.shadowEnableNew}set castShadow(e){this.native.shadowEnableNew=e}get enableSoftShadow(){return this.native.useSoftShadow}set enableSoftShadow(e){this.native.useSoftShadow=e}get shadowSoftness(){return this.native.shadowSoftness}set shadowSoftness(e){this.native.shadowSoftness=e}get shadowBias(){return this.native.shadowBias}set shadowBias(e){this.native.shadowBias=e}get shadowResolution(){return this.native.shadowResolution}set shadowResolution(e){this.native.shadowResolution=e}get attenuationRange(){if(this.type===exports.LightType.Point||this.type===exports.LightType.Spot)return this.native.attenuationRange;throw new Error("Light Type does not support attenuationRange!")}set attenuationRange(e){if(this.type===exports.LightType.Point||this.type===exports.LightType.Spot)this.native.attenuationRange=e;else throw new Error("Light Type does not support attenuationRange!")}get camera(){if(this.type===exports.LightType.Directional){var e,t,n,a;return null==(e=this.entity)||null==(t=e.scene)?void 0:t.entityFromNative(null==(n=this.native)||null==(a=n.mainCamera)?void 0:a.entity)}}set camera(e){if(!(this.type===exports.LightType.Directional))throw new Error("Only directional light needs cameera for shadow optimization!");else if(e)if(e.native)this.native.mainCamera=e.native.getComponent("Transform");else throw new Error("Invalid camera!")}}y.nativeClasses=["DirectionalLight","PointLight","SpotLight"];var _=t.Vector2f,T=t.Vector4f;T.prototype.clone=function(){return this.copy()};var S=t.Matrix4x4f;class I{constructor(e){this.native=e?e:new t.Material}set xshader(e){this.native.xshader=e.native}clone(){return new I(this.native.instantiate())}addProperty(e,n){Object.defineProperty(this,e,{configurable:!0,get:function(){let a;if("number"==typeof n)a=this.native.getFloat(e);else if(n instanceof _)a=this.native.getVec2(e);else if(n instanceof g)a=this.native.getVec3(e);else if(n instanceof T)a=this.native.getVec4(e);else if(n instanceof t.Color){const n=this.native.getVec4(e);a=new t.Color(n.x,n.y,n.z,n.w)}else a=n instanceof S?this.native.getMat4(e):this.native.getTex(e);return a},set:function(n){if("number"==typeof n)this.native.setFloat(e,n);else if(n instanceof _)this.native.setVec2(e,n);else if(n instanceof g)this.native.setVec3(e,n);else if(n instanceof T)this.native.setVec4(e,n);else if(n instanceof t.Color){const t=new T(n.r,n.g,n.b,n.a);this.native.setVec4(e,t)}else n instanceof S?this.native.setMat4(e,n):this.native.setTex(e,n)}}),this[e]=n}removeProperty(e){Object.defineProperty(this,e,{configurable:!0,value:void 0})}addMacro(e,t){this.native.enableMacro(e,t)}removeMacro(e){this.native.disableMacro(e)}}const C=["castShadow","mesh","material"];class M extends a{constructor(e,t){e?(super(e,"MeshRenderer"),this.initialize(t,C)):super()}static fromNative(e,n){const a=new M;if(n instanceof t.MeshRenderer)a.initWithNative(e,n,"MeshRenderer");else throw new Error("Incorrect argument to ModelComponent::fromNative");return a}get castShadow(){return this.native.castShadow}set castShadow(e){this.native.castShadow=e}get mesh(){return this.native.mesh}set mesh(e){this.native.mesh=e}get material(){if(!this._material){const e=this.native.material;e&&(this._material=new I(e))}return this._material}set material(e){e&&(this._material=e,this.native.material=e.native)}}M.nativeClasses=["MeshRenderer"];const F=Math.PI/180;var A=t.Quaternionf;A.prototype.clone=function(){return this.copy()},A.prototype.eulerAngles=function(e,t,n){const a=this.eulerToQuaternion(new g(e*F,t*F,n*F));return this.set(a.x,a.y,a.z,a.w),this},A.prototype.toAxisAngle=function(){var e=Math.sqrt,t=Math.acos;const n=new g,a=2*t(this.w),i=e(1-this.w*this.w);return .001>i?(n.x=this.x,n.y=this.y,n.z=this.z):(n.x=this.x/i,n.y=this.y/i,n.z=this.z/i),[n,a]},A.prototype.fromToRotation=function(e,t){const n=A.fromToQuaternionSafe(e,t);return this.set(n.x,n.y,n.z,n.w),this};const P=["autoPlay","flipDirection","totalParticles","material","emitterRadius","emissionRate","lifetime","scale","angle","speed","rotationX","rotationY","rotationZ","rotationXSpeed","rotationYSpeed","rotationZSpeed","colors","orientation","sortingMode","renderType","mesh","displayMode","orientationStart","orientationEnd","affectorType","colorAffectorOperation","colorAffectorColors"];class R extends a{constructor(e,n){if(e){super(e,"ParticleComponent");let a;if(a=n&&n.hasOwnProperty("renderType")?n.renderType:exports.ParticleSystemRenderType.Quad,a==exports.ParticleSystemRenderType.Mesh)this.native.renderer=new t.ParticleMeshRenderer;else if(a==exports.ParticleSystemRenderType.Quad)this.native.renderer=new t.ParticleQuatRenderer;else throw new Error("Incorrect options: renderType");let i;if(n&&n.hasOwnProperty("affectorType")&&(i=n.affectorType),i==exports.ParticleSystemAffector.Color){const e=new t.Vector;e.pushBack(new t.ColorAffector),this.native.affectors=e}const r=new t.Vector;r.pushBack(new t.CircleEmitter),this.native.emitters=r,this.initialize(n,this.getProps())}else super()}static fromNative(e,n){const a=new R;if(n instanceof t.ParticleComponent)a.initWithNative(e,n,"ParticleComponent");else throw new Error("Incorrect argument to ParticleSystemComponent::fromNative");return a}getEmitter(){const e=this.native.emitters.get(0);return e instanceof t.CircleEmitter?e:void 0}getAffector(){const e=this.native.affectors.get(0);return e instanceof t.ColorAffector?e:void 0}getProps(){return P}isPlaying(){return this.native.isStarted()}start(){const e=this.getEmitter();return e&&(e.enable=!0),this.native.start()}stop(){return this.native.stop()}resume(){return this.native.resume()}pause(){return this.native.pause()}get orientation(){if(this.native.renderer instanceof t.ParticleQuatRenderer)return this.native.renderer.orientationType;throw new Error("Not supported param for render type")}set orientation(e){if(this.native.renderer instanceof t.ParticleQuatRenderer)this.native.renderer.orientationType=e;else throw new Error("Not supported param for render type")}get sortingMode(){return this.native.renderer.sortingMode}set sortingMode(e){this.native.renderer.sortingMode=e}get displayMode(){if(this.native.renderer instanceof t.ParticleMeshRenderer)return this.native.renderer.displayMode;throw new Error("Not supported param for render type")}set displayMode(e){if(this.native.renderer instanceof t.ParticleMeshRenderer)this.native.renderer.displayMode=e;else throw new Error("Not supported param for render type")}get mesh(){return this.native.renderer.templateMesh}set mesh(e){this.native.renderer.templateMesh=e}get autoPlay(){return this.native.autoStart}set autoPlay(e){this.native.autoStart=e}get flipDirection(){return this.native.flipY}set flipDirection(e){this.native.flipY=e}get totalParticles(){return this.native.particleQuota}set totalParticles(e){this.native.particleQuota=e}get material(){if(!this._material){const e=this.native.material;e&&(this._material=new I(e))}return this._material}set material(e){e&&(this._material=e,this.native.material=e.native)}get emitterRadius(){const e=this.getEmitter();if(e)return{min:e.inner_radius,max:e.radius};throw new Error("Invalid emitter in ParticleSystemComponent::get emitterRadius")}set emitterRadius(e){const t=this.getEmitter();if(t)t.innder_radius=e.min,t.radius=e.max;else throw new Error("Invalid emitter in ParticleSystemComponent::set emitterRadius")}get emissionRate(){const e=this.getEmitter();if(e){const t=e.emissionRate;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get emissionRate")}set emissionRate(e){const t=this.getEmitter();if(t){const n=t.emissionRate;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set emissionRate")}get lifetime(){const e=this.getEmitter();if(e){const t=e.totalTimeToLive;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get lifetime")}set lifetime(e){const t=this.getEmitter();if(t){const n=t.totalTimeToLive;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set lifetime")}get scale(){const e=this.getEmitter();if(e){const t=e.particleScale;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get scale")}set scale(e){const t=this.getEmitter();if(t){const n=t.particleScale;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set scale")}get angle(){const e=this.getEmitter();if(e){const t=e.angle;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get angle")}set angle(e){const t=this.getEmitter();if(t){const n=t.angle;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set angle")}get speed(){const e=this.getEmitter();if(e){const t=e.particleVelocity;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get speed")}set speed(e){const t=this.getEmitter();if(t){const n=t.particleVelocity;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set speed")}get rotationX(){const e=this.getEmitter();if(e){const t=e.particleXRotation;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get rotationX")}set rotationX(e){const t=this.getEmitter();if(t){const n=t.particleXRotation;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set rotationX")}get rotationY(){const e=this.getEmitter();if(e){const t=e.particleYRotation;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get rotationY")}set rotationY(e){const t=this.getEmitter();if(t){const n=t.particleYRotation;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set rotationY")}get rotationZ(){const e=this.getEmitter();if(e){const t=e.particleZRotation;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get rotationZ")}set rotationZ(e){const t=this.getEmitter();if(t){const n=t.particleZRotation;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set rotationZ")}get rotationXSpeed(){const e=this.getEmitter();if(e){const t=e.particleXRotationSpeed;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get rotationXSpeed")}set rotationXSpeed(e){const t=this.getEmitter();if(t){const n=t.particleXRotationSpeed;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set rotationXSpeed")}get rotationYSpeed(){const e=this.getEmitter();if(e){const t=e.particleYRotationSpeed;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get rotationYSpeed")}set rotationYSpeed(e){const t=this.getEmitter();if(t){const n=t.particleYRotationSpeed;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set rotationYSpeed")}get rotationZSpeed(){const e=this.getEmitter();if(e){const t=e.particleZRotationSpeed;return{min:t.min,max:t.max}}throw new Error("Invalid emitter in ParticleSystemComponent::get rotationZSpeed")}set rotationZSpeed(e){const t=this.getEmitter();if(t){const n=t.particleZRotationSpeed;n.min=e.min,n.max=e.max}else throw new Error("Invalid emitter in ParticleSystemComponent::set rotationZSpeed")}set colors(e){const n=this.getEmitter();if(n){const a=new t.Vec4Vector;for(const t of e)a.pushBack(new T(t.r,t.g,t.b,t.a));n.particleColorList=a}else throw new Error("Invalid emitter in ParticleSystemComponent::set colors")}get orientationStart(){const e=this.getEmitter();if(e)return e.orientationStart.quaternionToEuler();throw new Error("Invalid emitter in ParticleSystemComponent::get orientationStart")}set orientationStart(e){const t=this.getEmitter();if(t)t.orientationStart=new A().eulerAngles(e.x,e.y,e.z);else throw new Error("Invalid emitter in ParticleSystemComponent::set orientationStart")}get orientationEnd(){const e=this.getEmitter();if(e)return e.orientationEnd.quaternionToEuler();throw new Error("Invalid emitter in ParticleSystemComponent::get orientationEnd")}set orientationEnd(e){const t=this.getEmitter();if(t)t.orientationEnd=new A().eulerAngles(e.x,e.y,e.z);else throw new Error("Invalid emitter in ParticleSystemComponent::set orientationEnd")}get colorAffectorOperation(){const e=this.getAffector();if(e)return e.colorOperation;throw new Error("Invalid affector in ParticleSystemComponent::get colorAffectorOperation")}set colorAffectorOperation(e){const t=this.getAffector();if(t)t.colorOperation=e;else throw new Error("Invalid affector in ParticleSystemComponent::set colorAffectorOperation")}get colorAffectorColors(){const e=this.getAffector();if(e){const n=[];for(let a=0;a<e.colorMap.size();++a){const i=e.colorMap.get(a);n.push({time:i.get(0),color:new t.Color(i.get(1),i.get(2),i.get(3),i.get(4))})}return n}throw new Error("Invalid affector in ParticleSystemComponent::get colorAffectorColors")}set colorAffectorColors(e){const n=this.getAffector();if(n){const a=new t.Vector;for(const n of e){const e=new t.FloatVector;e.pushBack(n.time),e.pushBack(n.color.r),e.pushBack(n.color.g),e.pushBack(n.color.b),e.pushBack(n.color.a),a.pushBack(e)}n.colorMap=a}else throw new Error("Invalid affector in ParticleSystemComponent::set colorAffectorColors")}}R.nativeClasses=["ParticleComponent"];const k=["type","mass","category","mask"],L=16;class E extends a{constructor(e,t){e?(super(e,"RigidBody3D"),this.initialize(t,this.getProps())):super()}initialize(e,t){var n,a;e&&t&&super.initialize(e,t),this.native.initPosition=null==(n=this.entity)?void 0:n.position,this.native.initRotation=null==(a=this.entity)?void 0:a.rotationQuat,this.moveToLocation(this.native.initPosition,this.native.initRotation)}moveToLocation(e,t){this.native.position=e,this.native.rotationQuat=t}getProps(){return k}getContactPoints(e){const t=[];for(let n=0;n<e.contacts.size();++n)t.push(e.contacts.get(n));return t}get mass(){return this.native.mass}set mass(e){this.native.mass=e}setSensorEnabled(e){this.native.sensor=e}get type(){return this.native.rigidBodyType}set type(e){this.native.rigidBodyType=e}get category(){return Math.log2(this.native.categoryBits)}set category(e){this.native.categoryBits=1<<e}get mask(){const e=[],t=this.native.maskBits;for(let n=0;n<L;++n)0<(1<<n&t)&&e.push(n);return e}set mask(e){let t=0;for(const n of e)if(0<=n&&n<L)t|=1<<n;else throw new Error("Invalid mask value!");this.native.maskBits=t}}E.nativeClasses=["RigidBody3D"];const b=["angularDamping","angularFactor","angularVelocity","linearDamping","linearFactor","linearVelocity","gravityAcceleration"];class B extends E{constructor(e,t){e?(super(e,t),this.registerCallbacks()):super()}static fromNative(e,n){const a=new B;if(n instanceof t.RigidBody3D&&!n.sensor)a.initWithNative(e,n,"RigidBody3D");else throw new Error("Incorrect argument to RigidBodyComponent::fromNative");return a.registerCallbacks(),a}destroy(){this.removeCallbacks(),super.destroy()}getProps(){const e=super.getProps();return e.concat(b)}initialize(e,t){super.initialize(e,t),this.reset()}reset(){const e=new g(0,0,0);this.native.initLinearVel=e,this.native.initAngularVel=e,this.native.externalForce=e,this.native.forcePosition=e,this.native.externalTorque=e,this.native.externalImpulse=e,this.native.impulsePosition=e,this.native.externalTorqueImpulse=e,this.linearVelocity=e,this.angularVelocity=e,this.gravityAcceleration=new g(0,-9.81,0)}teleport(e,t){const n=new A;t&&n.eulerAngles(t.x,t.y,t.z),this.moveToLocation(e,n),this.reset()}applyForce(e,t){this.native.externalForce=e,this.native.forcePosition=t?t:new g(0,0,0)}applyTorque(e){this.native.externalTorque=e}applyImpusle(e,t){this.native.externalImpulse=e,this.native.impulsePosition=t?t:new g(0,0,0)}applyTorqueImpulse(e){this.native.externalTorqueImpulse=e}get angularDamping(){return this.native.angularDamping}set angularDamping(e){this.native.angularDamping=e}get angularFactor(){return this.native.angularFactor}set angularFactor(e){this.native.angularFactor=e}get angularVelocity(){return this.native.angularVel}set angularVelocity(e){this.native.angularVel=e}get linearDamping(){return this.native.linearDamping}set linearDamping(e){this.native.linearDamping=e}get linearFactor(){return this.native.linearFactor}set linearFactor(e){this.native.linearFactor=e}get linearVelocity(){return this.native.linearVel}set linearVelocity(e){this.native.linearVel=e}get gravityAcceleration(){return this.native.gravityAcceleration}set gravityAcceleration(e){this.native.gravityAcceleration=e}registerCallbacks(){this.addListener(t.Collision3DEventType.ENTER,this.onCollisionEnter,this),this.addListener(t.Collision3DEventType.STAY,this.onCollisionStay,this),this.addListener(t.Collision3DEventType.EXIT,this.onCollisionExit,this)}removeCallbacks(){this.removeListener(t.Collision3DEventType.ENTER,this.onCollisionEnter),this.removeListener(t.Collision3DEventType.STAY,this.onCollisionStay),this.removeListener(t.Collision3DEventType.EXIT,this.onCollisionExit)}onCollisionEnter(e,t){if(t&&t.otherRigidbody){var n,a;const i=t.otherRigidbody.entity,r=null==(n=e.entity)||null==(a=n.scene)?void 0:a.entityFromNative(i),o=e.getContactPoints(t);t.otherRigidbody.sensor?e.fire("triggerenter",e.entity,r,o):e.fire("collisionenter",e.entity,r,o)}}onCollisionStay(e,t){if(t&&t.otherRigidbody){var n,a;const i=t.otherRigidbody.entity,r=null==(n=e.entity)||null==(a=n.scene)?void 0:a.entityFromNative(i),o=e.getContactPoints(t);t.otherRigidbody.sensor?e.fire("triggerstay",e.entity,r,o):e.fire("collisionstay",e.entity,r,o)}}onCollisionExit(e,t){if(t&&t.otherRigidbody){var n,a;const i=t.otherRigidbody.entity,r=null==(n=e.entity)||null==(a=n.scene)?void 0:a.entityFromNative(i),o=e.getContactPoints(t);t.otherRigidbody.sensor?e.fire("triggerexit",e.entity,r,o):e.fire("collisionexit",e.entity,r,o)}}}const D=["alpha","alphaCascading"];class N extends a{constructor(e,t,n){if(!(e&&t))super();else if(e.screenTransform)super(e,t),this.initialize(n,this.getProps());else throw new Error("Widget2DComponent can only be added to an 2d entity")}getProps(){return D}get alpha(){return this.native.alpha}set alpha(e){this.native.alpha=e}get alphaCascading(){return this.native.cascadeAlphaEnabled}set alphaCascading(e){this.native.cascadeAlphaEnabled=e}}const w=["renderMode","color","texture","atlas","atlasIndex","filledType","filledStart","filledRange","slicedLeft","slicedRight","slicedTop","slicedBottom","slicedFillCenter","ellipseWidth","ellipseHeight","freeTopLeft","freeTopRight","freeBottomLeft","freeBottomRight","cornerTopLeft","cornerTopRight","cornerBottomLeft","cornerBottomRight"];class O extends N{constructor(e,t){super(e,"IFSprite2d",t)}static fromNative(e,n){const a=new O;if(n instanceof t.IFSprite2d)a.initWithNative(e,n,"IFSprite2d");else throw new Error("Incorrect argument in ImageComponent::fromNative");return a}getProps(){const e=super.getProps();return e.concat(w)}get renderMode(){return this.native.type}set renderMode(e){this.native.type=e}get color(){return this.native.colorTint}set color(e){this.native.colorTint=e}get texture(){return this.native.texture}set texture(e){this.native.texture=e}get atlas(){return this.native.imageAtlas}set atlas(e){this.native.imageAtlas=e}get atlasIndex(){return this.native.atlasIndex}set atlasIndex(e){this.native.atlasIndex=e}get filledType(){return this.native.filledType}set filledType(e){this.native.filledType=e}get filledStart(){return this.native.filledStartPos}set filledStart(e){this.native.filledStartPos=e}get filledRange(){return this.native.filledRange}set filledRange(e){this.native.filledRange=e}get slicedLeft(){return this.native.slicedLeft}set slicedLeft(e){this.native.slicedLeft=e}get slicedRight(){return this.native.slicedRight}set slicedRight(e){this.native.slicedRight=e}get slicedTop(){return this.native.slicedTop}set slicedTop(e){this.native.slicedTop=e}get slicedBottom(){return this.native.slicedBottom}set slicedBottom(e){this.native.slicedBottom=e}get slicedFillCenter(){return this.native.fillCenter}set slicedFillCenter(e){this.native.fillCenter=e}get ellipseWidth(){return this.native.ellipseX}set ellipseWidth(e){this.native.ellipseX=e}get ellipseHeight(){return this.native.ellipseY}set ellipseHeight(e){this.native.ellipseY=e}get freeTopLeft(){return this.native.topLeftPoint}set freeTopLeft(e){this.native.topLeftPoint=e}get freeTopRight(){return this.native.topRightPoint}set freeTopRight(e){this.native.topRightPoint=e}get freeBottomLeft(){return this.native.bottomLeftPoint}set freeBottomLeft(e){this.native.bottomLeftPoint=e}get freeBottomRight(){return this.native.bottomRightPoint}set freeBottomRight(e){this.native.bottomRightPoint=e}get cornerTopLeft(){return this.native.topLeft}set cornerTopLeft(e){this.native.topLeft=e}get cornerTopRight(){return this.native.topRight}set cornerTopRight(e){this.native.topRight=e}get cornerBottomLeft(){return this.native.bottomLeft}set cornerBottomLeft(e){this.native.bottomLeft=e}get cornerBottomRight(){return this.native.bottomRight}set cornerBottomRight(e){this.native.bottomRight=e}}O.nativeClasses=["IFSprite2d"];const z=["blendMode","alpha","alphaBlending","mask","clipping"];class U extends a{constructor(e,t){if(!e)super();else if(e.screenTransform)super(e,"IFLayer2d"),t||(t={}),t&&!t.hasOwnProperty("alphaBlending")&&(t.alphaBlending=!0),this.initialize(t,this.getProps());else throw new Error("CanvasComponent can only be added to an 2d entity")}static fromNative(e,n){const a=new U;if(n instanceof t.IFLayer2d)a.initWithNative(e,n,"IFLayer2d");else throw new Error("Incorrect argument to CanvasComponent::fromNative");return a}getProps(){return z}get blendMode(){return this.native.blendMode}set blendMode(e){this.native.blendMode=e}get maskType(){return this.native.maskType}set maskType(e){this.native.maskType=e}get renderOrder(){return this.native.renderOrderMode}set renderOrder(e){this.native.renderOrderMode=e}get alpha(){return this.native.blendAlpha}set alpha(e){this.native.blendAlpha=e}get clipping(){return this.native.scissorRectMask}set clipping(e){this.native.scissorRectMask=e}get alphaBlending(){return this.native.blendAlphaCkeck}set alphaBlending(e){this.native.blendAlphaCkeck=e}getDrawCallCount(){return this.native.drawCallNum}}U.nativeClasses=["IFLayer2d"];const V=["renderMode","pivot","flipX","flipY ","material","color"];class H extends a{constructor(e,t){e?(super(e,"Sprite2DRenderer"),this.initialize(t,this.getProps())):super()}static fromNative(e,n){const a=new H;if(n instanceof t.Sprite2DRenderer)a.initWithNative(e,n,"Sprite2DRenderer");else throw new Error("Incorrect argument in SpriteComponent::fromNative");return a}getProps(){return V}get material(){if(!this._material){const e=this.native.material;e&&(this._material=new I(e))}return this._material}set material(e){e&&(this._material=e,this.native.material=e.native)}get flipX(){return this.native.mirror}set flipX(e){this.native.mirror=e}get flipY(){return this.native.flip}set flipY(e){this.native.flip=e}get color(){return this.native.color}set color(e){this.native.color=e}get pivot(){return this.native.pivot}set pivot(e){this.native.pivot=e}get renderMode(){return this.native.stretchMode}set renderMode(e){this.native.stretchMode=e}}H.nativeClasses=["Sprite2DRenderer"];const G=["sequence","textureName","autoPlay","playMode"];class W extends a{constructor(e,t){e?(super(e,"AnimSeqComponent"),this.initialize(t,this.getProps())):super()}static fromNative(e,n){const a=new W;if(n instanceof t.AnimSeqComponent)a.initWithNative(e,n,"AnimSeqComponent");else throw new Error("Incorrect argument in SeqAnimationComponent::fromNative");return a}getProps(){return G}play(){this.native.play()}stop(){this.native.stop()}pause(){this.native.pause()}resume(){this.native.play()}seek(e){this.native.seek(e)}get sequence(){return this.native.animSeq}set sequence(e){this.native.animSeq=e}get textureName(){return this.native.texName}set textureName(e){this.native.texName=e}get autoPlay(){return this.native.autoplay}set autoPlay(e){this.native.autoplay=e}get playMode(){return this.native.playmode}set playMode(e){this.native.playmode=e}}W.nativeClasses=["AnimSeqComponent"];class q extends E{constructor(e,t){if(e){const n={type:exports.Physics3DType.Kinematic,mass:1};t&&(n.category=t.category,n.mask=t.mask),super(e,n),this.setSensorEnabled(!0),this.registerCallbacks()}else super()}static fromNative(e,n){const a=new q;if(n instanceof t.RigidBody3D&&n.sensor)a.initWithNative(e,n,"RigidBody3D");else throw new Error("Incorrect argument to TriggerComponent::fromNative");return a.registerCallbacks(),a}destroy(){this.removeCallbacks(),super.destroy()}registerCallbacks(){this.addListener(t.Collision3DEventType.ENTER,this.onTriggerEnter,this),this.addListener(t.Collision3DEventType.STAY,this.onTriggerStay,this),this.addListener(t.Collision3DEventType.EXIT,this.onTriggerExit,this)}removeCallbacks(){this.removeListener(t.Collision3DEventType.ENTER,this.onTriggerEnter),this.removeListener(t.Collision3DEventType.STAY,this.onTriggerStay),this.removeListener(t.Collision3DEventType.EXIT,this.onTriggerExit)}onTriggerEnter(e,t){if(t&&t.otherRigidbody){var n,a;const i=t.otherRigidbody.entity,r=null==(n=e.entity)||null==(a=n.scene)?void 0:a.entityFromNative(i),o=e.getContactPoints(t);e.fire("triggerenter",e.entity,r,o)}}onTriggerStay(e,t){if(t&&t.otherRigidbody){var n,a;const i=t.otherRigidbody.entity,r=null==(n=e.entity)||null==(a=n.scene)?void 0:a.entityFromNative(i),o=e.getContactPoints(t);e.fire("triggerstay",e.entity,r,o)}}onTriggerExit(e,t){if(t&&t.otherRigidbody){var n,a;const i=t.otherRigidbody.entity,r=null==(n=e.entity)||null==(a=n.scene)?void 0:a.entityFromNative(i),o=e.getContactPoints(t);e.fire("triggerexit",e.entity,r,o)}}}const j=["touchEnabled"];class Y extends a{constructor(e,t,n){if(!(e&&t))super();else if(e.screenTransform)super(e,t),this.initialize(n,this.getProps());else throw new Error("UIInteractComponent can only be added to an 2d entity")}getProps(){return j}get touchEnabled(){return this.native.touchEnabled}set touchEnabled(e){this.native.touchEnabled=e}}const X=["enabled","normalFrame","pressedFrame","disabledFrame","normalColor","pressedColor","disabledColor"];class Q extends Y{constructor(e,t,n){e&&t?super(e,t,n):super()}getProps(){const e=super.getProps();return e.concat(X)}get enabled(){return this.native.enabled}set enabled(e){this.native.enabled=e}get normalFrame(){return this.native.normalSprite}set normalFrame(e){this.native.normalSprite=e}get pressedFrame(){return this.native.pressedSprite}set pressedFrame(e){this.native.pressedSprite=e}get disabledFrame(){return this.native.disabledSprite}set disabledFrame(e){this.native.disabledSprite=e}get normalColor(){return this.native.normalColor}set normalColor(e){this.native.normalColor=e}get pressedColor(){return this.native.pressedColor}set pressedColor(e){this.native.pressedColor=e}get disabledColor(){return this.native.disabledColor}set disabledColor(e){this.native.disabledColor=e}}const K=[],J=1e3;class Z extends Q{constructor(e,t){e?(super(e,"IFUIButton",t),this.registerCallbacks()):super()}destroy(){this.removeCallbacks(),super.destroy()}static fromNative(e,n){const a=new Z;if(n instanceof t.IFUIButton)a.initWithNative(e,n,"IFButton2d");else throw new Error("Incorrect argument to ButtonComponent::fromNative");return a.registerCallbacks(),a}getProps(){const e=super.getProps();return e.concat(K)}registerCallbacks(){this.addListener(J,this.onClicked,this)}removeCallbacks(){this.removeListener(J,this.onClicked)}onClicked(e){e.fire("click",e.entity)}}Z.nativeClasses=["IFUIButton"];const $=["mask"];class ee extends a{constructor(e,t){if(!e)super();else if(e.camera)super(e,"IFEventDistributor"),this.initialize(t,this.getProps());else throw new Error("UIEventSystemComponent can only be added to an camera entity")}static fromNative(e,n){const a=new ee;if(n instanceof t.IFEventDistributor)a.initWithNative(e,n,"IFEventDistributor");else throw new Error("Incorrect argument to UIEventSystemComponent::fromNative");return a}getProps(){return $}get mask(){return this.native.EventMask}set mask(e){this.native.EventMask=e}}ee.nativeClasses=["IFEventDistributor"];const te=["autoSize","center","size"],ne=new Map([[exports.UIColliderType.Box,"IFBoxCollider"]]);function ae(e){if(!ne.has(e))throw new Error("Unknown type of collider");return ne.get(e)}class ie extends a{constructor(e,t){if(!e)super();else if(e.screenTransform&&t&&t.hasOwnProperty("type"))super(e,ae(t.type)),this.initialize(t,this.getProps());else throw new Error("UIColliderComponent can only be added to an 2d entity with the type option specified")}static fromNative(e,n){const a=new ie;if(n instanceof t.IFBoxCollider)a.initWithNative(e,n,"IFBoxCollider"),a.type=exports.UIColliderType.Box;else throw new Error("Incorrect argument to UIColliderComponent::fromNative");return a}getProps(){return te}get autoSize(){return this.native.autoAdjustCollider}set autoSize(e){this.native.autoAdjustCollider=e}get center(){return this.native.center}set center(e){this.native.center=e}get size(){return this.native.size}set size(e){this.native.size=e}}ie.nativeClasses=["IFBoxCollider"];const re=["fillEntity","thumbEntity","mode","direction","minValue","maxValue","step","value"],oe=1004;class se extends Q{constructor(e,t){e?(super(e,"IFUISlider",t),this.registerCallbacks()):super()}destroy(){this.removeCallbacks(),super.destroy()}static fromNative(e,n){const a=new se;if(n instanceof t.IFUISlider)a.initWithNative(e,n,"IFSlider2d");else throw new Error("Incorrect argument to SliderComponent::fromNative");return a.registerCallbacks(),a}getProps(){const e=super.getProps();return e.concat(re)}registerCallbacks(){this.addListener(oe,this.onValueChanged,this)}removeCallbacks(){this.removeListener(oe,this.onValueChanged)}onValueChanged(e){e.fire("change",e.entity)}get mode(){return this.native.mode}set mode(e){this.native.mode=e}get direction(){return this.native.direction}set direction(e){this.native.direction=e}get minValue(){return this.native.minValue}set minValue(e){this.native.minValue=e}get maxValue(){return this.native.maxValue}set maxValue(e){this.native.maxValue=e}get step(){return this.native.steps}set step(e){this.native.steps=e}get value(){return this.native.value}set value(e){this.native.value=e}set fillEntity(e){if(e.native)this.native.fillTrans=e.native.getComponent("IFTransform2d");else throw new Error("Invalid fillEntity!")}set thumbEntity(e){if(e.native)this.native.thumbTrans=e.native.getComponent("IFTransform2d");else throw new Error("Invalid thumbEntity!")}}se.nativeClasses=["IFUISlider"];const de=[],le=1e3;class ce extends Q{constructor(e,t){e?(super(e,"IFUISliderThumb",t),this.registerCallbacks()):super()}destroy(){this.removeCallbacks(),super.destroy()}static fromNative(e,n){const a=new ce;if(n instanceof t.IFUISliderThumb)a.initWithNative(e,n,"IFSliderThumb2d");else throw new Error("Incorrect argument to SliderThumbComponent::fromNative");return a}getProps(){const e=super.getProps();return e.concat(de)}registerCallbacks(){this.addListener(le,this.onClicked,this)}removeCallbacks(){this.removeListener(le,this.onClicked)}onClicked(e){e.fire("click",e.entity)}}ce.nativeClasses=["IFUISliderThumb"];const pe=["text","textColor","fontPath","fontSize","fontType","alignment","fitType","spacing"];class me extends N{constructor(e,t){e?super(e,"IFUILabel",t):super()}static fromNative(e,n){const a=new me;if(n instanceof t.IFUILabel)a.initWithNative(e,n,"IFUILabel");else throw new Error("Incorrect argument to LabelComponent::fromNative");return a}getProps(){const e=super.getProps();return e.concat(pe)}get text(){return this.native.text}set text(e){this.native.text=e}get textColor(){return this.native.textColor}set textColor(e){this.native.textColor=e}get fontPath(){return this.native.fontPath}set fontPath(e){this.native.fontPath=e}get fontSize(){return this.native.fontSize}set fontSize(e){this.native.fontSize=e}get fontType(){return this.native.fontType}set fontType(e){this.native.fontType=e}get alignment(){return this.native.alignment}set alignment(e){this.native.alignment=e}get fitType(){return this.native.fitType}set fitType(e){this.native.fitType=e}get spacing(){return this.native.spacing}set spacing(e){this.native.spacing=e}}me.nativeClasses=["IFUILabel"];const ue=["type","size"];class ge extends a{constructor(e,t){if(!e)super();else if(e.screenTransform)super(e,"IFCanvas2d"),this.initialize(t,this.getProps());else throw new Error("Canvas2DComponent can only be added to an 2d entity")}static fromNative(e,n){const a=new ge;if(n instanceof t.IFCanvas2d)a.initWithNative(e,n,"IFCanvas2d");else throw new Error("Incorrect argument to Canvas2DComponent::fromNative");return a}getProps(){return ue}get type(){return this.native.resolutionType}set type(e){this.native.resolutionType=e}get size(){return this.native.resolutionSize}set size(e){this.native.resolutionSize=e}}ge.nativeClasses=["IFCanvas2d"];const fe=["type","sizeMode","gridMode","verticalDirection","horizontalDirection","sortMode","cellSize","paddingLeft","paddingRight","paddingTop","paddingBottom","horizontalSpace","verticalSpace","useScaledSize","excludeInvisible"];class he extends a{constructor(e,t){if(!e)super();else if(e.screenTransform)super(e,"IFUIGrid"),this.initialize(t,this.getProps());else throw new Error("LayoutComponent can only be added to an 2d entity")}static fromNative(e,n){const a=new he;if(n instanceof t.IFUIGrid)a.initWithNative(e,n,"IFUIGrid");else throw new Error("Incorrect argument to LayoutComponent::fromNative");return a}getProps(){return fe}get type(){return this.native.type}set type(e){this.native.type=e}get sizeMode(){return this.native.resizeMode}set sizeMode(e){this.native.resizeMode=e}get gridMode(){return this.native.startAxis}set gridMode(e){this.native.startAxis=e}get verticalDirection(){return this.native.verticalDirection}set verticalDirection(e){this.native.verticalDirection=e}get horizontalDirection(){return this.native.horizontalDirection}set horizontalDirection(e){this.native.horizontalDirection=e}get sortMode(){return this.native.sortingType}set sortMode(e){this.native.sortingType=e}get cellSize(){return this.native.cellSize}set cellSize(e){this.native.cellSize=e}get paddingLeft(){return this.native.paddingLeft}set paddingLeft(e){this.native.paddingLeft=e}get paddingRight(){return this.native.paddingRight}set paddingRight(e){this.native.paddingRight=e}get paddingTop(){return this.native.paddingTop}set paddingTop(e){this.native.paddingTop=e}get paddingBottom(){return this.native.paddingBottom}set paddingBottom(e){this.native.paddingBottom=e}get horizontalSpace(){return this.native.horizontalSpace}set horizontalSpace(e){this.native.horizontalSpace=e}get verticalSpace(){return this.native.verticalSpace}set verticalSpace(e){this.native.verticalSpace=e}get useScaledSize(){return this.native.affectedByScale}set useScaledSize(e){this.native.affectedByScale=e}get excludeInvisible(){return this.native.filterInvisibleChildren}set excludeInvisible(e){this.native.filterInvisibleChildren=e}}he.nativeClasses=["IFUIGrid"];const ve=["target","leftTarget","rightTarget","topTarget","bottomTarget","leftAnchor","rightAnchor","topAnchor","bottomAnchor","leftOffset","rightOffset","topOffset","bottomOffset"];class ye extends a{constructor(e,t){if(!e)super();else if(e.screenTransform)super(e,"IFUIConstraints"),this.initialize(t,this.getProps());else throw new Error("AlignmentComponent can only be added to an 2d entity")}static fromNative(e,n){const a=new ye;if(n instanceof t.IFUIConstraints)a.initWithNative(e,n,"IFUIConstraints");else throw new Error("Incorrect argument to AlignmentComponent::fromNative");return a}getProps(){return ve}set target(e){if(e.native)this.native.target=e.native.getComponent("IFTransform2d");else throw new Error("Invalid target")}set leftTarget(e){if(e.native)this.native.leftTarget=e.native.getComponent("IFTransform2d");else throw new Error("Invalid leftTarget!")}set rightTarget(e){if(e.native)this.native.rightTarget=e.native.getComponent("IFTransform2d");else throw new Error("Invalid rightTarget!")}set bottomTarget(e){if(e.native)this.native.bottomTarget=e.native.getComponent("IFTransform2d");else throw new Error("Invalid bottomTarget!")}set topTarget(e){if(e.native)this.native.topTarget=e.native.getComponent("IFTransform2d");else throw new Error("Invalid topTarget!")}get leftAnchor(){return this.native.leftRange}set leftAnchor(e){this.native.leftRange=e}get rightAnchor(){return this.native.rightRange}set rightAnchor(e){this.native.rightRange=e}get topAnchor(){return this.native.topRange}set topAnchor(e){this.native.topRange=e}get bottomAnchor(){return this.native.bottomRange}set bottomAnchor(e){this.native.bottomRange=e}get leftOffset(){return this.native.leftOffset}set leftOffset(e){this.native.leftOffset=e}get rightOffset(){return this.native.rightOffset}set rightOffset(e){this.native.rightOffset=e}get topOffset(){return this.native.topOffset}set topOffset(e){this.native.topOffset=e}get bottomOffset(){return this.native.bottomOffset}set bottomOffset(e){this.native.bottomOffset=e}}ye.nativeClasses=["IFUIConstraints"];const _e=["otherEntity","linearLowerLimit","linearUpperLimit","angularLowerLimit","angularUpperLimit","positionOffset","otherPositionOffset","rotationOffset","otherRotationOffset","linearCorrection","linearSoftness","angularCorrection","angularSoftness"];class Te extends a{constructor(e,t){e?(super(e,"GenericJoint3D"),this.initialize(t,this.getProps())):super()}static fromNative(e,n){const a=new Te;if(n instanceof t.GenericJoint3D)a.initWithNative(e,n,"GenericJoint3D");else throw new Error("Incorrect argument to GenericJoint3DComponent::fromNative");return a}getProps(){return _e}set otherEntity(e){if(e.native)this.native.connectedBody=e.native.getComponent("RigidBody3D");else throw new Error("Invalid target")}set linearLowerLimit(e){this.native.linearLowerLimit=e}get linearLowerLimit(){return this.native.linearLowerLimit}set linearUpperLimit(e){this.native.linearUpperLimit=e}get linearUpperLimit(){return this.native.linearUpperLimit}set angularLowerLimit(e){this.native.angularLowerLimit=e}get angularLowerLimit(){return this.native.angularLowerLimit}set angularUpperLimit(e){this.native.angularUpperLimit=e}get angularUpperLimit(){return this.native.angularUpperLimit}set positionOffset(e){this.native.posAnchorA=e}get positionOffset(){return this.native.posAnchorA}set otherPositionOffset(e){this.native.posAnchorB=e}get otherPositionOffset(){return this.native.posAnchorB}set rotationOffset(e){this.native.rotAnchorA=e}get rotationOffset(){return this.native.rotAnchorA}set otherRotationOffset(e){this.native.rotAnchorB=e}get otherRotationOffset(){return this.native.rotAnchorB}set linearCorrection(e){this.native.erpLinear=e}get linearCorrection(){return this.native.erpLinear}set linearSoftness(e){this.native.cfmLinear=e}get linearSoftness(){return this.native.cfmLinear}set angularCorrection(e){this.native.erpAngular=e}get angularCorrection(){return this.native.erpAngular}set angularSoftness(e){this.native.cfmAngular=e}get angularSoftness(){return this.native.cfmAngular}}Te.nativeClasses=["GenericJoint3D"];const Se=["animations"];class Ie extends a{constructor(e,t){e?(super(e,"Animator"),this.initialize(t,this.getProps())):super()}static fromNative(e,n){const a=new Ie;if(n instanceof t.Animator)a.initWithNative(e,n,"Animator");else throw new Error("Incorrect argument in AnimationComponent::fromNative");return a}getProps(){return Se}play(e,t){const n={playMode:t&&t.playMode!==void 0?t.playMode:exports.AnimationPlayMode.Once,speed:t&&t.speed!==void 0?t.speed:1,fadeTime:t&&t.fadeTime!==void 0?t.fadeTime:0,startTime:t&&t.startTime!==void 0?t.startTime:0};this.native.play(e,n.playMode,n.speed,n.fadeTime,n.startTime)}stop(){this.native.stopAllAnimations()}pause(){this.native.pauseAnimator()}resume(){this.native.resumeAnimator()}get animations(){const e=[],t=this.native.animations;for(let n=0;n<t.size();n++)e.push(t.get(n));return e}set animations(e){const n=new t.Vector;for(const t of e)n.pushBack(t);this.native.animations=n}}Ie.nativeClasses=["Animator"];const Ce=["audio","autoPlay","loop"];class Me extends a{constructor(e,t){e?(super(e,"Audio"),this.initialize(t,this.getProps())):super()}static fromNative(e,n){const a=new Me;if(n instanceof t.Audio)a.initWithNative(e,n,"Audio");else throw new Error("Incorrect argument in AudioComponent::fromNative");return a}getProps(){return Ce}get audio(){return this.native.clip}set audio(e){this.native.clip=e}get autoPlay(){return this.native.playOnAwake}set autoPlay(e){this.native.playOnAwake=e}get loop(){return this.native.loop}set loop(e){this.native.loop=e}play(){this.native.play()}stop(){this.native.stop()}pause(){this.native.pause()}resume(){this.native.resume()}reset(){this.native.reset()}}Me.nativeClasses=["Audio"];const xe=["position","rotation","scale","size","pivot","flipX","flipY"];class Fe extends a{constructor(e,t){e?(super(e,"IFTransform2d"),this.initialize(t,this.getProps())):super()}static fromNative(e,n){const a=new Fe;if(n instanceof t.IFTransform2d)a.initWithNative(e,n,"IFTransform2d");else throw new Error("Incorrect argument in ScreenTransformComponent::fromNative");return a}getProps(){return xe}get position(){return this.native.position}set position(e){this.native.position=e}get scale(){return this.native.scale}set scale(e){this.native.scale=e}get rotation(){return this.native.rotation}set rotation(e){this.native.rotation=e}get size(){return this.native.size}set size(e){this.native.size=e}get pivot(){return this.native.pivot}set pivot(e){this.native.pivot=e}get flipX(){return this.native.flipX}set flipX(e){this.native.flipX=e}get flipY(){return this.native.flipY}set flipY(e){this.native.flipY=e}}Fe.nativeClasses=["IFTransform2d"];class Ae extends a{constructor(e,t){if(super(),e){const n=e.native.addJsScriptComponent(null==t?void 0:t.scriptPath);this.initWithNative(e,n,"JSScriptComponent")}}static fromNative(e,t){const n=new Ae;return n.initWithNative(e,t,"JSScriptComponent"),n}get script(){return this.native.getScript().ref}}Ae.nativeClasses=["JSScriptComponent"];class Pe extends e{constructor(e,n){if(super(),this._components=new Map,e&&e instanceof Re&&n&&n instanceof t.Entity)this.scene=e,this.native=n,this._transform=this.native.getComponent("Transform"),this.scene.addEntityToCache(this);else{var a;if(null!=n&&n.scene)this.scene=null==n?void 0:n.scene;else{var i;this.scene=null==(i=tn.engine)?void 0:i.scene}if(!this.scene)throw new Error("No active scene found!");const r=e&&"string"==typeof e?e:"Untitled";this.native=this.scene.native.createEntity(r),n&&!(n instanceof t.Entity)&&(this.layer=n.layer?n.layer:0,this.tags=n.tags?n.tags:[]),this._transform=this.native.addComponent("Transform"),null==(a=this.scene)?void 0:a.addEntityToCache(this)}}static fromNative(e,n){if(n instanceof t.Entity)return new Pe(e,n);throw new Error("Incorrect argument to Entity::fromNative")}get name(){return this.native.name}set name(e){this.native.name=e}get parent(){var e;let t;return this._transform&&this._transform.parent&&(t=this._transform.parent.entity),null==(e=this.scene)?void 0:e.entityFromNative(t)}get enabled(){return this.native.selfvisible}set enabled(e){this.native.visible=e}get enabledInScene(){return this.native.visible}get layer(){return this.native.layer}set layer(e){if(0<=e&&e<r)this.native.layer=e;else throw new Error("Invalid layer value!")}get tags(){const e=[],t=this.native.tag;for(let n=0;n<o;++n)t&1<<n&&e.push(n);return e}set tags(e){let t=0;for(const n of e)if(0<=n&&n<o)t|=1<<n;else throw new Error(`Invalid tag value: ${n}`);this.native.tag=t}get screenTransform(){return this.getComponent(Fe)}get camera(){return this.getComponent(d)}get model(){return this.getComponent(M)}get light(){return this.getComponent(y)}get rigidBody(){return this.getComponent(B)}get trigger(){return this.getComponent(q)}get collider(){return this.getComponent(m)}get particleSystem(){return this.getComponent(R)}get sprite(){return this.getComponent(H)}get image(){return this.getComponent(O)}get canvas(){return this.getComponent(U)}get canvasScaler(){return this.getComponent(ge)}get button(){return this.getComponent(Z)}get uiEventSystem(){return this.getComponent(ee)}get uiCollider(){return this.getComponent(ie)}get slider(){return this.getComponent(se)}get sliderThumb(){return this.getComponent(ce)}get label(){return this.getComponent(me)}get seqAnimation(){return this.getComponent(W)}get layout(){return this.getComponent(he)}get alignment(){return this.getComponent(ye)}get genericJoint(){return this.getComponent(Te)}get animation(){return this.getComponent(Ie)}get audio(){return this.getComponent(Me)}get custom(){return this.getComponent(Ae)}addComponent(e,t){const n=this._addComponent(e,t);if(n){const e=n.native.handle;return this._components.has(e)?(n.entity=void 0,n.native=void 0,n.destroy(),this._components.get(e)):(this._components.set(e,n),n)}}_addComponent(e,t){switch(e){case"ScreenTransform":if(!this.getComponent(Fe)){this.native.removeComponent("Transform");const e=new Fe(this,t);return this._transform=e.native,e}throw new Error(`Entity already has ScreenTransform component`);case"Camera":return new d(this,t);case"Model":return new M(this,t);case"Light":return new y(this,t);case"RigidBody3D":return new B(this,t);case"Trigger3D":return new q(this,t);case"Collider3D":return new m(this,t);case"ParticleSystem":return new R(this,t);case"Sprite":return new H(this,t);case"Image":return new O(this,t);case"Canvas":return new U(this,t);case"CanvasScaler":return new ge(this,t);case"Button":return new Z(this,t);case"UIEventSystem":return new ee(this,t);case"UICollider":return new ie(this,t);case"Slider":return new se(this,t);case"SliderThumb":return new ce(this,t);case"Label":return new me(this,t);case"SeqAnimation":return new W(this,t);case"Layout":return new he(this,t);case"Alignment":return new ye(this,t);case"GenericJoint3D":return new Te(this,t);case"Animation":return new Ie(this,t);case"Audio":return new Me(this,t);case"Custom":return new Ae(this,t);default:throw new Error(`Doesn't support component type: ${e}`);}}removeComponent(e){const t=this.getComponentViaStringType(e);return!!t&&(this._components.delete(t.native.handle),t.destroy(),"ScreenTransform"===e&&(this._transform=this.native.addComponent("Transform")),!0)}getComponentViaStringType(e){switch(e){case"ScreenTransform":return this.getComponent(Fe);case"Camera":return this.getComponent(d);case"Model":return this.getComponent(M);case"Light":return this.getComponent(y);case"RigidBody3D":return this.getComponent(B);case"Trigger3D":return this.getComponent(q);case"Collider3D":return this.getComponent(m);case"ParticleSystem":return this.getComponent(R);case"Image":return this.getComponent(O);case"Canvas":return this.getComponent(U);case"CanvasScaler":return this.getComponent(ge);case"Sprite":return this.getComponent(H);case"Button":return this.getComponent(Z);case"UIEventSystem":return this.getComponent(ee);case"UICollider":return this.getComponent(ie);case"Slider":return this.getComponent(se);case"SliderThumb":return this.getComponent(ce);case"Label":return this.getComponent(me);case"SeqAnimation":return this.getComponent(W);case"Layout":return this.getComponent(he);case"Alignment":return this.getComponent(ye);case"GenericJoint3D":return this.getComponent(Te);case"Animation":return this.getComponent(Ie);case"Audio":return this.getComponent(Me);case"Custom":return this.getComponent(Ae);default:throw new Error(`Doesn't support component type: ${e}`);}}addChild(e){this._transform&&this._transform.addTransform(e.native.getComponent("Transform"))}removeChild(e){this._transform&&this._transform.removeTransform(e.native.getComponent("Transform"))}findByName(e){let t;if(this.name===e)t=this;else for(const n of this.children)if(t=n.findByName(e),t)break;return t}findByTag(e){let t;if(this.hasTag(e))t=this;else for(const n of this.children)if(t=n.findByTag(e),t)break;return t}findAllByName(e){const t=[];this.name===e&&t.push(this);for(const n of this.children)t.push(...n.findAllByName(e));return t}findAllByTag(e){const t=[];this.hasTag(e)&&t.push(this);for(const n of this.children)t.push(...n.findAllByTag(e));return t}get position(){return this._transform.localPosition}set position(e){this._transform.localPosition=e}get scale(){return this._transform.localScale}set scale(e){this._transform.localScale=e}get rotation(){return this._transform.localEulerAngle}set rotation(e){this._transform.localEulerAngle=e}get rotationQuat(){return this._transform.localOrientation}set rotationQuat(e){this._transform.localOrientation=e}get worldPosition(){return this._transform.worldPosition}set worldPosition(e){this._transform.worldPosition=e}get worldScale(){return this._transform.worldScale}set worldScale(e){this._transform.worldScale=e}get worldRotation(){return this._transform.worldOrientation}set worldRotation(e){this._transform.worldOrientation=e}get worldEulerAngles(){return this._transform.worldEulerAngle}set worldEulerAngles(e){this._transform.worldEulerAngle=e}addTag(e){if(0<=e&&e<o)this.native.addTag(e);else throw new Error(`Invalid tag:[${e}] number when adding tag. (valid tag: 0-31)`)}hasTag(e){return this.native.hasTag(e)}destroy(){var e,t;for(const e of this._components.values())e.destroy();this._components.clear(),null==(e=this.scene)?void 0:e.removeEntityToCache(this),null==(t=this.scene)?void 0:t.native.removeEntity(this.native),this.native=void 0,this.scene=void 0,this._transform=void 0}get children(){const e=[];for(let n=0;n<this._transform.children.size();++n){var t;const a=this._transform.children.get(n),i=null==(t=this.scene)?void 0:t.entityFromNative(a.entity);if(i)e.push(i);else throw new Error("Entity has invalid child!")}return e}getComponent(e){let t;if("string"==typeof e){const n=this.native.getComponents(Ae.nativeClasses[0]);for(let a=0;a<n.size();++a){const i=n.get(a);if(i.getScript().className===e){this._components.has(i.handle)?t=this._components.get(i.handle):(t=Ae.fromNative(this,i),this._components.set(i.handle,t));break}}}else if(e.nativeClasses)for(const n of e.nativeClasses){const a=this.native.getComponent(n);if(a){this._components.has(a.handle)?t=this._components.get(a.handle):(t=e.fromNative(this,a),this._components.set(a.handle,t));break}}return t}getComponents(e){const t=[];if(e.nativeClasses)for(const n of e.nativeClasses){const a=this.native.getComponents(n);for(let n=0;n<a.size();++n){const i=a.get(n);let r;this._components.has(i.handle)?r=this._components.get(i.handle):(r=e.fromNative(this,i),this._components.set(i.handle,r)),t.push(r)}}return t}hasComponent(e){let t=!1;if(e.nativeClasses)for(const n of e.nativeClasses)if(t=!!this.native.getComponent(n),t)break;return t}findByComponent(e){let t;if(this.hasComponent(e))t=this;else for(const n of this.children)if(t=n.findByComponent(e),t)break;return t}findAllByComponent(e){const t=[];this.hasComponent(e)&&t.push(this);for(const n of this.children)t.push(...n.findAllByComponent(e));return t}}class Re{constructor(e){if(this.entities=new Map,this._physicsSystem=void 0,e&&e instanceof t.Scene){this.native=e;const t=this.native.entities,n=t.empty()?void 0:this.findRoot(t);this.root=n?this.entityFromNative(n):new Pe("Root",{scene:this})}else this.native=new t.Scene,this.name="string"==typeof e?e:"Untitled",this.root=new Pe("Root",{scene:this});t.AmazingManager.addScene(this.native)}findRoot(e){let t=e.front().getComponent("Transform");for(;t.parent;)t=t.parent;return t.entity}get children(){const e=[];for(let t=0;t<this.native.entities.size();++t){const n=this.native.entities.get(t),a=n.getComponent("Transform");if(!a)throw new Error("Scene has invalid child entity!");else if(!a.parent){const t=this.entityFromNative(n);if(t)e.push(t);else throw new Error("Scene has invalid child entity!")}}return e}get name(){return this.native.name}set name(e){this.native.name=e}get visible(){return this.native.visible}set visible(e){this.native.visible=e}addSystem(e){this.native.addSystem(e)}addEntityToCache(e){e.native.handle&&this.entities.set(e.native.handle,e)}removeEntityToCache(e){e.native.handle&&this.entities.delete(e.native.handle)}entityFromNative(e){return e?e.handle&&this.entities.has(e.handle)?this.entities.get(e.handle):Pe.fromNative(this,e):void 0}destroy(){this.entities.clear(),this.native.visible=!1,t.AmazingManager.removeScene(this.native)}rayCast(e,t){const n=[],a=this.physicsSystem.rayTest(e,t);for(let r=0;r<a.size();++r){const e=a.get(r),t=this.entityFromNative(e.entity);t&&n.push(t)}return n}findByName(e){let t;for(let n=0;n<this.native.entities.size();++n){const a=this.entityFromNative(this.native.entities.get(n));if(a&&a.name===e){t=a;break}}return t}findByTag(e){let t;for(let n=0;n<this.native.entities.size();++n){const a=this.entityFromNative(this.native.entities.get(n));if(a&&a.hasTag(e)){t=a;break}}return t}findByComponent(e){let t;for(let n=0;n<this.native.entities.size();++n){const a=this.entityFromNative(this.native.entities.get(n));if(a&&a.hasComponent(e)){t=a;break}}return t}findAllByName(e){const t=[];for(let n=0;n<this.native.entities.size();++n){const a=this.entityFromNative(this.native.entities.get(n));a&&a.name===e&&t.push(a)}return t}findAllByTag(e){const t=[];for(let n=0;n<this.native.entities.size();++n){const a=this.entityFromNative(this.native.entities.get(n));a&&a.hasTag(e)&&t.push(a)}return t}findAllByComponent(e){const t=[];for(let n=0;n<this.native.entities.size();++n){const a=this.entityFromNative(this.native.entities.get(n));a&&a.hasComponent(e)&&t.push(a)}return t}get physicsSystem(){return void 0===this._physicsSystem&&(this._physicsSystem=this.native.getSystem("Physics3DSystem")),this._physicsSystem}}var ke;(function(e){e[e.TouchStart=0]="TouchStart",e[e.TouchMove=1]="TouchMove",e[e.TouchStationary=2]="TouchStationary",e[e.TouchEnd=3]="TouchEnd",e[e.TouchCancel=4]="TouchCancel"})(ke||(ke={}));class Le{constructor(e,t,n,a,i,r,o,s){this.identifier=-1,this.type=ke.TouchStart,this.x=0,this.y=0,this.force=0,this.size=0,this.time=0,this.count=0,this.valid=!1,e!==void 0&&(this.identifier=e,this.valid=!0),t!==void 0&&(this.type=t),n!==void 0&&(this.x=n),a!==void 0&&(this.y=a),i!==void 0&&(this.force=i),r!==void 0&&(this.size=r),o!==void 0&&(this.time=o),s!==void 0&&(this.count=s)}static fromNative(e){const t=new Le(e.pointerId,Le.convertTouchType(e.type),e.x,e.y,e.force,e.size,e.time,e.count);return t}static convertTouchType(e){return e===t.TouchType.TOUCH_BEGAN?ke.TouchStart:e===t.TouchType.TOUCH_MOVED?ke.TouchMove:e===t.TouchType.TOUCH_STATIONARY?ke.TouchStationary:e===t.TouchType.TOUCH_ENDED?ke.TouchEnd:e===t.TouchType.TOUCH_CANCELED?ke.TouchCancel:ke.TouchEnd}}class Ee extends e{constructor(e,t){super(),this._width=e,this._height=t}start(){}destroy(){}onEvent(e){if(e.type===t.EventType.TOUCH){const t=e.args.get(0),n=this.convertTouchEvent(t);switch(n.type){case ke.TouchStart:this.fire("touchstart",n);break;case ke.TouchMove:this.fire("touchmove",n);break;case ke.TouchEnd:this.fire("touchend",n);break;case ke.TouchCancel:this.fire("touchcancel",n);}}}convertTouchEvent(e){var t=Math.round;const n=t(e.x*this._width),a=this._height-t(e.y*this._height),i=Le.fromNative(e);return i.x=n,i.y=a,i}}class be{static toPascalCase(e){return e?`${e}`.replace(new RegExp(/[-_]+/,"g")," ").replace(new RegExp(/[^\w\s]/,"g"),"").replace(new RegExp(/\s+(.)(\w*)/,"g"),(e,t,n)=>`${t.toUpperCase()+n.toLowerCase()}`).replace(new RegExp(/\w/),e=>e.toUpperCase()):e}static getFilename(e){return e.substring(e.lastIndexOf("/")+1)}}class Be{static createQuadMesh(){const e=new t.Mesh,n=new t.VertexAttribDesc;n.semantic=t.VertexAttribType.POSITION;const a=new t.VertexAttribDesc;a.semantic=t.VertexAttribType.TEXCOORD0;const i=new t.Vector;i.insert(0,n),i.insert(1,a),e.vertexAttribs=i;const r=-1,o=1,s=1,d=[o,s,0,1,1,o,r,0,1,0,-1,r,0,0,0,-1,s,0,0,1],l=new t.FloatVector;for(let e=0;e<d.length;++e)l.insert(e,d[e]);e.vertices=l;const c=new t.SubMesh;c.primitive=t.Primitive.TRIANGLES;const p=[0,1,2,2,3,0],m=new t.UInt16Vector;for(let e=0;e<p.length;++e)m.insert(e,p[e]);return c.indices16=m,c.mesh=e,e.addSubMesh(c),e}}class De{static createShaderPass(e,n){const a=new t.Pass;a.shaders=e;const i=new t.Map;return i.insert("inPosition",t.VertexAttribType.POSITION),i.insert("inTexCoord",t.VertexAttribType.TEXCOORD0),a.semantics=i,a.renderState=n,a}static createScreenMaterial(e){const n=new t.RenderState;n.viewport=new t.ViewportState,n.viewport.rect=new t.Rect(0,0,1,1),n.viewport.minDepth=0,n.viewport.maxDepth=1;const a=this.createShaderPass(e,n);return this.createMaterial(a)}static createMaterial(e){const n=new t.XShader;n.passes.pushBack(e);const a=new t.Material;a.xshader=n;const i=new t.PropertySheet;return a.properties=i,a}static createRenderTexture(){const e=new t.RenderTexture;return e.depth=1,e.width=640,e.height=360,e.filterMag=t.FilterMode.LINEAR,e.filterMin=t.FilterMode.LINEAR,e.filterMipmap=t.FilterMipmapMode.NONE,e.attachment=t.RenderTextureAttachment.NONE,e}static createRenderTexturePlus(e,n,a,i){const r=new t.RenderTexture;return r.builtinType=t.BuiltInTextureType.NORAML,r.internalFormat=t.InternalFormat.RGBA8,r.dataType=t.DataType.U8norm,r.depth=1,r.attachment=t.RenderTextureAttachment.DEPTH24,r.filterMag=i,r.filterMin=i,r.filterMipmap=t.FilterMipmapMode.NONE,r.width=e,r.height=n,r.colorFormat=a,r}static createTexture2D(){const e=new t.Texture2D;return e.filterMin=t.FilterMode.LINEAR,e.filterMag=t.FilterMode.LINEAR,e}static createShaders(e){const n=new t.Map;for(const a in e){const i=new t.Shader;i.type=t.ShaderType.VERTEX,i.source=e[a].vs;const r=new t.Shader;r.type=t.ShaderType.FRAGMENT,r.source=e[a].fs;const o=new t.Vector;o.insert(0,i),o.insert(1,r),n.insert(a,o)}return n}static createEmptyMaterial(){const e=new t.Material,n=new t.XShader;e.xshader=n;const a=new t.PropertySheet;return e.properties=a,e}static addPassToMaterial(e,n,a,i=!1){const r=new t.Pass,o=new t.Map;for(const r in n){const e=new t.Shader;e.type=t.ShaderType.VERTEX,e.source=n[r].vs;const a=new t.Shader;a.type=t.ShaderType.FRAGMENT,a.source=n[r].fs;const i=new t.Vector;i.pushBack(e),i.pushBack(a),o.insert(r,i)}r.shaders=o;const s=new t.Map;s.insert("inPosition",t.VertexAttribType.POSITION),s.insert("inTexCoord",t.VertexAttribType.TEXCOORD0),r.semantics=s;const d=new t.DepthStencilState;d.depthTestEnable=!1;const l=new t.RenderState;if(l.depthstencil=d,a){d.stencilTestEnable=!0;const e=new t.StencilOpState;e.compareOp=t.CompareOp.EQUAL,e.reference=42,e.writeMask=0,d.stencilFront=e,d.stencilBack=e}if(i){const e=new t.Vector,n=new t.ColorBlendAttachmentState;n.blendEnable=i,n.srcColorBlendFactor=t.BlendFactor.SRC_ALPHA,n.dstColorBlendFactor=t.BlendFactor.ONE_MINUS_SRC_ALPHA,n.srcAlphaBlendFactor=t.BlendFactor.SRC_ALPHA,n.dstAlphaBlendFactor=t.BlendFactor.ONE_MINUS_SRC_ALPHA,n.ColorBlendOp=t.BlendOp.ADD,n.AlphaBlendOp=t.BlendOp.ADD,e.pushBack(n),l.colorBlend=new t.ColorBlendState,l.colorBlend.attachments=e}return r.renderState=l,e.xshader.passes.pushBack(r),r}}class Ne{constructor(){this._screenMesh=Be.createQuadMesh(),this._cmdBuffer=new t.CommandBuffer,this._cmdBufferDirty=!1}onPreUpdate(){this._cmdBuffer.clearAll()}onPostUpdate(){var e;const t=null==(e=tn.engine)?void 0:e.scene.native;t&&this._cmdBufferDirty&&(t.commitCommandBuffer(this._cmdBuffer),this._cmdBufferDirty=!1)}get screenMesh(){return this._screenMesh}cmdBufferSetRenderTexture(e){this._cmdBuffer.setRenderTexture(e),this._cmdBufferDirty=!0}cmdBufferClearRenderTexture(e,t,n,a){this._cmdBuffer.clearRenderTexture(e,t,n,a),this._cmdBufferDirty=!0}cmdBufferDrawMesh(e,t,n,a,i,r){this._cmdBuffer.drawMesh(e,t,n,a,i,r),this._cmdBufferDirty=!0}}class we{constructor(e){var n,a;const i=e.properties;this._flip=i.flip,this._inputTexture=i.inputTexture,this._renderTexture=null==(n=tn.engine)?void 0:n.customAssets.getNativeObject(e.uuid),this._renderTexture.depth=1,this._renderTexture.filterMag=t.FilterMode.LINEAR,this._renderTexture.filterMin=t.FilterMode.LINEAR,this._renderTexture.filterMipmap=t.FilterMipmapMode.NONE,this._renderTexture.attachment=t.RenderTextureAttachment.NONE,this._renderTexture.width=t.AmazingManager.getSingleton("BuiltinObject").getInputTextureWidth(),this._renderTexture.height=t.AmazingManager.getSingleton("BuiltinObject").getInputTextureHeight();const r=De.createShaders({gles2:{vs:"\n    precision highp float;\n\n    attribute vec3 inPosition;\n    attribute vec2 inTexCoord;\n\n    varying vec2 v_TexCoord;\n\n    uniform mat4 u_Model;\n    uniform float u_FlipVertical;\n\n    void main() {\n      vec2 flipCoord = vec2(inTexCoord.x, 1. - inTexCoord.y);\n      v_TexCoord = mix(inTexCoord, flipCoord, u_FlipVertical);\n      gl_Position = u_Model * vec4(inPosition, 1.0);\n    }\n    ",fs:`
    precision highp float;

    varying vec2 v_TexCoord;

    uniform sampler2D u_CameraTex;

    void main() {
      gl_FragColor = texture2D(u_CameraTex, v_TexCoord);
    }
    `},metal:{vs:`
    #include <metal_stdlib>
    #include <simd/simd.h>
    
    using namespace metal;
    
    struct buffer_t
    {
        float u_FlipVertical;
        float4x4 u_Model;
    };
    
    struct main0_out
    {
        float2 v_TexCoord;
        float4 gl_Position [[position]];
    };
    
    struct main0_in
    {
        float3 inPosition [[attribute(0)]];
        float2 inTexCoord [[attribute(1)]];
    };
    
    vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
    {
        main0_out out = {};
        float2 flipCoord = float2(in.inTexCoord.x, 1.0 - in.inTexCoord.y);
        out.v_TexCoord = mix(in.inTexCoord, flipCoord, float2(buffer.u_FlipVertical));
        out.gl_Position = buffer.u_Model * float4(in.inPosition, 1.0);
        out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
        return out;
    }
    `,fs:`
    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 v_TexCoord;
    };

    fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_CameraTex [[texture(0)]], sampler u_CameraTexSmplr [[sampler(0)]])
    {
        main0_out out = {};
        out.gl_FragColor = u_CameraTex.sample(u_CameraTexSmplr, in.v_TexCoord);
        return out;
    }
    `}});this._screenMaterial=De.createScreenMaterial(r);const o=null==(a=tn.engine)?void 0:a.assets.loadSync(this._inputTexture);this._screenMaterial.setTex("u_CameraTex",null==o?void 0:o.resource);const s=!0===this._flip?1:0;this._screenMaterial.setFloat("u_FlipVertical",s)}onStart(){}onUpdate(){const e=tn.engine.customAssets.cmdBufferHelper;e.cmdBufferSetRenderTexture(this._renderTexture),e.cmdBufferDrawMesh(e.screenMesh,new S,this._screenMaterial,0,0,new t.MaterialPropertyBlock)}onLateUpdate(){}onDestroy(){}}class Oe extends e{constructor(){super(),this.faces=[],this._faceProvider=new Ve(this),this.hasFaceMap=new Map}static getInstance(){return null==this._instance&&(this._instance=new Oe),this._instance}static getLandmark(e,t,n){return this.getInstance().getLandmarks(e,t,n)}getLandmarks(e,t,n){if(this._faceProvider)return this._faceProvider.getLandmark(e,t,n)}onUpdate(){this._faceProvider.onUpdate()}init(){}static get faces(){return this.getInstance().faces}static on(e,t,n){return this.getInstance().on(e,t,n)}static off(e,t,n){return this.getInstance().off(e,t,n)}setFaceState(e,t){this.hasFaceMap.has(t)||this.hasFaceMap.set(t,!1),this.hasFaceMap.get(t)!==e&&(!0===e?this.fire(exports.FaceEvent.Detected,t):this.fire(exports.FaceEvent.Lost,t),this.hasFaceMap.set(t,e))}}class ze{constructor(){this.vertexes=new t.Vec3Vector,this.landmarks=new t.Vec3Vector,this.normals=new t.Vec3Vector,this.tangents=new t.Vec3Vector,this.mvp=new S,this.modelMatrix=new S,this.scale=0}}class Ue{constructor(){this.score=0,this.id=0,this.yaw=0,this.pitch=0,this.roll=0,this.transform=new S,this.rect=new t.Rect,this.expression=exports.FaceExpression.Unknown,this.isValidFace=!1,this.action=exports.FaceAction.None,this.faceMesh=new ze,this.landmarks106=new t.Vec2Vector,this.landmarks240EyeLeft=new t.Vec2Vector,this.landmarks240EyeRight=new t.Vec2Vector,this.landmarks240EyebrowLeft=new t.Vec2Vector,this.landmarks240EyebrowRight=new t.Vec2Vector,this.landmarks240Lip=new t.Vec2Vector,this.landmarks280LeftIris=new t.Vec2Vector,this.landmarks280RightIris=new t.Vec2Vector,this.landmarks3d=new t.Vec3Vector}isValid(){return this.isValidFace}hasAction(){return this.action!==exports.FaceAction.None}}class Ve{constructor(e){this._mgr=e,this.lastFaceIdSet=new Set}facePartHelper(e,t,n,a){for(let r=e;r<t;r++)a.pushBack(n.get(r));return a}getLandmark(e,t,n){return n===exports.FaceLandmarkType.Face106?this.get106landmark(e,t):n===exports.FaceLandmarkType.Face240?this.get240landmark(e,t):n===exports.FaceLandmarkType.Face280?this.get280landmark(e,t):n===exports.FaceLandmarkType.Face3d?this.get3dlandmark(e,t):(console.error(`Head doesn't support ${n} yet`),null)}get106landmark(e,n){switch(e){case exports.FacePart.Whole:return this._mgr.faces[n].landmarks106;case exports.FacePart.LeftEye:let a=new t.Vec2Vector;return a=this.facePartHelper(52,58,this._mgr.faces[n].landmarks106,a),a=this.facePartHelper(72,74,this._mgr.faces[n].landmarks106,a),a=this.facePartHelper(104,105,this._mgr.faces[n].landmarks106,a),a;case exports.FacePart.RightEye:let i=new t.Vec2Vector;return i=this.facePartHelper(58,64,this._mgr.faces[n].landmarks106,i),i=this.facePartHelper(75,78,this._mgr.faces[n].landmarks106,i),i=this.facePartHelper(105,106,this._mgr.faces[n].landmarks106,i),i;case exports.FacePart.Nose:let r=new t.Vec2Vector;return r=this.facePartHelper(43,52,this._mgr.faces[n].landmarks106,r),r=this.facePartHelper(80,84,this._mgr.faces[n].landmarks106,r),r;case exports.FacePart.Mouth:let o=new t.Vec2Vector;return o=this.facePartHelper(84,104,this._mgr.faces[n].landmarks106,o),o;case exports.FacePart.LeftEyeBrow:let s=new t.Vec2Vector;return s=this.facePartHelper(33,38,this._mgr.faces[n].landmarks106,s),s=this.facePartHelper(64,68,this._mgr.faces[n].landmarks106,s),s;case exports.FacePart.RightEyeBrow:let d=new t.Vec2Vector;return d=this.facePartHelper(38,43,this._mgr.faces[n].landmarks106,d),d=this.facePartHelper(68,72,this._mgr.faces[n].landmarks106,d),d;default:return console.error(`Head 106 doesn't support ${e} yet`),null;}}get240landmark(e,t){switch(e){case exports.FacePart.Whole:let n=this.facePartHelper(0,this._mgr.faces[t].landmarks240EyeLeft.size(),this._mgr.faces[t].landmarks240EyeLeft,this._mgr.faces[t].landmarks106);return n=this.facePartHelper(0,this._mgr.faces[t].landmarks240EyeRight.size(),this._mgr.faces[t].landmarks240EyeRight,n),n=this.facePartHelper(0,this._mgr.faces[t].landmarks240EyebrowLeft.size(),this._mgr.faces[t].landmarks240EyebrowLeft,n),n=this.facePartHelper(0,this._mgr.faces[t].landmarks240EyebrowRight.size(),this._mgr.faces[t].landmarks240EyebrowRight,n),n=this.facePartHelper(0,this._mgr.faces[t].landmarks240Lip.size(),this._mgr.faces[t].landmarks240Lip,n),n;case exports.FacePart.LeftEye:const a=this._mgr.getLandmarks(exports.FacePart.LeftEye,t,exports.FaceLandmarkType.Face106),i=this.facePartHelper(0,this._mgr.faces[t].landmarks240EyeLeft.size(),this._mgr.faces[t].landmarks240EyeLeft,a);return i;case exports.FacePart.RightEye:const r=this._mgr.getLandmarks(exports.FacePart.RightEye,t,exports.FaceLandmarkType.Face106),o=this.facePartHelper(0,this._mgr.faces[t].landmarks240EyeRight.size(),this._mgr.faces[t].landmarks240EyeRight,r);return o;case exports.FacePart.Nose:const s=this._mgr.getLandmarks(exports.FacePart.Nose,t,exports.FaceLandmarkType.Face106);return s;case exports.FacePart.Mouth:const d=this._mgr.getLandmarks(exports.FacePart.Mouth,t,exports.FaceLandmarkType.Face106),l=this.facePartHelper(0,this._mgr.faces[t].landmarks240Lip.size(),this._mgr.faces[t].landmarks240Lip,d);return l;case exports.FacePart.LeftEyeBrow:const c=this._mgr.getLandmarks(exports.FacePart.LeftEyeBrow,t,exports.FaceLandmarkType.Face106),p=this.facePartHelper(0,this._mgr.faces[t].landmarks240EyebrowLeft.size(),this._mgr.faces[t].landmarks240EyebrowLeft,c);return p;case exports.FacePart.RightEyeBrow:const m=this._mgr.getLandmarks(exports.FacePart.RightEyeBrow,t,exports.FaceLandmarkType.Face106),u=this.facePartHelper(0,this._mgr.faces[t].landmarks240EyebrowRight.size(),this._mgr.faces[t].landmarks240EyebrowRight,m);return u;default:return console.error(`Head 240 doesn't support ${e} yet`),null;}}get280landmark(e,t){switch(e){case exports.FacePart.Whole:const n=this._mgr.getLandmarks(exports.FacePart.Whole,t,exports.FaceLandmarkType.Face240);let a=this.facePartHelper(0,this._mgr.faces[t].landmarks280LeftIris.size(),this._mgr.faces[t].landmarks280LeftIris,n);return a=this.facePartHelper(0,this._mgr.faces[t].landmarks280RightIris.size(),this._mgr.faces[t].landmarks280RightIris,a),a;case exports.FacePart.LeftEye:const i=this._mgr.getLandmarks(exports.FacePart.LeftEye,t,exports.FaceLandmarkType.Face240),r=this.facePartHelper(0,this._mgr.faces[t].landmarks280LeftIris.size(),this._mgr.faces[t].landmarks280LeftIris,i);return r;case exports.FacePart.RightEye:const o=this._mgr.getLandmarks(exports.FacePart.RightEye,t,exports.FaceLandmarkType.Face240),s=this.facePartHelper(0,this._mgr.faces[t].landmarks280RightIris.size(),this._mgr.faces[t].landmarks280RightIris,o);return s;case exports.FacePart.Nose:const d=this._mgr.getLandmarks(exports.FacePart.Nose,t,exports.FaceLandmarkType.Face240);return d;case exports.FacePart.Mouth:const l=this._mgr.getLandmarks(exports.FacePart.Mouth,t,exports.FaceLandmarkType.Face240);return l;case exports.FacePart.LeftEyeBrow:const c=this._mgr.getLandmarks(exports.FacePart.LeftEyeBrow,t,exports.FaceLandmarkType.Face240);return c;case exports.FacePart.RightEyeBrow:const p=this._mgr.getLandmarks(exports.FacePart.RightEyeBrow,t,exports.FaceLandmarkType.Face240);return p;default:return console.error(`Head 280 doesn't support ${e} yet`),null;}}get3dlandmark(e,t){return e===exports.FacePart.Whole?this._mgr.faces[t].landmarks3d:(console.error(`Head 3d doesn't support ${e} yet`),null)}onUpdate(){var e;const t=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,n=t.getFaceCount();this._mgr.faces=Array(n);const a=new Set;if(0<n){for(let e=0;e<n;e++){const n=t.getFaceBaseInfo(e),i=t.getFaceAttributeInfo(e),r=t.getFaceExtraInfo(e),o=t.getFaceMeshInfo(e),s=new Ue;this._mgr.faces[e]=s,null!=n&&(this._mgr.setFaceState(!0,n.ID),a.add(n.ID),s.isValidFace=!0,s.score=n.score,s.id=n.ID,s.yaw=n.yaw,s.pitch=n.pitch,s.roll=n.roll,s.rect=n.rect,s.action=n.action,s.landmarks106=n.points_array),null!=r&&(s.landmarks240EyeLeft=r.eye_left,s.landmarks240EyeRight=r.eye_right,s.landmarks240EyebrowLeft=r.eyebrow_left,s.landmarks240EyebrowRight=r.eyebrow_right,s.landmarks240Lip=r.lips,s.landmarks280LeftIris=r.left_iris,s.landmarks280RightIris=r.right_iris),null!=i&&(s.expression=i.exp_type),null!=o&&(s.landmarks3d=o.landmarks,s.faceMesh.vertexes=o.vertexes,s.faceMesh.normals=o.normals,s.faceMesh.tangents=o.tangents,s.faceMesh.scale=o.scale,s.faceMesh.mvp=o.mvp,s.faceMesh.modelMatrix=o.modelMatrix)}for(const e of this.lastFaceIdSet.values())a.has(e)||this._mgr.setFaceState(!1,e);this.lastFaceIdSet.clear(),a.forEach(e=>this.lastFaceIdSet.add(e))}else this.lastFaceIdSet.forEach(e=>this._mgr.setFaceState(!1,e)),this.lastFaceIdSet.clear()}}class He{constructor(e){var n,a,i;const r=e.properties;this._initialized=!1,this._faceIndex=r.faceIndex,this._textureResScale=r.textureResScale,this._meshPath=r.meshPath,this._flipUv=r.flipUv,this._renderTexture=null==(n=tn.engine)?void 0:n.customAssets.getNativeObject(e.uuid),this._renderTexture.depth=1,this._renderTexture.width=640,this._renderTexture.height=360,this._renderTexture.filterMag=t.FilterMode.LINEAR,this._renderTexture.filterMin=t.FilterMode.LINEAR,this._renderTexture.filterMipmap=t.FilterMipmapMode.NONE,this._renderTexture.attachment=t.RenderTextureAttachment.NONE;const o=De.createShaders({gles2:{vs:"precision highp float;\n    attribute vec3 attPosition;\n    attribute vec2 attTexcoord0;\n    uniform mat4 u_Model;\n    uniform mat4 u_MVP;\n    uniform float u_flipUv;\n    varying vec2 g_vary_uv0;\n    varying vec4 v_sampling_pos;\n    void main ()\n    {\n      vec4 homogeneous_pos = vec4(attPosition, 1.0);\n      g_vary_uv0 = attTexcoord0;\n      v_sampling_pos = u_MVP * homogeneous_pos;\n      if (u_flipUv > 0.5) {\n        g_vary_uv0.y = 1. - g_vary_uv0.y;\n      }\n      vec2 uv_pos = g_vary_uv0.xy * 2.0 - vec2(1.0);\n      gl_Position = vec4(uv_pos, 0.0, 1.0);\n    }\n    ",fs:`precision highp float;
    uniform sampler2D u_AlbedoTexture;
    varying vec4 v_sampling_pos;
    void main ()
    {
      vec2 sampling_uv = (v_sampling_pos.xy / v_sampling_pos.w) * 0.5 + 0.5;
      vec4 textureColor = texture2D( u_AlbedoTexture, sampling_uv);
      gl_FragColor = textureColor;
    }
    `},metal:{vs:`
    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct buffer_t
    {
        float4x4 u_MVP;
        float u_flipUv;
    };

    struct main0_out
    {
        float2 g_vary_uv0;
        float4 v_sampling_pos;
        float4 gl_Position [[position]];
    };

    struct main0_in
    {
        float3 attPosition [[attribute(0)]];
        float2 attTexcoord0 [[attribute(1)]];
    };

    vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
    {
        main0_out out = {};
        float4 homogeneous_pos = float4(in.attPosition, 1.0);
        out.g_vary_uv0 = in.attTexcoord0;
        out.v_sampling_pos = buffer.u_MVP * homogeneous_pos;
        if (buffer.u_flipUv > 0.5)
        {
            out.g_vary_uv0.y = 1.0 - out.g_vary_uv0.y;
        }
        float2 uv_pos = (out.g_vary_uv0 * 2.0) - float2(1.0);
        out.gl_Position = float4(uv_pos, 0.0, 1.0);
        out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
        return out;
    }
    `,fs:`
    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float4 v_sampling_pos;
    };

    fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_AlbedoTexture [[texture(0)]], sampler u_AlbedoTextureSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float2 sampling_uv = ((in.v_sampling_pos.xy / float2(in.v_sampling_pos.w)) * 0.5) + float2(0.5);
        float4 textureColor = u_AlbedoTexture.sample(u_AlbedoTextureSmplr, sampling_uv);
        out.gl_FragColor = textureColor;
        return out;
    }
    `}});this._faceMaterial=this.createFaceTexMaterial(o);const s=null==(a=tn.engine)?void 0:a.assets.loadSync("share://input.texture");this._faceMaterial.setTex("u_AlbedoTexture",null==s?void 0:s.resource),this._faceMaterial.setFloat("u_flipUv",!0===this._flipUv?1:0),this._renderTexture.width=t.AmazingManager.getSingleton("BuiltinObject").getOutputTextureWidth()*this._textureResScale,this._renderTexture.height=t.AmazingManager.getSingleton("BuiltinObject").getOutputTextureHeight()*this._textureResScale,this._faceMesh=null==(i=tn.engine.assets.loadSync(this._meshPath))?void 0:i.resource}onStart(){}onLateUpdate(){}onDestroy(){}onUpdate(){const e=tn.engine.customAssets.cmdBufferHelper;if(this._initialized||(e.cmdBufferSetRenderTexture(this._renderTexture),e.cmdBufferClearRenderTexture(!0,!0,new t.Color(0,0,0,0),0),this._initialized=!0),null!=this._faceMesh&&null!=this._faceMaterial){const n=Oe.faces,a=n.length;if(a<=this._faceIndex)return;const i=n[this._faceIndex].faceMesh;if(null===i)return;const r=i.vertexes,o=i.normals;null!=r&&null!=o&&0<r.size()&&0<o.size()&&(this._faceMaterial.setMat4("u_MVP",i.mvp),this._faceMesh.setVertexArray(r),this._faceMesh.setNormalArray(o));const s=new S;s.setIdentity(),e.cmdBufferSetRenderTexture(this._renderTexture),e.cmdBufferDrawMesh(this._faceMesh,s,this._faceMaterial,0,0,new t.MaterialPropertyBlock)}else null==this._faceMesh&&console.error("face texture asset: mesh not found!"),null==this._faceMaterial&&console.error("face texture asset: material not found!")}createFaceTexMaterial(e){const n=new t.Pass;n.shaders=e,n.clearColor=new t.Color(0,0,0,1),n.clearType=t.CameraClearType.COLOR_DEPTH;const a=new t.Map;a.insert("attColor",t.VertexAttribType.COLOR),a.insert("attPosition",t.VertexAttribType.POSITION),a.insert("attTexcoord0",t.VertexAttribType.TEXCOORD0),n.semantics=a;const i=new t.RenderState;i.viewport=new t.ViewportState,i.viewport.rect=new t.Rect(0,0,1,1),i.viewport.minDepth=0,i.viewport.maxDepth=1,i.rasterization=new t.RasterizationState;const r=new t.DepthStencilState;r.depthWriteEnable=!1,i.depthstencil=r;const o=new t.ColorBlendState,s=new t.ColorBlendAttachmentState;s.blendEnable=!0,s.srcColorBlendFactor=t.BlendFactor.SRC_ALPHA,s.dstColorBlendFactor=t.BlendFactor.ONE_MINUS_SRC_ALPHA,s.srcAlphaBlendFactor=t.BlendFactor.SRC_ALPHA,s.dstAlphaBlendFactor=t.BlendFactor.ONE_MINUS_SRC_ALPHA,s.ColorBlendOp=t.BlendOp.ADD,s.AlphaBlendOp=t.BlendOp.ADD,o.attachments.pushBack(s),i.colorBlend=o,n.renderState=i;const d=De.createMaterial(n);return d.renderQueue=1,d.setMat4("u_MVP",new S),d}}class Ge{constructor(){this._segProviderMap=new Map,this._cmdBufferHelper=new Ne}static getInstance(){return null==this._instance&&(this._instance=new Ge),this._instance}static getMask(e,t=0){return this.getInstance().getMask(e,t)}init(){this._segProviderMap.set(exports.SegmentationType.Body.toLowerCase(),new je(this)),this._segProviderMap.set(exports.SegmentationType.Head.toLowerCase(),new Ze(this)),this._segProviderMap.set(exports.SegmentationType.Sky.toLowerCase(),new Ye(this)),this._segProviderMap.set(exports.SegmentationType.Hair.toLowerCase(),new Je(this)),this._segProviderMap.set(exports.SegmentationType.Building.toLowerCase(),new Qe(this)),this._segProviderMap.set(exports.SegmentationType.Cloth.toLowerCase(),new Xe(this)),this._segProviderMap.set(exports.SegmentationType.Ground.toLowerCase(),new Ke(this))}get cmdBufferHelper(){return this._cmdBufferHelper}onUpdate(e){this._cmdBufferHelper.onPreUpdate();for(const t of this._segProviderMap.values())t.onUpdate(e);this._cmdBufferHelper.onPostUpdate()}createRenderTextureHelper(e){return new We(De.createTexture2D(),De.createRenderTexture(),De.createScreenMaterial(e))}createNomralScreenShader(){return De.createShaders({gles2:{vs:"attribute vec3 inPosition;\n       attribute vec2 inTexCoord;\n       varying vec2 uv;\n       uniform mat4 u_Model;\n       void main() {\n       gl_Position = u_Model * vec4(inPosition, 1.0);\n       uv = inTexCoord;\n       }\n      ",fs:`precision lowp float;
       varying vec2 uv;
       uniform sampler2D tex;
       void main() {
        gl_FragColor = texture2D(tex, uv);
      }
      `},metal:{vs:`
      #include <metal_stdlib>
      #include <simd/simd.h>
  
      using namespace metal;
  
      struct buffer_t
      {
          float4x4 u_Model;
      };
  
      struct main0_out
      {
          float2 uv;
          float4 gl_Position [[position]];
      };
  
      struct main0_in
      {
          float3 inPosition [[attribute(0)]];
          float2 inTexCoord [[attribute(1)]];
      };
  
      vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
      {
          main0_out out = {};
          out.gl_Position = buffer.u_Model * float4(in.inPosition, 1.0);
          out.uv = in.inTexCoord;
          out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
          return out;
      }
       `,fs:`
      #include <metal_stdlib>
      #include <simd/simd.h>
      
      using namespace metal;
      
      struct main0_out
      {
          float4 gl_FragColor [[color(0)]];
      };
      
      struct main0_in
      {
          float2 uv;
      };
      
      fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> tex [[texture(0)]], sampler texSmplr [[sampler(0)]])
      {
          main0_out out = {};
          out.gl_FragColor = tex.sample(texSmplr, in.uv);
          return out;
      }    
       `}})}getMask(e,t){const n=this._segProviderMap.get(e.toLowerCase());return n?n.getMask(t):(console.error(`Segmentation doesn't support ${e} yet`),null)}}class We{constructor(e,t,n){this.texture=e,this.renderTexture=t,this.screenMaterial=n}}class qe{constructor(e){this._mgr=e,this._texture=null}}class je extends qe{onUpdate(){var e;if(null==this._texture)return;const n=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,a=n.getBgInfo(),i=this.getOrCreateTexture();null==a?i.storage(new t.Image):i.storage(a.bgMask)}getOrCreateTexture(){return null==this._texture&&(this._texture=new t.Texture2D),this._texture}getMask(){return this.getOrCreateTexture()}}class Ye extends qe{onUpdate(){var e;if(null==this._texture)return;const n=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,a=n.getSkyInfo(),i=this.getOrCreateTexture();null==a?i.storage(new t.Image):i.storage(a.skyMask)}getOrCreateTexture(){return null==this._texture&&(this._texture=new t.Texture2D),this._texture}getMask(){return this.getOrCreateTexture()}}class Xe extends qe{onUpdate(){var e;if(null==this._texture)return;const n=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,a=n.getClothesSegInfo(),i=this.getOrCreateTexture();null==a?i.storage(new t.Image):i.storage(a.alphaMask)}getOrCreateTexture(){return null==this._texture&&(this._texture=new t.Texture2D),this._texture}getMask(){return this.getOrCreateTexture()}}class Qe extends qe{constructor(){super(...arguments),this._initialized=!1}onUpdate(){var e;if(!this._initialized)return;const n=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,a=n.getBuildingSegInfo(),i=this.getOrCreateTexture();null==a?i.storage(new t.Image):i.storage(a.mask),this._screenMaterial.setTex("tex",i),this._mgr.cmdBufferHelper.cmdBufferSetRenderTexture(this._renderTexture),this._mgr.cmdBufferHelper.cmdBufferDrawMesh(this._mgr.cmdBufferHelper.screenMesh,new S,this._screenMaterial,0,0,new t.MaterialPropertyBlock)}getOrCreateTexture(){return null==this._texture&&(this._texture=new t.Texture2D),this._texture}getMask(){return this.tryToInit(),this._renderTexture}tryToInit(){if(this._initialized)return;this._initialized=!0,this._renderTexture=De.createRenderTexture();const e=De.createShaders({gles2:{vs:"attribute vec3 inPosition;\n      attribute vec2 inTexCoord;\n      varying vec2 uv; \n      uniform mat4 u_Model;\n      void main() {\n        gl_Position = u_Model * vec4(inPosition, 1.0);\n        uv = inTexCoord;\n      }\n      ",fs:`precision lowp float;
      varying vec2 uv;
      uniform sampler2D tex;
      void main() {
        vec4 color = texture2D(tex, uv);
        gl_FragColor = vec4(color.g, color.g, color.g, 1.0);
      } 
      `},metal:{vs:`
      #include <metal_stdlib>
      #include <simd/simd.h>
      
      using namespace metal;
      
      struct buffer_t
      {
          float4x4 u_Model;
      };
      
      struct main0_out
      {
          float2 uv;
          float4 gl_Position [[position]];
      };
      
      struct main0_in
      {
          float3 inPosition [[attribute(0)]];
          float2 inTexCoord [[attribute(1)]];
      };
      
      vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
      {
          main0_out out = {};
          out.gl_Position = buffer.u_Model * float4(in.inPosition, 1.0);
          out.uv = in.inTexCoord;
          out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
          return out;
      }    
      `,fs:`
    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 uv;
    };

    fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> tex [[texture(0)]], sampler texSmplr [[sampler(0)]])
    {
        main0_out out = {};
        float4 color = tex.sample(texSmplr, in.uv);
        out.gl_FragColor = float4(color.y, color.y, color.y, 1.0);
        return out;
    }
      `}});this._screenMaterial=De.createScreenMaterial(e)}}class Ke extends qe{onUpdate(){var e;if(null==this._texture)return;const n=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,a=n.getGroundSegInfo(),i=this.getOrCreateTexture();null==a?i.storage(new t.Image):i.storage(a.groundMask)}getOrCreateTexture(){return null==this._texture&&(this._texture=new t.Texture2D),this._texture}getMask(){return this.getOrCreateTexture()}}class Je extends qe{onUpdate(){var e;if(null==this._texture)return;const n=null==(e=tn.engine)?void 0:e.algoritms.nativeResult.getHairInfo(),a=this.getOrCreateTexture();null==n?a.storage(new t.Image):a.storage(n.mask)}getOrCreateTexture(){return null==this._texture&&(this._texture=new t.Texture2D),this._texture}getMask(){return this.getOrCreateTexture()}}class Ze extends qe{constructor(e){super(e),this._rdMap=new Map}onUpdate(){var e;const t=null==(e=tn.engine)?void 0:e.algoritms.nativeResult;for(let e=0;e<t.getHeadSegInfoCount();++e)this.getOrCreateRnderTextureHelper(e);for(const e of this._rdMap.keys())this.updateMask(t.getHeadSegInfo(e),this._rdMap.get(e))}getMask(e){var t;return null==(t=this.getOrCreateRnderTextureHelper(e))?void 0:t.renderTexture}getOrCreateRnderTextureHelper(e){return this._rdMap.has(e)||this._rdMap.set(e,this._mgr.createRenderTextureHelper(this._mgr.createNomralScreenShader())),this._rdMap.get(e)}updateMask(e,n){if(null!=n){const a=new S;if(this._mgr.cmdBufferHelper.cmdBufferSetRenderTexture(n.renderTexture),this._mgr.cmdBufferHelper.cmdBufferClearRenderTexture(!0,!1,new t.Color(0,0,0,0),1),null!=e){n.texture.storage(e.alpha);const i=e.width,r=e.height,o=e.srcWidth,s=e.srcHeight,d=e.matrix,l=d.get(0),c=d.get(1),p=d.get(2),m=d.get(3),u=d.get(4),g=d.get(5),f=new S(l,m,0,0,c,u,0,0,0,0,1,0,p,g,0,1);f.invert_Full();const h=new S(i/2,0,0,0,0,r/2,0,0,0,0,1,0,i/2,r/2,0,1),v=new S;S.multiplyMatrices4x4(f,h,v);const y=new S(2/o,0,0,0,0,2/s,0,0,0,0,1,0,-1,-1,0,1);S.multiplyMatrices4x4(y,v,a),n.screenMaterial.setTex("tex",n.texture),this._mgr.cmdBufferHelper.cmdBufferDrawMesh(this._mgr.cmdBufferHelper.screenMesh,a,n.screenMaterial,0,0,new t.MaterialPropertyBlock)}}}}class $e{constructor(e){var n;const a=e.properties;this._segType=a.segmentationType.toLowerCase(),this._smoothness=a.smoothness,this._invert=a.invert,this._useCutoutTexture=a.useCutoutTexture,this._cutoutTexture=a.cutoutTexture,this._cutoutTextureInverseY=a.cutoutTextureInverseY,this._renderTexture=null==(n=tn.engine)?void 0:n.customAssets.getNativeObject(e.uuid),this._renderTexture.depth=1,this._renderTexture.width=t.AmazingManager.getSingleton("BuiltinObject").getInputTextureWidth(),this._renderTexture.height=t.AmazingManager.getSingleton("BuiltinObject").getInputTextureHeight(),this._renderTexture.filterMag=t.FilterMode.LINEAR,this._renderTexture.filterMin=t.FilterMode.LINEAR,this._renderTexture.filterMipmap=t.FilterMipmapMode.NONE,this._renderTexture.attachment=t.RenderTextureAttachment.NONE;const i=De.createShaders({gles2:{vs:"attribute vec3 inPosition;\n    attribute vec2 inTexCoord;\n    varying vec2 uv;\n    uniform mat4 u_Model;\n    void main() {\n      gl_Position = u_Model * vec4(inPosition, 1.0);\n      uv = inTexCoord;\n    }\n    ",fs:`precision highp float;
    varying vec2 uv;
    uniform sampler2D u_mask;
    uniform float u_smoothness;
    uniform float u_invert;
    uniform float u_useCutoutTexture;
    uniform float u_cutoutTextureInverseY;
    uniform sampler2D u_cutoutTex;
    uniform sampler2D u_mask2;
    uniform float u_useMask2;
    void main() {
      float maskAlpha = texture2D(u_mask, uv).r;
      if (u_useMask2 > 0.5) {
        maskAlpha += texture2D(u_mask2, uv).r;
      }
      maskAlpha = smoothstep(0.0 + (u_smoothness),1.0,maskAlpha);
      if(u_invert > 0.5) {
        maskAlpha = 1.0 - maskAlpha;
      }
      if (u_useCutoutTexture > 0.5) {
        if (u_cutoutTextureInverseY > 0.5) {
          gl_FragColor = maskAlpha * texture2D(u_cutoutTex, vec2(uv.x, 1.0 - uv.y));
        } else {
          gl_FragColor = maskAlpha * texture2D(u_cutoutTex, uv);
        }
        gl_FragColor.a = maskAlpha;
      } else {
        gl_FragColor = vec4(maskAlpha, maskAlpha, maskAlpha, 1.0);
      }
    }
    `},metal:{vs:`
    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct buffer_t
    {
        float4x4 u_Model;
    };

    struct main0_out
    {
        float2 uv;
        float4 gl_Position [[position]];
    };

    struct main0_in
    {
        float3 inPosition [[attribute(0)]];
        float2 inTexCoord [[attribute(1)]];
    };

    vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
    {
        main0_out out = {};
        out.gl_Position = buffer.u_Model * float4(in.inPosition, 1.0);
        out.uv = in.inTexCoord;
        out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
        return out;
    }
    `,fs:`
    #include <metal_stdlib>
    #include <simd/simd.h>

    using namespace metal;

    struct buffer_t
    {
        float u_useMask2;
        float u_smoothness;
        float u_invert;
        float u_useCutoutTexture;
        float u_cutoutTextureInverseY;
    };

    struct main0_out
    {
        float4 gl_FragColor [[color(0)]];
    };

    struct main0_in
    {
        float2 uv;
    };

    fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_mask [[texture(0)]], texture2d<float> u_mask2 [[texture(1)]], texture2d<float> u_cutoutTex [[texture(2)]], sampler u_maskSmplr [[sampler(0)]], sampler u_mask2Smplr [[sampler(1)]], sampler u_cutoutTexSmplr [[sampler(2)]])
    {
        main0_out out = {};
        float maskAlpha = u_mask.sample(u_maskSmplr, in.uv).x;
        if (buffer.u_useMask2 > 0.5)
        {
            maskAlpha += u_mask2.sample(u_mask2Smplr, in.uv).x;
        }
        maskAlpha = smoothstep(0.0 + buffer.u_smoothness, 1.0, maskAlpha);
        if (buffer.u_invert > 0.5)
        {
            maskAlpha = 1.0 - maskAlpha;
        }
        if (buffer.u_useCutoutTexture > 0.5)
        {
            if (buffer.u_cutoutTextureInverseY > 0.5)
            {
                out.gl_FragColor = maskAlpha * u_cutoutTex.sample(u_cutoutTexSmplr, float2(in.uv.x, 1.0 - in.uv.y));
            }
            else
            {
                out.gl_FragColor = maskAlpha * u_cutoutTex.sample(u_cutoutTexSmplr, in.uv);
            }
            out.gl_FragColor.w = maskAlpha;
        }
        else
        {
            out.gl_FragColor = float4(maskAlpha, maskAlpha, maskAlpha, 1.0);
        }
        return out;
    }
    `}});if(this._screenMaterial=De.createScreenMaterial(i),this._screenMaterial.setTex("u_mask",Ge.getMask(this._segType)),this._screenMaterial.setFloat("u_smoothness",.9*(1-this._smoothness)),this._screenMaterial.setFloat("u_invert",!0===this._invert?1:0),!0===this._useCutoutTexture){const e=tn.engine.assets.loadSync(this._cutoutTexture);null!=e&&(this._useCutoutTexture=!0,this._screenMaterial.setTex("u_cutoutTex",e.resource),this._screenMaterial.setFloat("u_cutoutTextureInverseY",!0===this._cutoutTextureInverseY?1:0))}this._screenMaterial.setFloat("u_useCutoutTexture",!0===this._useCutoutTexture?1:0),this._segType===exports.SegmentationType.Head.toLocaleLowerCase()?(this._screenMaterial.setFloat("u_useMask2",1),this._screenMaterial.setTex("u_mask2",Ge.getMask(this._segType,1))):this._screenMaterial.setFloat("u_useMask2",0)}onUpdate(){const e=tn.engine.customAssets.cmdBufferHelper;e.cmdBufferSetRenderTexture(this._renderTexture),e.cmdBufferDrawMesh(e.screenMesh,new S,this._screenMaterial,0,0,new t.MaterialPropertyBlock)}get type(){return exports.AssetSubType.Segmentation}onDestroy(){}onLateUpdate(){}onStart(){}}class et{constructor(e){var t;const n=e.properties;this._faceIndex=n.faceIndex,this._path=n.path,this._faceMesh=null==(t=tn.engine)?void 0:t.customAssets.getNativeObject(e.uuid);const a=tn.engine.assets.loadSync(this._path);if(null!==a){const e=a.resource.clone();this._faceMesh.assetMgr=e.assetMgr,this._faceMesh.name=e.name,this._faceMesh.boundingBox=e.boundingBox,this._faceMesh.instanceData=e.instanceData,this._faceMesh.instanceDataStride=e.instanceDataStride,this._faceMesh.materialIndex=e.materialIndex,this._faceMesh.morphers=e.morphers,this._faceMesh.skin=e.skin,this._faceMesh.submeshes=e.submeshes,this._faceMesh.vertexAttribs=e.vertexAttribs,this._faceMesh.vertices=e.vertices,this._faceMesh.seqMesh=e.seqMesh,this._faceMesh.originalVertices=e.originalVertices,this._faceMesh.clearAfterUpload=e.clearAfterUpload,this._faceMesh.setVertexCount(e.getVertexCount()),0!==e.getVertexArray(0,0).size()&&this._faceMesh.setVertexArray(e.getVertexArray(0,0),0,0,!0),0!==e.getNormalArray(0,0).size()&&this._faceMesh.setNormalArray(e.getNormalArray(0,0),0,0),0!==e.getTangentArray(0,0).size()&&this._faceMesh.setTangentArray(e.getTangentArray(0,0),0,0),0!==e.getColorArray(0,0).size()&&this._faceMesh.setColorArray(e.getColorArray(0,0),0,0),0!==e.getUvArray(0,0,0).size()&&this._faceMesh.setUvArray(0,e.getUvArray(0,0,0),0,0),0!==e.getUv3DArray(0,0,0).size()&&this._faceMesh.setUv3DArray(0,e.getUv3DArray(0,0,0),0,0),0!==e.getUserDefineArray(0,0,0).size()&&this._faceMesh.setUserDefineArray(0,e.getUserDefineArray(0,0,0),0,0),this.setUpMorpher(this._faceMesh,!1)}else console.error("face mesh asset: mesh not found!")}onDestroy(){}onStart(){}onUpdate(){if(null!==this._faceMesh){const e=Oe.faces,t=e.length;if((0>this._faceIndex||5<this._faceIndex)&&(this._faceIndex=0),t<=this._faceIndex)return;const n=e[this._faceIndex].faceMesh;if(null===n)return;const a=n.vertexes,i=n.normals;null!==a&&null!==i&&0<a.size()&&0<i.size()&&(this._faceMesh.setVertexArray(a),this._faceMesh.setNormalArray(i),this.setUpMorpher(this._faceMesh,!0))}}onLateUpdate(){}setUpMorpher(e,t){if(null!==e){const n=tn.engine.scene.native,a=n.entities;for(let n=0;n<a.size();n++){const i=a.get(n),r=i.getComponent("MorpherComponent");if(null!==r&&r.basemesh.handle===e.handle)if(!t){const t=r.channelWeights.clone(),n=t.getVectorKeys(),a=r.channelAmplifiers.clone(),o=a.getVectorKeys();r.basemesh=null,r.basemesh=e;const s=r.channelWeights,d=r.channelAmplifiers;for(let e=0;e<t.size();e++)s.set(n.get(e),t.get(n.get(e)));for(let e=0;e<a.size();e++)d.set(o.get(e),a.get(o.get(e)))}else r.basemesh=e}}}}const tt=new Map([[exports.AssetSubType.CameraInput.toLowerCase(),we],[exports.AssetSubType.Face.toLowerCase(),He],[exports.AssetSubType.Segmentation.toLowerCase(),$e]]),nt=new Map([[exports.AssetSubType.Face.toLowerCase(),et]]),at=new Map([[exports.AssetType.Texture.toLowerCase(),tt],[exports.AssetType.Mesh.toLowerCase(),nt]]);function it(e){const t=new Uint8Array(e);return String.fromCharCode.apply(null,t)}class rt{constructor(){this._resEntryMap=new Map,this._assets=[],this._nativeObjMap=new t.Map,this._cmdBufferHelper=new Ne}getNativeObject(e){return this._nativeObjMap.get(e)}init(){var e;const t=null==(e=tn.engine)?void 0:e.scene.native;if(null==t)return;const n=t.assetMgr.rootDir+"customAssets.json",a=fs.accessSync(n,0);if(!a)return void console.log("No customAssets.json found");const i=fs.readFileSync(n);if(this._assetsConfig=JSON.parse(it(i)),null!=this._assetsConfig){this._nativeObjMap=t.assetMgr.getAllScriptCustomAssets();for(const e of this._assetsConfig)this._resEntryMap.set(e.uuid,e);const e=this.analyzeAssetsDependency();for(const t of e){const e=this._resEntryMap.get(t),n=this.createCustomAsset(e);n&&this._assets.push(n)}}}get cmdBufferHelper(){return this._cmdBufferHelper}update(e){this._cmdBufferHelper.onPreUpdate();for(const t of this._assets)t.onUpdate(e);this._cmdBufferHelper.onPostUpdate()}start(){for(const e of this._assets)e.onStart()}destroy(){for(const e of this._assets)e.onDestroy()}lateUpdate(e){for(const t of this._assets)t.onLateUpdate(e)}createCustomAsset(e){const t=at.get(e.type.toLowerCase());if(null==t)return console.error(`Custom asset doesn't support asset type: [${e.type}]`),null;const n=t.get(e.subType.toLowerCase());return null==n?(console.error(`[${e.type}] custom asset doesn't support asset subtype: [${e.subtype}]`),null):new n(e)}analyzeAssetsDependency(){let e=[];const t=new Map,n=new Map,a="custom://";let i=0;for(const e of this._assetsConfig)i+=1,n.set(e.uuid,0);for(const e of this._assetsConfig){const i=e.uuid;if(e.properties)for(const r in e.properties){const o=e.properties[r];if("string"==typeof o&&o.startsWith(a)){const e=o.substr(a.length);console.log(`custom assets: [${i}] depends on [${e}]`),n.set(e,n.get(e)+1),t.has(i)||t.set(i,[]),t.get(i).push(e)}}}const r=[];for(const e of n.keys())0===n.get(e)&&r.push(e);for(;0<r.length;){const a=r.shift();if(e.push(a),t.has(a))for(const e of t.get(a))n.set(e,n.get(e)-1),0===n.get(e)&&r.push(e)}if(e.length===i)e.reverse();else{console.error("Found circular dependency in custom assets"),e=[];for(const t of this._assetsConfig)e.push(t.uuid)}return e}}class ot{constructor(e,t){this._inputs=[void 0],this._outputs=[void 0],this._properties=new Map,this._needUpdateTexture=!0,this._name=e,this.deserialize({name:e,class:this.constructor.name,properties:t}),this._init()}getInput(e){return this._inputs[e]}getOutput(e){return this._outputs[e]}set needUpdateTexture(e){this._needUpdateTexture=e}get needUpdateTexture(){return this._needUpdateTexture}get inputSize(){return this._inputs.length}get outputSize(){return this._outputs.length}_init(){console.log(`[JS GPUFilter] Initialize filter ${this.constructor.name} with properties ${JSON.stringify(this.serialize())}`)}setInput(e,t=0){return t>this._inputs.length?void console.warn(`[JS GPUFilter] Index exceed input slot capacity!`):void(this._inputs[t]=e)}addInput(e){this._inputs.push(e)}addOutput(e){this._outputs.push(e)}setOutput(e,t=0){return t>this._outputs.length?void console.warn(`[JS GPUFilter] Index exceed output slot capacity!`):void(this._outputs[t]=e)}get name(){return this._name}get prop(){return this._properties}setProp(e,t){this._properties.set(e,t)}getProp(e){return this._properties.get(e)}deserialize(e){if(this.constructor.name!==e.class)return void console.error(`[JS GPUFilter] Cannot deserialize json: types [${this.constructor.name} vs ${e.class}] mismatch`);this._name=e.name||"";const t=e.properties||{};for(const n in t)this.setProp(n,t[n])}serialize(){const e={};return this._properties.forEach((t,n)=>{e[n]=t}),{name:this._name,class:this.constructor.name,properties:e}}render(){}isReady(){return this.isInputsReady()&&this.isOutputsReady()&&this._inputs[0]!==this._outputs[0]}isInputsReady(){for(let e=0;e<this._inputs.length;++e)if(!this._inputs[e])return!1;return!0}isOutputsReady(){return this._outputs[0]!=null}clear(){for(let e=0;e<this._inputs.length;++e)this._inputs[e]=void 0;for(let e=0;e<this._outputs.length;++e)this._outputs[e]=void 0}getOutRTInfo(e=0,t){var n=Math.floor,a;const i=null==(a=this._inputs[0])?t:a;if(void 0===i)return new Error("Cannot get output render target info because there is no input.");const r=this.getProp("widthScalar")?this.getProp("widthScalar"):1,o=this.getProp("heightScalar")?this.getProp("heightScalar"):1;let s=n(i.width*r),d=n(i.height*o);return this.getProp("width")&&(s=this.getProp("width")),this.getProp("height")&&(d=this.getProp("height")),{width:s,height:d,colorFormat:i.colorFormat,filterMode:i.filterMag}}}class st{constructor(e,t,n,a,r=8){this.occupied=[],this.available=[],this.maxCapacity=8,this.width=0,this.height=0,this.format=i.RGBA8Unorm,this.filterMode=exports.TextureFilterMode.Linear,this.width=e,this.height=t,this.format=n,this.filterMode=a,this.maxCapacity=r}clear(){this.occupied.length=0,this.available.length=0}createTexture(){return De.createRenderTexturePlus(this.width,this.height,this.format,this.filterMode)}balance(){return this.occupied.length+this.available.length}get(){if(0<this.available.length){const e=this.available[this.available.length-1];return this.available.pop(),this.occupied.push(e),e}if(this.available.length+this.occupied.length<this.maxCapacity){const e=this.createTexture();return this.occupied.push(e),e}return new Error(`[JS GPUFilter] texture pool exceed capacity ${this.maxCapacity} limit!`)}return(e){const t=this.occupied.indexOf(e);let n;0<=t&&(n=this.occupied[t],this.occupied[t]=this.occupied[this.occupied.length-1],this.occupied.pop());const a=this.available.indexOf(e);0>a&&n&&this.available.push(n)}returnAll(){for(;0<this.occupied.length;){const e=this.occupied[this.occupied.length-1];this.available.push(e),this.occupied.pop()}}}class dt{constructor(e){this._pool=new Map,this._capacity=e}getKey(e,t,n,a){return`${e}-${t}-${n}-${a}`}get(e,t,n,a){const i=this.getKey(e,t,n,a);return this._pool.has(i)||this._pool.set(i,new st(e,t,n,a,this._capacity)),this._pool.get(i).get()}getUniformPool(e,t,n,a){const i=this.getKey(e,t,n,a);return this._pool.has(i)?this._pool.get(i):void 0}return(e){if(void 0===e)return;const t=e.width,n=e.height,a=e.colorFormat,i=e.filterMin,r=this.getKey(t,n,a,i);this._pool.has(r)&&this._pool.get(r).return(e)}clearAll(){for(const e in this._pool){const t=this._pool.get(e);t.clear()}this._pool.clear()}returnAll(){this._pool.forEach(e=>{e.returnAll()})}totalBalance(){let e=0;return this._pool.forEach((t,n)=>{const a=this._pool.get(n);e+=a.balance()}),e}}class lt extends ot{onUpdate(e,t){this.needUpdateTexture&&this.getOutput(0)&&this.getInput(0)&&(t.blit(this.getInput(0),this.getOutput(0)),this.needUpdateTexture=!1)}}class ct{static getMetal(e,t=void 0){switch(e){case"common.vs":return`
          #include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float2 uv;
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 inPosition [[attribute(0)]];
    float2 inTexCoord [[attribute(1)]];
};

vertex main0_out main0(main0_in in [[stage_in]])
{
    main0_out out = {};
    out.gl_Position = float4(in.inPosition, 1.0);
    out.uv = in.inTexCoord;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}
        `;case"mask.fs":return`
          #include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

/* struct buffer_t */
/* { */
/*     int uMaskFlipY; */
/*     int uFlipY; */
/* }; */

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv;
};

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_inputTex [[texture(0)]], texture2d<float> u_maskTex [[texture(1)]], sampler u_inputTexSmplr [[sampler(0)]], sampler u_maskTexSmplr [[sampler(1)]], 
    constant int& uMaskFlipY [[buffer(0)]],
    constant int& uFlipY [[buffer(1)]]
                        )
{
    main0_out out = {};
    float2 uv1 = in.uv;
    if (uMaskFlipY > 0)
    {
        uv1.y = 1.0 - uv1.y;
    }
    float2 uv2 = in.uv;
    if (uFlipY > 0)
    {
        uv2.y = 1.0 - uv2.y;
    }
    float3 texDest = u_inputTex.sample(u_inputTexSmplr, uv2).xyz;
    float texMask = u_maskTex.sample(u_maskTexSmplr, uv1).x;
    out.gl_FragColor = float4(texDest, clamp(texMask, 0.0, 1.0));
    return out;
}
        `;case"laplacian.fs":{const{hammersleyNumSample:e}=t;return`
          #pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

/* struct buffer_t */
/* { */
/*     float uMaskThreshold; */
/*     float2 uDestTextureSize; */
/*     float uIteration; */
/*     float uLevel; */
/*     spvUnsafeArray<float2, ${0|e}> u_hammersley; */
/*     float2 uBlurScale; */
/* }; */

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv;
};

static inline __attribute__((always_inline))
float2 hash22(thread const float2& p)
{
    float3 p3 = fract(float3(p.xyx) * float3(0.103100001811981201171875, 0.10300000011920928955078125, 0.097300000488758087158203125));
    p3 += float3(dot(p3, p3.yzx + float3(33.3300018310546875)));
    return fract((p3.xx + p3.yz) * p3.zy);
}

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> uDestinationTexture [[texture(0)]], texture2d<float> uPrevLvlPassTexture [[texture(1)]], texture2d<float> uPrevPassTexture [[texture(2)]], sampler uDestinationTextureSmplr [[sampler(0)]], sampler uPrevLvlPassTextureSmplr [[sampler(1)]], sampler uPrevPassTextureSmplr [[sampler(2)]], 
    constant float& uMaskThreshold [[buffer(0)]],
    constant float2& uDestTextureSize [[buffer(1)]],
    constant float& uIteration [[buffer(2)]],
    constant float& uLevel [[buffer(3)]],
    constant spvUnsafeArray<float2, ${0|e}>& u_hammersley [[buffer(4)]],
    constant float2& uBlurScale [[buffer(5)]]
                         
                        )
{
    main0_out out = {};
    float4 outColor = uDestinationTexture.sample(uDestinationTextureSmplr, in.uv);
    if (outColor.w > uMaskThreshold)
    {
        float2 param = in.uv * 1000.0;
        float2 rnd = hash22(param);
        float2 texDestSize = uDestTextureSize;
        float minSide = min(texDestSize.x, texDestSize.y);
        if ((uIteration < 9.9999997473787516355514526367188e-05) && (uLevel < 9.9999997473787516355514526367188e-05))
        {
            float2 ratio = texDestSize / float2(minSide);
            float rangeStep = 0.100000001490116119384765625;
            float range = 0.0199999995529651641845703125;
            float weightSum = 0.0;
            float3 sum = float3(0.0);
            for (int j = 0; j < ${0|e}; j++)
            {
                weightSum = 0.0;
                sum = float3(0.0);
                for (int i = 0; i < ${0|e}; i++)
                {
                    float2 hUv = ratio * (u_hammersley[i]);
                    float2 sUv = in.uv + ((fract(hUv + rnd) - float2(0.5)) * range);
                    bool _158 = sUv.x < 0.0;
                    bool _166;
                    if (!_158)
                    {
                        _166 = sUv.x > 1.0;
                    }
                    else
                    {
                        _166 = _158;
                    }
                    bool _173;
                    if (!_166)
                    {
                        _173 = sUv.y < 0.0;
                    }
                    else
                    {
                        _173 = _166;
                    }
                    bool _180;
                    if (!_173)
                    {
                        _180 = sUv.y > 1.0;
                    }
                    else
                    {
                        _180 = _173;
                    }
                    if (_180)
                    {
                        continue;
                    }
                    float4 rndTex = uDestinationTexture.sample(uDestinationTextureSmplr, sUv);
                    if (rndTex.w < uMaskThreshold)
                    {
                        sum += rndTex.xyz;
                        weightSum += 1.0;
                    }
                }
                if (weightSum > 0.5)
                {
                    break;
                }
                range += rangeStep;
            }
            outColor = float4(sum / float3(weightSum), 1.0);
        }
        else
        {
            if ((uIteration < 9.9999997473787516355514526367188e-05) && (uLevel > 9.9999997473787516355514526367188e-05))
            {
                outColor = uPrevLvlPassTexture.sample(uPrevLvlPassTextureSmplr, in.uv);
            }
            else
            {
                float2 ratioRcp = float2(minSide) / texDestSize;
                float3 ret = float3(0.0);
                float size = 4.0;
                float _244 = -size;
                for (float i_1 = _244; i_1 <= size; i_1 += 1.0)
                {
                    if (abs(i_1) < 0.5)
                    {
                        continue;
                    }
                    float4 smpl = uPrevPassTexture.sample(uPrevPassTextureSmplr, (in.uv + ((uBlurScale * i_1) * ratioRcp)));
                    float weight = ((size + 1.0) - abs(i_1)) / 20.0;
                    ret += (smpl.xyz * weight);
                }
                outColor = float4(ret, 1.0);
                float3 _304 = outColor.xyz + float3((((rnd.x + rnd.y) - 1.0) / 255.0) / 20.0);
                outColor = float4(_304.x, _304.y, _304.z, outColor.w);
            }
        }
    }
    out.gl_FragColor = outColor;
    return out;
}
        `}case"resolve.fs":return`
          #include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

/* struct buffer_t */
/* { */
/*     int uMaskFlipY; */
/*     float uMaskThreshold; */
/* }; */

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv;
};

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> uTopLevelTexture [[texture(0)]], texture2d<float> u_maskTex [[texture(1)]], sampler uTopLevelTextureSmplr [[sampler(0)]], sampler u_maskTexSmplr [[sampler(1)]], 
    constant int& uMaskFlipY [[buffer(0)]],
    constant float& uMaskThreshold [[buffer(1)]]
                        )
{
    main0_out out = {};
    float2 uv1 = in.uv;
    if (uMaskFlipY > 0)
    {
        uv1.y = 1.0 - uv1.y;
    }
    float4 tex = uTopLevelTexture.sample(uTopLevelTextureSmplr, in.uv);
    float mask = u_maskTex.sample(u_maskTexSmplr, uv1).x;
    if (mask < uMaskThreshold)
    {
        discard_fragment();
    }
    float alpha = (tex.w - uMaskThreshold) / (1.0 - uMaskThreshold);
    tex.w = clamp(alpha, 0.0, 1.0);
    out.gl_FragColor = tex;
    return out;
}
        `;case"grow.fs":{let e="";for(let t=-1;1>=t;++t)for(let n=-1;1>=n;++n)e+=`
              if (maskTexture.sample(maskTextureSmplr, (in.uv + (u_texelSize * float2(${0|t}, ${0|n}))))[u_channelIndex] > u_threshold)
    {
        out.gl_FragColor = float4(1.0);
        return out;
    }
                        `;return`
          #include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

/* struct buffer_t */
/* { */
/*     float2 u_texelSize; */
/*     int u_channelIndex; */
/*     float u_threshold; */
/* }; */

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv;
};

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> maskTexture [[texture(0)]], sampler maskTextureSmplr [[sampler(0)]], 
                         constant float2& u_texelSize [[buffer(0)]],
                         constant int& u_channelIndex [[buffer(1)]],
                         constant float& u_threshold [[buffer(2)]]
                        )
{
    main0_out out = {};
    ${e}
    out.gl_FragColor = float4(0.0);
    return out;
}
                `}case"operator.fs":{const{snippetMetal:e,operandNum:n,declMetal:a}=t;let r="",o="",s="";for(let e=0;e<n;++e)r+=`, texture2d<float> u_inputTex${e} [[texture(${e})]]`,o+=`, sampler u_inputTex${e}Smplr [[sampler(${e})]]`,s+=`
              float4 input${e} = u_inputTex${e}.sample(u_inputTex${e}Smplr, in.uv);
            `;return`
#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv;
};

${a}

fragment main0_out main0(main0_in in [[stage_in]]${r}${o})
{
    main0_out out = {};
    float4 result = float4(1.0, 0.0, 1.0, 1.0);
    ${s};
    ${e};
    out.gl_FragColor = result;
    return out;
}
        `.replace(/;[\s\r\n]*;/gm,";")}case"conv.fs":{const{core:e}=t,n=5;let a=``;for(const t of e)a+=`
              result += (u_inputTex.sample(u_inputTexSmplr, (in.uv + float2(${t[0].toFixed(n)} * invWidth, ${t[1].toFixed(n)} * invHeight))) * ${t[2].toFixed(n)});
              `;return`
          #include <metal_stdlib>
          #include <simd/simd.h>
          
          using namespace metal;
          
          /* struct buffer_t */
          /* { */
          /*     float invWidth; */
          /*     float invHeight; */
          /* }; */
          
          struct main0_out
          {
              float4 gl_FragColor [[color(0)]];
          };
          
          struct main0_in
          {
              float2 uv;
          };
          
          fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]], constant float& invWidth [[buffer(0)]], constant float& invHeight [[buffer(1)]])
          {
              main0_out out = {};
              float4 result = float4(0.0);
              ${a}
              out.gl_FragColor = result;
              return out;
          }
          `}case"blur.fs":return``;default:return console.log(`Cannot find shader [${e}]!`),"";}}static get(e,t=void 0){switch(e){case"common.vs":return`

attribute vec3 inPosition;
attribute vec2 inTexCoord;
varying vec2 uv;
void main() {
    gl_Position = vec4(inPosition, 1.0);
    uv = inTexCoord;
}
        `;case"mask.fs":return`
precision highp float;
varying vec2 uv;
uniform sampler2D u_maskTex;
uniform sampler2D u_inputTex;
uniform int uFlipY;
uniform int uMaskFlipY;
uniform float uMaskThreshold;

void main() {
    vec2 uv1 = uv;
    if (uMaskFlipY > 0) {
        uv1.y = 1.0 - uv1.y;
    }

    vec2 uv2 = uv;
    if (uFlipY > 0) {
        uv2.y = 1.0 - uv2.y;
    }
    
    vec3 texDest = texture2D(u_inputTex, uv2).rgb;
    float texMask = texture2D(u_maskTex, uv1).r;
    gl_FragColor = vec4(
        texDest,
        clamp(texMask, 0.0, 1.0)
    );
}
        `;case"laplacian.fs":{const{hammersleyNumSample:e}=t;return`
    precision highp float;
    uniform sampler2D uDestinationTexture;
    uniform sampler2D uPrevPassTexture;
    uniform sampler2D uPrevLvlPassTexture;
    uniform float uIteration;
    uniform float uLevel;
    uniform vec2 uBlurScale;
    uniform float uMaskThreshold;
    uniform vec2 uDestTextureSize;
    uniform vec2 u_hammersley[${0|e}];

    varying vec2 uv;

    const float kTriangleKernelSum = 20.0;
    const float kTriangleKernelSize = 4.0;
    const float EPSILON = 0.0001;

    // https://www.shadertoy.com/view/4djSRW
    // TODO: SLOW!
    vec2 hash22(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
        p3 += dot(p3, p3.yzx+33.33);
        return fract((p3.xx+p3.yz)*p3.zy);
    }


    void main() {
        vec4 outColor = texture2D(uDestinationTexture, uv);

        if (outColor.a > uMaskThreshold) {

            // Mutiply by 1000.0 for better hash distribution.
            vec2 rnd = hash22(1000.0*uv);
            vec2 texDestSize = uDestTextureSize;
            float minSide = min(texDestSize.x, texDestSize.y);

            if (uIteration < EPSILON && uLevel < EPSILON) {
                vec2 ratio = texDestSize / vec2(minSide);
                float rangeStep = 0.1;
                float range = 0.02;
                float weightSum = 0.0;
                vec3 sum = vec3(0.0);

                for (int j = 0; j < ${0|e}; ++j) {
                    weightSum = 0.0;
                    sum = vec3(0.0);

                    for (int i = 0; i < ${0|e}; ++i) {
                        // Multiply by ratio to compensate for the difference
                        // between pyramid and dest resolution difference.
                        vec2 hUv = ratio * u_hammersley[i];
                        vec2 sUv = uv + range * (fract(hUv + rnd) - 0.5);
                        if (sUv.x < 0.0 || sUv.x > 1.0
                            || sUv.y < 0.0 || sUv.y > 1.0) {
                            continue;
                        }
                        vec4 rndTex = texture2D(uDestinationTexture, sUv);
                        if (rndTex.a < uMaskThreshold) {
                            sum += rndTex.rgb;
                            weightSum += 1.0;
                        }
                    }

                    if (weightSum > 0.5) {
                        break;
                    }

                    range += rangeStep;
                }

                outColor = vec4(sum/weightSum, 1.0);
            }
            else if (uIteration < EPSILON && uLevel > EPSILON) {
                outColor = texture2D(uPrevLvlPassTexture, uv);
            }
            else {
                vec2 ratioRcp = vec2(minSide) / texDestSize;
                vec3 ret = vec3(0.0);
                float size = kTriangleKernelSize;
                for (float i = -size; i <= size; ++i) {
                    if (abs(i) < 0.5)
                        continue;

                    // Mutiliply sample uv by ratioRcp to compensate for the difference
                    // between pyramid and dest resolution difference.
                    vec4 smpl = texture2D(uPrevPassTexture, uv + i * uBlurScale * ratioRcp);
                    float weight = (size + 1.0 - abs(i)) / kTriangleKernelSum;
                    ret += weight * smpl.rgb;
                }

                outColor = vec4(ret, 1.0);
                // Add random value to compensate for banding due to low texture precission
                outColor.rgb += (rnd.r + rnd.g - 1.0) / 255.0 / kTriangleKernelSum;
            }
        }
        gl_FragColor = outColor;
    }    
        `}case"resolve.fs":return`
    uniform sampler2D uTopLevelTexture;
    uniform sampler2D u_maskTex;
    uniform float uMaskThreshold;

    uniform int uFlipY;
    uniform int uMaskFlipY;

    varying vec2 uv;

    void main()
    {
        vec2 uv1 = uv;
        if (uMaskFlipY > 0) {
            uv1.y = 1.0 - uv1.y;
        }

        vec4 tex = texture2D(uTopLevelTexture, uv);
        float mask = texture2D(u_maskTex, uv1).r;
        if(mask < uMaskThreshold) {
            discard;
        }
        float alpha = (tex.a - uMaskThreshold) / (1.0 - uMaskThreshold);
        tex.a = clamp(alpha, 0.0, 1.0);
        gl_FragColor = tex;
    }
        `;case"grow.fs":{let e="";for(let t=-1;1>=t;++t)for(let n=-1;1>=n;++n)e+=`

                        if(texture2D(maskTexture, uv + u_texelSize*vec2(${0|t}, ${0|n}) )[u_channelIndex] > u_threshold) {
                            gl_FragColor = vec4(1.0);
                            return;
                        }

                        `;return`
precision lowp float;
precision lowp sampler2D;
uniform sampler2D maskTexture;
uniform vec2 u_texelSize;
uniform float u_threshold;
uniform int u_channelIndex;
varying vec2 uv;
void main()
{
    /* if (u_flipY > 0) { */
    /*     uv.y = 1.0 - uv.y; */
    /* } */
    ${e}
    gl_FragColor = vec4(0.0);
}
                `}case"operator.fs":{const{snippet:e,operandNum:n,decl:a}=t;let r="",o="";for(let e=0;e<n;++e)r+=`
            uniform sampler2D u_inputTex${e};
            `,o+=`
                vec4 input${e} = texture2D(u_inputTex${e}, uv);
            `;return`
precision lowp float;
precision lowp sampler2D;
${r};
varying vec2 uv;

${a}

void main()
{
    vec4 result = vec4(1.0, 0.0, 1.0, 1.0); // purple screen
    ${o};
    ${e};
    gl_FragColor = result;
}
        `.replace(/;[\s\r\n]*;/gm,";")}case"conv.fs":{const{core:e}=t,n=5;let a=``;for(const t of e)a+=`
              result += ${t[2].toFixed(n)}*texture2D(u_inputTex, uv + vec2((${t[0].toFixed(n)})*invWidth, (${t[1].toFixed(n)})*invHeight));
              `;return`
precision lowp float;
precision lowp sampler2D;
varying vec2 uv;
uniform sampler2D u_inputTex;
uniform float invWidth;
uniform float invHeight;
void main()
{
    vec4 result = vec4(0.0);
    ${a};
    gl_FragColor = result;
}
          `}case"blur.fs":return``;default:return console.log(`Cannot find shader [${e}]!`),"";}}}class pt extends ot{constructor(e,t){super(e,t);const n=this.getProp("operandNum")?this.getProp("operandNum"):1,a=this.getProp("snippet")||"vec4 result = input0",i=!!this.getProp("blend"),r=this.getProp("decl")?this.getProp("decl"):"";for(;this.inputSize<n;)this.addInput(void 0);const o=this.getProp("vs")?this.getProp("vs"):ct.get("common.vs"),s=ct.get("operator.fs",{operandNum:n,snippet:a,decl:r}),d=ct.getMetal("common.vs"),l=ct.getMetal("operator.fs",{operandNum:n,snippetMetal:this.getProp("snippetMetal")?this.getProp("snippetMetal"):this.toMetal(a),declMetal:this.getProp("declMetal")?this.getProp("declMetal"):this.toMetal(r)});this._opMat=De.createEmptyMaterial(),De.addPassToMaterial(this._opMat,{gles2:{vs:o,fs:s},metal:{vs:d,fs:l}},!1,i)}get material(){return this._opMat}toMetal(e){return e=e.replace(/(vec)([1234]+)/gm,"float$2"),e=e.replace(/(mat)([1234])/gm,"float$2x$2"),e=e.replace(/(texture2D)\((.*),(.*)\)/gm,"$2.sample($2Smplr, $3)"),e}onUpdate(e,t){if(this.needUpdateTexture)if(this.isInputsReady()&&this.isOutputsReady()){for(let e=0;e<this.inputSize;++e)this._opMat.setTex(`u_inputTex${e}`,this.getInput(e));t.blitWithMaterial(this.getInput(0),this.getOutput(0),this._opMat,0),this.needUpdateTexture=!1}else console.warn(`[JS GPUFilter] OperatorFilter[${this.name}] cannot get inputs or output ready, check if your link is correct!`)}static predefinedOperators(e,t){return`OP_ADD`===t?new pt(e,{operandNum:2,snippet:`
                result = input0 + input1;
                `}):`OP_BLEND`===t?new pt(e,{operandNum:2,snippet:`
                // base input0
                result.rgb = mix(input0.rgb, input1.rgb, input0.a);
                result.a = 1.0;
                `}):`OP_MUL`===t?new pt(e,{operandNum:2,snippet:`
                // base input0
                result.rgb = input0.rgb*input1.rgb;
                result.a = 1.0;
                `}):new pt(e,{operandNum:1,snippet:`
                // base input0
                result.rgb = input0;
                result.a = 1.0;
                `})}}class mt extends ot{constructor(e,t){super(e,t);const n=!!this.getProp("blend");this.getProp("iterations")===void 0&&this.setProp("iterations",2);const a=this.getProp("vs")?this.getProp("vs"):ct.get("common.vs"),i=this.getProp("fs"),r=this.getProp("vsMetal")?this.getProp("vsMetal"):ct.getMetal("common.vs"),o=this.getProp("fsMetal");this._pingpongMat=De.createEmptyMaterial(),De.addPassToMaterial(this._pingpongMat,{gles2:{vs:a,fs:i},metal:{vs:r,fs:o}},!1,n)}handleMaterialProp(){}onUpdate(e,n,a){if(this.needUpdateTexture)if(this.isReady()){const e=this.getInput(0).width,r=this.getInput(0).height;(0===e||0===r)&&console.error(`[JS GPUFilter] Pingpong Filter [${this.name}] width/height not correct!`);const o=i.RGBA8Unorm,s=a.get(e,r,o,exports.TextureFilterMode.Linear),d=this.getProp("iterations");let l=this.getInput(0),c=this.getOutput(0);for(let e=0;e<d;++e){const a=new t.MaterialPropertyBlock;if(a.setTexture("u_inputTex",l),a.setFloat("invWidth",1/l.width),a.setFloat("invHeight",1/l.height),this.handleMaterialProp(a),n.blitWithMaterialAndProperties(l,c,this._pingpongMat,0,a),0==e)l=this.getOutput(0),c=s;else{const e=l;l=c,c=e}}l!==this.getOutput(0)&&n.blit(l,this.getOutput(0)),a.return(s),this.needUpdateTexture=!1}else console.warn(`[JS GPUFilter] Pingpong Filter [${this.name}] cannot get inputs or output ready, check if your link is correct!`)}}class ut extends mt{constructor(e,t){const{core:n,iterations:a,blend:i}=t,r=ct.get("conv.fs",{core:n||[[0,0,1]]}),o=ct.getMetal("conv.fs",{core:n||[[0,0,1]]});super(e,{iterations:a,fs:r,fsMetal:o,blend:i})}}function gt(){return gt=Object.assign||function(e){for(var t=1,n;t<arguments.length;t++)for(var a in n=arguments[t],n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a]);return e},gt.apply(this,arguments)}const ft=new Uint32Array(1);function ht(e){return ft[0]=e,ft[0]=(ft[0]<<16|ft[0]>>16)>>>0,ft[0]=(1431655765&ft[0])<<1|(2863311530&ft[0])>>>1>>>0,ft[0]=(858993459&ft[0])<<2|(3435973836&ft[0])>>>2>>>0,ft[0]=(252645135&ft[0])<<4|(4042322160&ft[0])>>>4>>>0,ft[0]=(16711935&ft[0])<<8|(4278255360&ft[0])>>>8>>>0,23283064365386963e-26*ft[0]}function vt(e,a){return new t.Vector2f(e/a,ht(e))}class yt extends ot{constructor(e,n){super(e,gt({},{quality:"low",blendEnable:!0,maskFlip:!0,inputFlip:!0,maskThreshold:.5},n)),this._pingpongPyramids=new t.Vector,this.addInput(void 0);const{numOfSamples:a,pyramidIterations:r,pyramidTopSize:o}=yt.PREDEFINED[this.getProp("quality")],s=ct.get("common.vs"),d=ct.getMetal("common.vs"),l=ct.get("mask.fs"),c=ct.getMetal("mask.fs"),p=a,m=ct.get("laplacian.fs",{hammersleyNumSample:p}),u=ct.getMetal("laplacian.fs",{hammersleyNumSample:p}),g=ct.get("resolve.fs"),f=ct.getMetal("resolve.fs"),h=i.RGBA8Unorm;this._inpaintMat=De.createEmptyMaterial(),De.addPassToMaterial(this._inpaintMat,{gles2:{vs:s,fs:l},metal:{vs:d,fs:c}},!1),De.addPassToMaterial(this._inpaintMat,{gles2:{vs:s,fs:m},metal:{vs:d,fs:u}},!1),De.addPassToMaterial(this._inpaintMat,{gles2:{vs:s,fs:g},metal:{vs:d,fs:f}},!1,this.getProp("blendEnable")),this._hammersleySamples=new t.Vec2Vector,this._pingpongPyramids.pushBack(this.buildPyramid(o,r.length,h,exports.TextureFilterMode.Nearest)),this._pingpongPyramids.pushBack(this.buildPyramid(o,r.length,h,exports.TextureFilterMode.Nearest));for(let t=0;t<p;++t)this._hammersleySamples.pushBack(vt(t,p))}buildPyramid(e,n,a,r){const o=new t.Vector;for(let t=0;t<n;++t){const n=e<<t;o.pushBack(De.createRenderTexturePlus(n,n,a,r))}return o}onUpdate(e,t){this.needUpdateTexture&&(this.isInputsReady()&&this.isOutputsReady()?(this.buildCmd(t),this.needUpdateTexture=!1):console.warn(`[JS GPUFilter] OperatorFilter[${this.name}] cannot get inputs or output ready, check if your link is correct!`))}buildCmd(e){const n=this.getInput(0),a=this.getInput(1),r=this.getOutput(0);if(this._inpaintMat.setTex("u_inputTex",n),this._inpaintMat.setTex("u_maskTex",a),this._inpaintMat.setInt("uMaskFlipY",this.getProp("maskFlip")?1:0),this._inpaintMat.setInt("uFlipY",this.getProp("inputFlip")?1:0),this._inpaintMat.setFloat("uMaskThreshold",this.getProp("maskThreshold")),e.blitWithMaterial(n,r,this._inpaintMat,0),this._inpaintMat.setTex("uDestinationTexture",r),this._inpaintMat.setVec2("uDestTextureSize",new t.Vector2f(r.width,r.height)),!this._pingpongPyramids.empty()){const{pyramidIterations:n}=yt.PREDEFINED[this.getProp("quality")],a=n.length;let o=this._pingpongPyramids.get(0),s=this._pingpongPyramids.get(1),d=r;for(let c=0;c<a;++c){const a=0==c?r:o.get(c-1);for(let d=0;d<n[c];++d){const n=o.get(c),i=s.get(c),l=new t.MaterialPropertyBlock;l.setVec2Vector("u_hammersley",this._hammersleySamples),l.setTexture("uPrevPassTexture",n),l.setTexture("uPrevLvlPassTexture",a),l.setFloat("uIteration",d),l.setFloat("uLevel",c);const p=0==d%2?1/n.width:0,m=1==d%2?1/n.height:0,u=new t.Vec2Vector;u.pushBack(new t.Vector2f(p,m)),l.setVec2Vector("uBlurScale",u),e.blitWithMaterialAndProperties(r,i,this._inpaintMat,1,l);const g=s;s=o,o=g}const i=o.get(c);d=i}this._inpaintMat.setTex("uTopLevelTexture",d),e.blitWithMaterial(d,r,this._inpaintMat,2)}}}yt.PREDEFINED={low:{numOfSamples:16,pyramidIterations:[5,5,3],pyramidTopSize:32},medium:{numOfSamples:32,pyramidIterations:[5,11,5,3],pyramidTopSize:64},high:{numOfSamples:64,pyramidIterations:[5,11,11,5,5],pyramidTopSize:64}};class _t extends ot{constructor(e,t){super(e,t),this._quadMat=this.getProp("material")?this.getProp("material"):De.createEmptyMaterial(),this._updater=this.getProp("updater")?this.getProp("updater"):()=>{}}onUpdate(e,t){if(this.needUpdateTexture)if(this.isReady()){this._updater(this._quadMat);const e=this.getInput(0),n=this.getOutput(0);t.blitWithMaterial(e,n,this._quadMat,0),this.needUpdateTexture=!1}else console.warn(`[JS GPUFilter] Material Filter [${this.name}] cannot get inputs or output ready, check if your link is correct!`)}getOutRTInfo(e=0,t){var n=Math.floor;const a=super.getOutRTInfo(e,t),i=this.getProp("widthScalar")?this.getProp("widthScalar"):1,r=this.getProp("heightScalar")?this.getProp("heightScalar"):1;return a.width=n(a.width*i),a.height=n(a.height*r),a}}class Tt extends ot{constructor(e,t){super(e,gt({},{threshold:.5,channel:"red",growAmount:5},t));const n=ct.get("common.vs"),a=ct.get("grow.fs"),i=ct.getMetal("common.vs"),r=ct.getMetal("grow.fs");this._growMat=De.createEmptyMaterial(),De.addPassToMaterial(this._growMat,{gles2:{vs:n,fs:a},metal:{vs:i,fs:r}},!1)}buildCmd(e,n){const a=this.getInput(0),i=this.getOutput(0),r=this.getProp("channel");let o=this.getProp("growAmount");o=Math.min(Tt.MAX_GROW_ITERATION,o);const s=this.getProp("threshold"),d=1/a.width,l=1/a.height,c=Tt.CHANNEL_MAP.get(r)||0;this._growMat.setInt("u_channelIndex",c),this._growMat.setVec2("u_texelSize",new t.Vector2f(d,l)),this._growMat.setFloat("u_threshold",s),e.blit(a,i);let p=i;const m=n.get(a.width,a.height,i.colorFormat,i.filterMag);let u=m,g=p;for(let a=0;a<o;++a){const n=new t.MaterialPropertyBlock;n.setTexture("maskTexture",p),e.blitWithMaterialAndProperties(p,u,this._growMat,0,n);const a=u;u=p,p=a,g=p}n.return(m),g!==a&&e.blit(g,i)}onUpdate(e,t,n){this.needUpdateTexture&&(this.isInputsReady()&&this.isOutputsReady()?(this.buildCmd(t,n),this.needUpdateTexture=!1):console.warn(`[JS GPUFilter] OperatorFilter[${this.name}] cannot get inputs or output ready, check if your link is correct!`))}}Tt.MAX_GROW_ITERATION=32,Tt.CHANNEL_MAP=new Map([["red",0],["green",1],["blue",2],["alpha",3]]);const St="internal_blit",It="BlitFilter",Ct="OperatorFilter",Mt="PingpongFilter",xt="MaterialFilter",Ft="InpaintFilter",At="GrowFilter",Pt="ConvFilter";class Rt{static makeFilter(e){const t=e.class,n=e.name;switch(t){case It:return new lt(n,e.properties);case Ct:return new pt(n,e.properties);case Mt:return new mt(n,e.properties);case Pt:return new ut(n,e.properties);case xt:return new _t(n,e.properties);case Ft:return new yt(n,e.properties);case At:return new Tt(n,e.properties);default:const a=pt.predefinedOperators(n,t);return a;}}}var kt=t.CommandBuffer,Lt=t.Texture;class Et{constructor(e,t){if(this.from=void 0,this.fromIndex=0,this.to=void 0,this.toIndex=0,this._filterGraph=t,this.deserialize(e),void 0===this.to&&void 0===this.from)throw new Error(`[JS GPUFilter] Invalid filter node linking`)}unlink(){this.from&&this.from.setOutput(void 0,this.fromIndex),this.to&&this.to.setInput(void 0,this.toIndex)}serialize(){return{from:this.from?this.from.name:void 0,fromIndex:this.fromIndex,to:this.to?this.to.name:void 0,toIndex:this.toIndex}}getKey(){return JSON.stringify(this.serialize())}static getKeyFrom(e,t,n,a){return JSON.stringify({from:e,fromIndex:t,to:n,toIndex:a})}deserialize(e){this.from=this._filterGraph.getFilter(e.from)||void 0,this.to=this._filterGraph.getFilter(e.to)||void 0,this.fromIndex=e.fromIndex,this.toIndex=e.toIndex}}class bt{constructor(e,t=void 0){this.filter=e,this.hook=t}}class Bt{constructor(){this.camera=void 0,this.cameraRenderEvent=exports.CameraRenderEvent.AfterRender,this.cameraCallback=()=>{}}clear(){this.camera=void 0,this.cameraRenderEvent=exports.CameraRenderEvent.AfterRender,this.cameraCallback=()=>{}}isBound(){return this.camera!==void 0}}const Dt=32;class Nt{constructor(){this._inputs=[void 0],this._outputs=[void 0],this._orderedFilters=[],this._filters=new Map,this._links=new Map,this._sorted=!1,this._cmdBufferQueue=[],this._currentCmdBufferIndex=0,this._texturePool=new dt(Dt),this._linkTexturePool=new dt(Dt),this._cameraInfo=new Bt,this._debug=!1,this._running=!0}init(){}clear(){this.clearTexture(),this._orderedFilters.length=0,this._links.clear(),this._filters.clear(),this.commandBuffer.clearAll(),this._texturePool.clearAll(),this._linkTexturePool.clearAll()}get inputSize(){return this._inputs.length}get outputSize(){return this._outputs.length}getInput(e){return this._inputs[e]}getOutput(e){return this._outputs[e]}setInput(e,t){this._inputs[t]=e}setOutput(e,t){this._outputs[t]=e}clearTexture(){this._inputs.length=0,this._outputs.length=0}deserialize(e,t){this.clear();for(const a of e.nodes){const e=t(a);this._orderedFilters.push(e),this.addFilter(a.name,e,!1)}for(const n of e.links){const e=new Et(n,this);this._links.set(e.getKey(),e)}}serialize(){const e=[];this._links.forEach(t=>{e.push(t.serialize())});const t=[];for(const e of this._orderedFilters)t.push(e.serialize());return{links:e,nodes:t}}render(){if(!this._running)return;let e=0;for(const t in this._orderedFilters){const n=this._orderedFilters[t];if(n.render(),this._debug){const a=this._filters.get(n.name).hook;this._commitCommandBuffer(e++),void 0!==a&&a(t,n)}}this._commitCommandBuffer(e)}_commitCommandBuffer(e){tn.engine&&(e<this._cmdBufferQueue.length?tn.engine.scene.native.commitCommandBuffer(this._cmdBufferQueue[e]):console.warn(`[JS GPUFilter] command buffer index out of boundary! Render failed!`))}set debug(e){this._debug=e}get debug(){return this._debug}get commandBuffer(){return 0===this._cmdBufferQueue.length&&this.addCmdBuffer(),this._cmdBufferQueue[this._currentCmdBufferIndex]}addCmdBuffer(){this._cmdBufferQueue.push(new kt),this._currentCmdBufferIndex=this._cmdBufferQueue.length-1}bind(e,n,a=[],i=void 0,r=!1){this._cameraInfo.isBound()&&this.unbind(),this._cameraInfo.camera=e,this._cameraInfo.cameraRenderEvent=n,this._cameraInfo.cameraCallback=()=>{this.render()},t.AmazingManager.addListener(this._cameraInfo.camera.native,this._cameraInfo.cameraRenderEvent,this._cameraInfo.cameraCallback,void 0),this._inputs[0]=i instanceof Lt?i:e.renderTexture,this._outputs[0]=e.renderTexture;for(const t of a)this._inputs.push(t);if(!r){const e=Rt.makeFilter({class:It,name:St});e?(this.add(e),console.info("[JS Filter] internal_blit filter was created to avoid read/write the same render target. Please use internal_blit.inputs[0] as the systems inputs[0]!!!")):console.warn("[JS Filter] Failed to create internal_blit filter as requested in the options.")}}onEnable(){this._running=!0}onDisable(){this._running=!1}unbind(e=!0){var n;t.AmazingManager.removeListener(null==(n=this._cameraInfo.camera)?void 0:n.native,this._cameraInfo.cameraRenderEvent,this._cameraInfo.cameraCallback,void 0),this._cameraInfo.clear(),e&&this.clear()}_autolink(e,t,n){var a=Math.min;const r=e?e.outputSize:this._inputs.length,o=n?n.inputSize:this._outputs.length;for(let o=0;o<a(r,t.inputSize);++o)this.link(e?e.name:void 0,o,t.name,o);for(let r=0;r<a(o,t.inputSize);++r)this.link(t.name,r,n?n.name:void 0,r)}addFilter(e,t,n=!0){if(this.removeFilter(e),this._filters.set(e,new bt(t)),this._sorted=!1,n)if(0>=this._orderedFilters.length)this._autolink(void 0,t,void 0);else{const e=this._orderedFilters[this._orderedFilters.length-1];for(let t=0;t<e.outputSize;++t){const n=Et.getKeyFrom(e.name,t,void 0,t);e.setOutput(void 0,t),this._links.delete(n)}this._autolink(e,t,void 0)}}add(e,t=!0){e instanceof ot?this.addFilter(e.name,e,t):this.addFilter(e.name,Rt.makeFilter(e),t)}getFilter(e){var t;return null==(t=this._filters.get(e))?void 0:t.filter}removeFilter(e){const t=this.getFilter(e);if(t){for(const e of this._links.keys()){const n=this._links.get(e);if(n.from===t||n.to===t){if(this._links.delete(e),void 0===n.from||void 0===n.to)continue;const a=n.from===t?n.toIndex:n.fromIndex;n.from===t?n.to.setInput(void 0,a):n.from.setOutput(void 0,a)}}this._filters.delete(t.name),this.topsort(),this.optimizeRT()}}link(e,t,n,a){const i=new Et({from:e,to:n,fromIndex:t,toIndex:a},this);this._links.has(i.getKey())||this._links.set(i.getKey(),i),this.graphChanged()}graphChanged(){this.topsort(),this.optimizeRT()}unlink(e,t,n,a){const i=new Et({from:e,to:n,fromIndex:t,toIndex:a},this);this._links.has(i.getKey())&&(this._links.delete(i.getKey()),i.unlink(),this.graphChanged())}topsort(){const e={};this._links.forEach(t=>{t.from&&t.to&&(!e[t.from.name]&&(e[t.from.name]=new Set),e[t.from.name].add(t.to.name))}),this._orderedFilters.length=0;const t=new Map;this._filters.forEach((n,a)=>{if(!this._topsort(a,e,t,this._orderedFilters))throw new Error(`[JS GPUFilter] Cannot sort filter, and system will not sort it again but give up :(!`)}),this._orderedFilters.reverse(),this._sorted=!0}optimizeRT(){if(!this._sorted)return;this._linkTexturePool.returnAll();const e={},t={};this._links.forEach(t=>{t.from!==void 0&&(!e.hasOwnProperty(t.from.name)&&(e[t.from.name]={in:[],out:[]}),e[t.from.name].out.push(t)),t.to!==void 0&&(!e.hasOwnProperty(t.to.name)&&(e[t.to.name]={in:[],out:[]}),e[t.to.name].in.push(t))});const n=e=>`${void 0===e.from?void 0:e.from.name}.${e.fromIndex}`;for(const a in this._orderedFilters){const i=this._orderedFilters[a],r=e[i.name]?e[i.name].in:[];for(const e of r)if(e.from!==void 0){const i=n(e);t.hasOwnProperty(i)||(t[i]=+a),t[i]=Math.max(t[i],+a)}i.clear()}for(const a in this._orderedFilters){const i=this._orderedFilters[a],r=e[i.name]?e[i.name].out:[];for(const e of r)this.populateTextureSlots(e);const o=e[i.name]?e[i.name].in:[];for(const e of o)if(e.from!==void 0){const i=n(e);t[i]<=+a&&this._linkTexturePool.return(e.from.getOutput(e.fromIndex))}else this.populateTextureSlots(e)}}populateTextureSlots(e){const t=e.fromIndex,n=e.toIndex;let a,i;a=e.from?e.from.getOutput(t):this.getInput(t),i=e.to?e.to.getInput(n):this.getOutput(n);let r;if(void 0===a&&void 0===i){if(void 0===e.from)return new Error("Invalid from-filter-node in filter link.");const n=e.from.getOutRTInfo(t,this._inputs[0]);if(r=this._linkTexturePool.get(n.width,n.height,n.colorFormat,n.filterMode),r instanceof Error)return r}if(void 0===a){var o;const n=null==(o=i)?r:o;e.from?e.from.setOutput(n,t):this.setInput(n,t)}if(void 0===i){var s;const t=null==(s=a)?r:s;e.to?e.to.setInput(t,n):this.setOutput(t,n)}e.to&&(e.to.needUpdateTexture=!0),e.from&&(e.from.needUpdateTexture=!0)}_topsort(e,t,n,a){if(n.has(e)&&1===n.get(e))return!0;if(n.has(e)&&0===n.get(e))return!1;if(n.set(e,0),t[e])for(const i of t[e])if(!this._topsort(i,t,n,a))return!1;return a.push(this._filters.get(e).filter),n.set(e,1),!0}setHook(e,t){this._filters.get(e).hook=t}onUpdate(e){if(!this._running)return;let t=!1;this._sorted||(console.warn(`[JS GPUFilter] Och, have to sort filter because you forgot to do that!`),this.topsort(),this.optimizeRT(),t=!0);for(const n of this._orderedFilters)if(n.needUpdateTexture){t=!0,this.clearCommandBuffer();break}for(const n of this._orderedFilters){if(t&&(n.needUpdateTexture=!0),n.onUpdate(e,this.commandBuffer,this._texturePool),this._debug){const e=this._filters.get(n.name).hook;void 0!==e&&this.addCmdBuffer()}this._texturePool.returnAll()}}clearCommandBuffer(){for(const e of this._cmdBufferQueue)e.clearAll();this._currentCmdBufferIndex=0}toString(){return JSON.stringify(this.serialize())}}class wt{constructor(){this._filterGraphs=new Map}static getInstance(){return null==this._instance&&(this._instance=new wt),this._instance}static create(e){const t=this.getInstance();if(t._filterGraphs.has(e))return new Error("Cannot create duplicated graph name.");if(""===e)return new Error("Cannot create empty name graph.");else{const n=new Nt;return t._filterGraphs.set(e,n),n}}static remove(e){const t=this.getInstance();let n="";if(e instanceof Nt){for(const[a,i]of t._filterGraphs)if(i===e){n=a;break}}else n=e;if(t._filterGraphs.has(n)){const e=t._filterGraphs.get(n);null==e?void 0:e.clear(),t._filterGraphs.delete(n)}else return new Error("Cannot find target graph in the system!")}static get(e){const t=this.getInstance();return t._filterGraphs.has(e)?t._filterGraphs.get(e):new Error("Cannot find target graph!")}static get size(){const e=this.getInstance();return e._filterGraphs.size}init(){for(const e of this._filterGraphs.values())e.init()}onUpdate(e){for(const t of this._filterGraphs.values())t.onUpdate(e)}}class Ot extends e{constructor(){super(),this.hands=[],this._handProvider=new Ut(this)}static getInstance(){return null==this._instance&&(this._instance=new Ot),this._instance}static get hands(){return this.getInstance().hands}static on(e,t,n){return this.getInstance().on(e,t,n)}static off(e,t,n){return this.getInstance().off(e,t,n)}onUpdate(){this._handProvider.onUpdate()}init(){}setHandState(e,t){e?this.fire(exports.HandEvent.Detected,t):this.fire(exports.HandEvent.Lost,t)}setHandActionState(e,t){t!==exports.HandStaticGesture.None&&t!==exports.HandStaticGesture.Unknown&&this.fire(exports.HandEvent.StaticGesture,e,t)}setHandSeqActionState(e,t){t!==exports.HandDynamicGesture.None&&this.fire(exports.HandEvent.DynamicGesture,e,t)}}class zt{constructor(){this._handInfo=null}getKeyPoint2D(e){return 1===this._handInfo.key_points_is_detect.get(e)?this._handInfo.key_points_xy.get(e):null}getKeyPointOffset3D(e){return 1===this._handInfo.key_points_3d_is_detect.get(e)?this._handInfo.key_points_3d.get(e):null}get isLeftProbability(){return this._handInfo.left_prob}get isLeft(){return!(.5>this.isLeftProbability)}get id(){return this._handInfo.ID}get scale(){return this._handInfo.scale}get rotation(){const e=this.getKeyPoint2D(9),t=this.getKeyPoint2D(12);if(null==t||null==e)return 0;const n=t.x-e.x,a=t.y-e.y,i=Math.sqrt(n*n+a*a);return 180*(-n/Math.abs(n)*Math.acos(a/i))/Math.PI}get staticGesture(){return this._handInfo.action}get dynamicGesture(){return this._handInfo.seq_action}}class Ut{constructor(e){this._mgr=e,this.lastHandIdSet=new Set,this.ActIDMap=new Map,this.SeqActIDMap=new Map}onUpdate(){var e;const t=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,n=t.getHandCount();this._mgr.hands=Array(n);const a=new Set;if(0<n){for(let e=0;e<n;e++){const n=t.getHandInfo(e),i=new zt;this._mgr.hands[e]=i,null!=n&&(i._handInfo=n,!this.lastHandIdSet.has(i.id)&&this._mgr.setHandState(!0,i.id),this.ActIDMap.has(i.id)?this.ActIDMap.get(i.id)!==i.staticGesture&&(this._mgr.setHandActionState(i.id,i.staticGesture),this.ActIDMap.set(i.id,i.staticGesture)):(this.ActIDMap.set(i.id,i.staticGesture),this._mgr.setHandActionState(i.id,i.staticGesture)),this.SeqActIDMap.has(i.id)?this.SeqActIDMap.get(i.id)!==i.dynamicGesture&&(this._mgr.setHandSeqActionState(i.id,i.dynamicGesture),this.SeqActIDMap.set(i.id,i.dynamicGesture)):(this.SeqActIDMap.set(i.id,i.dynamicGesture),this._mgr.setHandSeqActionState(i.id,i.dynamicGesture)),a.add(i.id))}for(const e of this.lastHandIdSet.values())a.has(e)||this._mgr.setHandState(!1,e);for(const e of this.ActIDMap.keys())a.has(e)||this.ActIDMap.delete(e);for(const e of this.SeqActIDMap.keys())a.has(e)||this.SeqActIDMap.delete(e);this.lastHandIdSet.clear(),a.forEach(e=>this.lastHandIdSet.add(e))}else{this.ActIDMap.clear(),this.SeqActIDMap.clear();for(const e of this.lastHandIdSet.values())this._mgr.setHandState(!1,e);this.lastHandIdSet.clear()}}}class Vt extends e{constructor(){super(),this.bodies=[],this._body2dProvider=new Gt(this)}static getInstance(){return null==this._instance&&(this._instance=new Vt),this._instance}static get bodies(){return this.getInstance().bodies}static on(e,t,n){return this.getInstance().on(e,t,n)}static off(e,t,n){return this.getInstance().off(e,t,n)}onUpdate(){this._body2dProvider.onUpdate()}init(){}setBodyState(e,t){e?this.fire(exports.BodyEvent.Detected,t):this.fire(exports.BodyEvent.Lost,t)}setBodyActionState(e,t){-1!==t&&this.fire(exports.BodyEvent.Action,e,t)}}class Ht{constructor(){this._skeletonInfo=null,this._actionRecognitionInfo=null}get rect(){return this._skeletonInfo.rect}get id(){return this._skeletonInfo.ID}get keyPointDetected(){return this._skeletonInfo.key_points_detected}get keyPointsScore(){return this._skeletonInfo.key_points_score}get keyPoints(){return this._skeletonInfo.key_points_xy}get isActionValid(){return this._actionRecognitionInfo.isValid}get actionLabel(){return this._actionRecognitionInfo.actionLabel}get actionScore(){return this._actionRecognitionInfo.actionScore}}class Gt{constructor(e){this._mgr=e,this.lastSkeletonIdSet=new Set,this.ActIDMap=new Map}onUpdate(){var e;const t=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,n=t.getSkeletonCount();this._mgr.bodies=Array(n);const a=new Set;if(0<n){for(let e=0;e<n;e++){const n=t.getSkeletonInfo(e),i=t.getActionRecognitionInfo(e),r=new Ht;this._mgr.bodies[e]=r,null!=n&&(r._skeletonInfo=n,!this.lastSkeletonIdSet.has(r.id)&&this._mgr.setBodyState(!0,r.id),null!=i&&(r._actionRecognitionInfo=i,this.ActIDMap.has(r.id)?this.ActIDMap.get(r.id)!==r.actionLabel&&(this._mgr.setBodyActionState(r.id,r.actionLabel),this.ActIDMap.set(r.id,r.actionLabel)):(this.ActIDMap.set(r.id,r.actionLabel),this._mgr.setBodyActionState(r.id,r.actionLabel))),a.add(r.id))}for(const e of this.lastSkeletonIdSet.values())a.has(e)||this._mgr.setBodyState(!1,e);for(const e of this.ActIDMap.keys())a.has(e)||this.ActIDMap.delete(e);this.lastSkeletonIdSet.clear(),a.forEach(e=>this.lastSkeletonIdSet.add(e))}else{this.ActIDMap.clear();for(const e of this.lastSkeletonIdSet.values())this._mgr.setBodyState(!1,e);this.lastSkeletonIdSet.clear()}}}class Wt extends e{constructor(){super(),this._trackingMode=!1,this.bodies=[],this._Body3dProvider=new jt(this)}static getInstance(){return null==this._instance&&(this._instance=new Wt),this._instance}static get bodies(){return this.getInstance().bodies}static on(e,t,n){return this.getInstance().on(e,t,n)}static off(e,t,n){return this.getInstance().off(e,t,n)}static get trackingMode(){return this.getInstance()._trackingMode}onUpdate(){this._Body3dProvider.onUpdate()}init(){}setBodyState(e,t){e?this.fire(exports.BodyEvent.Detected,t):this.fire(exports.BodyEvent.Lost,t)}}class qt{constructor(){this._avatar3DInfo=null}get id(){return this._avatar3DInfo.tracking_id}get root(){return this._avatar3DInfo.root}get focalLength(){return this._avatar3DInfo.focal_length}get isDetected(){return this._avatar3DInfo.detected}get jointRotations(){return this._avatar3DInfo.quaternion}get jointPositions(){return this._avatar3DInfo.joints}get imageHeight(){return this._avatar3DInfo.imageHeight}get imageWidth(){return this._avatar3DInfo.imageWidth}}class jt{constructor(e){this._mgr=e,this.lastAvatar3dIdSet=new Set}onUpdate(){var e;const t=null==(e=tn.engine)?void 0:e.algoritms.nativeResult;this._mgr._trackingMode=t.getAvatar3DInfoTracking();const n=t.getAvatar3DInfoCount();this._mgr.bodies=Array(n);const a=new Set;if(0<n){for(let e=0;e<n;e++){const n=t.getAvatar3DInfo(e),i=new qt;this._mgr.bodies[e]=i,null!=n&&(i._avatar3DInfo=n,!this.lastAvatar3dIdSet.has(i.id)&&this._mgr.setBodyState(!0,i.id),a.add(i.id))}for(const e of this.lastAvatar3dIdSet.values())a.has(e)||this._mgr.setBodyState(!1,e);this.lastAvatar3dIdSet.clear(),a.forEach(e=>this.lastAvatar3dIdSet.add(e))}else{for(const e of this.lastAvatar3dIdSet.values())this._mgr.setBodyState(!1,e);this.lastAvatar3dIdSet.clear()}}}class Yt extends e{constructor(){super(),this.faces=[],this._AvatarDriveProvider=new Qt(this)}static getInstance(){return null==this._instance&&(this._instance=new Yt),this._instance}static get faces(){return this.getInstance().faces}static on(e,t,n){return this.getInstance().on(e,t,n)}static off(e,t,n){return this.getInstance().off(e,t,n)}onUpdate(){this._AvatarDriveProvider.onUpdate()}init(){}setAvatarDriveState(e,t){e?this.fire(exports.AvatarDriveEvent.Detected,t):this.fire(exports.AvatarDriveEvent.Lost,t)}}class Xt{constructor(){this._avatarDriveInfo=null}get id(){return this._avatarDriveInfo.ID}get isTracking(){return!(1!==this._avatarDriveInfo.succ)}get channels(){return this._avatarDriveInfo.beta}}class Qt{constructor(e){this._mgr=e,this.lastAvatarDriveIdSet=new Set}onUpdate(){var e;const t=null==(e=tn.engine)?void 0:e.algoritms.nativeResult,n=t.getAvatarDriveCount();this._mgr.faces=Array(n);const a=new Set;if(0<n){for(let e=0;e<n;e++){const n=t.getAvatarDriveInfo(e),i=new Xt;this._mgr.faces[e]=i,null!=n&&(i._avatarDriveInfo=n,!this.lastAvatarDriveIdSet.has(i.id)&&this._mgr.setAvatarDriveState(!0,i.id),a.add(i.id))}for(const e of this.lastAvatarDriveIdSet.values())a.has(e)||this._mgr.setAvatarDriveState(!1,e);this.lastAvatarDriveIdSet.clear(),a.forEach(e=>this.lastAvatarDriveIdSet.add(e))}else{for(const e of this.lastAvatarDriveIdSet.values())this._mgr.setAvatarDriveState(!1,e);this.lastAvatarDriveIdSet.clear()}}}class Kt{constructor(){this._plugins={}}bufferToStr(e){const t=new Uint8Array(e),n=t.length,a=Array(n);for(let r=0;r<n;r++)a[r]=String.fromCharCode.call(null,t[r]);return a.join("")}start(){for(const e in this.loadPlugins(),this._plugins){const t=this._plugins[e];"function"==typeof t.onStart&&t.onStart()}}loadPlugins(){const e=tn.engine.scene.native.assetMgr.rootDir,t=e+"js/plugins.json",n=fs.accessSync(t,0);if(n){const e=fs.readFileSync(t);if(null!=e)try{const t=this.bufferToStr(e),n=JSON.parse(t),a=n.plugins;for(const e in a){const t=a[e];this.initPlugin(t,e)}}catch(t){console.error("Failed to load plugins.json"),console.error(t)}}}initPlugin(e,t){if(0>=t.length)return null;const n=be.toPascalCase(t),a=require(n)[n],i=new a;return this._plugins[t]=i,i.init(tn.engine.scene,e.config),i}update(e){for(const t in this._plugins){const n=this._plugins[t];"function"==typeof n.onUpdate&&n.onUpdate(e)}}lateUpdate(e){for(const t in this._plugins){const n=this._plugins[t];"function"==typeof n.onLateUpdate&&n.onLateUpdate(e)}}destroy(){for(const e in this._plugins){const t=this._plugins[e];"function"==typeof t.onDestroy&&t.onDestroy()}}event(e){for(const t in this._plugins){const n=this._plugins[t];"function"==typeof n.onEvent&&this._plugins[t].onEvent(e)}}get plugins(){return this._plugins}}class Jt{constructor(e,t){this.name=e,this.resource=t}}class Zt{constructor(e){this._engine=e}destroy(){}get rootDir(){return this._engine.scene.native.assetMgr.rootDir}loadSync(e){if(!e.startsWith("share://")&&!e.startsWith("custom://")&&!fs.accessSync(this.rootDir+e,0))return console.error(`Cannot find asset at: ${e}`),null;let n=this._engine.scene.native.assetMgr.SyncLoad(e);if(n){n instanceof t.Material&&(n=new I(n));const a=be.getFilename(e);n=new Jt(a,n)}else console.error(`Failed to load: ${e}`);return n}}class $t{constructor(){this._nativeAlgoMgr=t.AmazingManager.getSingleton("Algorithm")}get nativeResult(){return this._nativeAlgoResult}update(){this._nativeAlgoResult=this._nativeAlgoMgr.getAEAlgorithmResult()}}const en="10.1.0";class tn extends e{constructor(e){super(),this.checkSDKVersion()||console.error(`[Amazing JS]: current SDK version[${t.VERSION}] is lower than the minimum required version[${en}}]. Amazing JS might not be able run properly.`),this._algorithms=new $t,this._scene=new Re(e),this._assets=new Zt(this),this._customAssets=new rt;const n=e.getOutputRenderTexture();this._touch=new Ee(n.width,n.height),this._plugins=new Kt,tn._engine=this}static get engine(){return tn._engine}get scene(){return this._scene}get customAssets(){return this._customAssets}get touch(){return this._touch}get assets(){return this._assets}get algoritms(){return this._algorithms}static init(e){return tn.engine?void console.warn("Engine already initialized"):void(tn._engine=new tn(e),tn._engine.initModules())}initModules(){Ge.getInstance().init(),Oe.getInstance().init(),Ot.getInstance().init(),Vt.getInstance().init(),Wt.getInstance().init(),Yt.getInstance().init(),wt.getInstance().init(),this._customAssets.init()}checkSDKVersion(){const e=t.VERSION.split(".").map(e=>parseInt(e)),n=en.split(".").map(e=>parseInt(e));return n[0]<=e[0]&&n[1]<=e[1]&&n[2]<=e[2]}start(){this._touch.start(),this._customAssets.start(),this._plugins.start();const e=this._plugins.plugins;for(const t in e)this[t]=e[t];this.fire("start")}update(e){this._algorithms.update(),Ge.getInstance().onUpdate(e),Oe.getInstance().onUpdate(),Ot.getInstance().onUpdate(),Vt.getInstance().onUpdate(),Wt.getInstance().onUpdate(),Yt.getInstance().onUpdate(),wt.getInstance().onUpdate(e),this._customAssets.update(e),this._plugins.update(e)}lateUpdate(e){this._customAssets.lateUpdate(e),this._plugins.lateUpdate(e)}destroy(){this._plugins.destroy(),this._customAssets.destroy(),this._assets.destroy(),this._touch&&this._touch.destroy(),this._scene&&this._scene.destroy(),tn._engine=void 0}event(e){this._touch&&this._touch.onEvent(e),this._plugins.event(e)}}class nn extends e{constructor(){super(),this.hasGyroStarted=!1,this.hasGyroStarted=!1}destroy(){}start(){this.hasGyroStarted=!0}get hasStarted(){return this.hasGyroStarted}}var an=t.Mesh;an.calculateTangents=function(e,t,n,a){const r=[],o=a.length/3,s=e.length,d=new Float32Array(3*s),l=new Float32Array(3*s);for(let r=0;r<o;++r){const t=a[3*r],i=a[3*r+1],o=a[3*r+2],s=e[t],c=e[i],p=e[o],m=n[t],u=n[i],f=n[o],h=c.x-s.x,v=p.x-s.x,y=c.y-s.y,_=p.y-s.y,T=c.z-s.z,S=p.z-s.z,I=u.x-m.x,C=f.x-m.x,M=u.y-m.y,x=f.y-m.y,F=I*x-C*M,A=new g,P=new g;if(0===F)A.set(0,1,0),P.set(1,0,0);else{const e=1/F;A.set((x*h-M*v)*e,(x*y-M*_)*e,(x*T-M*S)*e),P.set((I*v-C*h)*e,(I*_-C*y)*e,(I*S-C*T)*e)}d[3*t+0]+=A.x,d[3*t+1]+=A.y,d[3*t+2]+=A.z,d[3*i+0]+=A.x,d[3*i+1]+=A.y,d[3*i+2]+=A.z,d[3*o+0]+=A.x,d[3*o+1]+=A.y,d[3*o+2]+=A.z,l[3*t+0]+=P.x,l[3*t+1]+=P.y,l[3*t+2]+=P.z,l[3*i+0]+=P.x,l[3*i+1]+=P.y,l[3*i+2]+=P.z,l[3*o+0]+=P.x,l[3*o+1]+=P.y,l[3*o+2]+=P.z}const c=new g,p=new T;for(let o=0;o<s;++o){const e=t[o],n=new g(d[3*o],d[3*o+1],d[3*o+2]),a=new g(l[3*o],l[3*o+1],l[3*o+2]),i=e.dot(n);c.set(e.x,e.y,e.z),c.scale(new g(i,i,i)),c.subtract(n,c).normalize(),p.x=c.x,p.y=c.y,p.z=c.z,c.cross2(e,n),p.w=0>c.dot(a)?-1:1,r.push(p.clone())}return r};function rn(e,t,n,a,i,r,o,s,d,l,c=!1){const p=[],m=[],u=[],f=[],h=1/d,v=1/l,T=d+1,S=new g;for(let g=0;g<l+1;g++){const d=g*(o*v)-.5*o;for(let o=0;o<T;o++){const l=o*(r*h)-.5*r;S[e]=l*a,S[t]=d*i,S[n]=.5*s,p.push(S.clone()),S[e]=0,S[t]=0,S[n]=0<s?1:-1,m.push(S.clone()),u.push(new _(o*h,1-g*v))}}for(let p=0;p<l;p++)for(let e=0;e<d;e++){const t=e+T*p,n=e+T*(p+1),a=e+1+T*(p+1),i=e+1+T*p;f.push(t,n,i),f.push(n,a,i)}const I=c?an.calculateTangents(p,m,u,f):void 0;return{positions:p,normals:m,uvs:u,tangents:I,indices:f}}function on(e,t,n,a,r,o=!1){var s=Math.cos,d=Math.sin,l=Math.PI;const c=[],p=[],m=[],u=[],f=.5*e;if(0<e)for(let e=0;e<=a;++e)for(let i=0;i<=r;++i){const o=i*(1/r),h=e*(1/a),v=2*o*l,y=d(v),T=s(v),S=new g(y*t,-f,T*t),I=new g(y*n,f,T*n),C=new g().lerp(S,I,h),M=new g().subtract(I,S).normalize(),x=new g(T,0,-y),F=new g().cross2(x,M).normalize();if(c.push(C.clone()),p.push(F.clone()),m.push(new _(o,h)),e<a&&i<r){const t=e*(r+1)+i,n=e*(r+1)+(i+1),a=(e+1)*(r+1)+i,o=(e+1)*(r+1)+(i+1);u.push(t,n,a),u.push(n,o,a)}}const h=o?an.calculateTangents(c,p,m,u):void 0;return{positions:c,normals:p,uvs:m,tangents:h,indices:u}}function sn(e,t,n,a=!1,r=0,o="full"){var s=Math.cos,d=Math.sin,l=Math.PI;const c=1/n,p=1/t,m=t/2,f=[],h=[],T=[],S=[],I=0;let C=t,M=1;"top"===o?C=m:"bottom"===o&&(C=m,M=-1);for(let m=I;m<=C;++m){const t=m*l*p,a=d(t),i=s(t);for(let t=0;t<=n;++t){const n=2*t*l*c-.5*l,o=d(n),S=s(n),I=S*a,C=M*i,y=o*a,x=1-t*c,u=1-m*p;f.push(new g(I*e,r+C*e,y*e)),h.push(new g(I,C,y)),T.push(new _(x,u))}}for(let s=I;s<C;++s)for(let e=0;e<n;++e){const t=s*(n+1)+e,a=t+n+1;0<M?(S.push(t+1,a,t),S.push(t+1,a+1,a)):(S.push(t,a,t+1),S.push(a,a+1,t+1))}const x=a?an.calculateTangents(f,h,T,S):void 0;return{positions:f,normals:h,uvs:T,tangents:x,indices:S}}function dn(e,t,n=0,a=!1){var r=Math.cos,o=Math.sin,s=Math.PI;const d=0<=n?1:-1,l=[],c=[],p=[],m=[];if(0<e)for(let a=0;a<t;++a){const i=2*(a*(1/t))*s,u=o(i),f=r(i);l.push(new g(u*e,n,f*e)),c.push(new g(0,d,0)),p.push(new _(1-.5*(u+1),.5*(f+1))),1<a&&(0<d?m.push(a-1,a,0):m.push(0,a,a-1))}const u=a?an.calculateTangents(l,c,p,m):void 0;return{positions:l,normals:c,uvs:p,tangents:u,indices:m}}an.createMesh=function(e,n,a=!1,r=!1){const o=new t.FloatVector,s=new t.UInt16Vector;let d=0;for(const t of e){const e=t.positions.length;for(let n=0;n<e;++n)o.pushBack(t.positions[n].x),o.pushBack(t.positions[n].y),o.pushBack(t.positions[n].z),o.pushBack(t.normals[n].x),o.pushBack(t.normals[n].y),o.pushBack(t.normals[n].z),o.pushBack(t.uvs[n].x),o.pushBack(t.uvs[n].y),a&&(o.pushBack(t.tangents[n].x),o.pushBack(t.tangents[n].y),o.pushBack(t.tangents[n].z),o.pushBack(t.tangents[n].w)),r&&(o.pushBack(t.colors[n].r),o.pushBack(t.colors[n].g),o.pushBack(t.colors[n].b),o.pushBack(t.colors[n].a));for(const e of t.indices)s.pushBack(d+e);d+=e}const l=new an;l.boundingBox=n,l.vertices=o;const c=new t.Vector,p=new t.VertexAttribDesc;p.semantic=t.VertexAttribType.POSITION,c.pushBack(p);const m=new t.VertexAttribDesc;m.semantic=t.VertexAttribType.NORMAL,c.pushBack(m);const u=new t.VertexAttribDesc;if(u.semantic=t.VertexAttribType.TEXCOORD0,c.pushBack(u),a){const e=new t.VertexAttribDesc;e.semantic=t.VertexAttribType.TANGENT,c.pushBack(e)}if(r){const e=new t.VertexAttribDesc;e.semantic=t.VertexAttribType.COLOR,c.pushBack(e)}l.vertexAttribs=c;const g=new t.SubMesh;return g.indices16=s,g.primitive=t.Primitive.TRIANGLES,g.boundingBox=n,l.addSubMesh(g),l},an.box=function(e){const n=e&&e.halfExtents!==void 0?e.halfExtents:new g(.5,.5,.5),a=!!(e&&e.withTangents!==void 0)&&e.withTangents,i=2*n.x,r=2*n.y,o=2*n.z,s=1,d=1,l=1,c=.5*i,p=.5*r,m=.5*o,u=rn("z","y","x",-1,-1,o,r,i,l,d,a),f=rn("z","y","x",1,-1,o,r,-i,l,d,a),h=rn("x","z","y",1,1,i,o,r,s,l,a),v=rn("x","z","y",1,-1,i,o,-r,s,l,a),y=rn("x","y","z",1,-1,i,r,o,s,d,a),_=rn("x","y","z",-1,-1,i,r,-o,s,d,a),T=new t.AABB;T.min_x=-c,T.min_y=-p,T.min_z=-m,T.max_x=c,T.max_y=p,T.max_z=m;const S=an.createMesh([u,f,h,v,y,_],T,a);return S},an.cylinder=function(e){const n=e&&e.radius!==void 0?e.radius:.5,a=e&&e.height!==void 0?e.height:1,i=e&&e.heightSegments!==void 0?e.heightSegments:5,r=e&&e.capSegments!==void 0?e.capSegments:20,o=!!(e&&e.withTangents!==void 0)&&e.withTangents,s=new t.AABB;s.min_x=-n,s.min_y=.5*-a,s.min_z=-n,s.max_x=n,s.max_y=.5*a,s.max_z=n;const d=dn(n,r,.5*-a,o),l=on(a,n,n,i,r,o),c=dn(n,r,.5*a,o),p=an.createMesh([d,l,c],s,o);return p},an.cone=function(e){const n=!!(e&&e.withTangents!==void 0)&&e.withTangents,a=e&&e.bottomRadius!==void 0?e.bottomRadius:.5,i=e&&e.topRadius!==void 0?e.topRadius:0,r=e&&e.height!==void 0?e.height:1,o=e&&e.heightSegments!==void 0?e.heightSegments:5,s=e&&e.capSegments!==void 0?e.capSegments:20,d=Math.max(a,i),l=new t.AABB;l.min_x=-d,l.min_y=.5*-r,l.min_z=-d,l.max_x=d,l.max_y=.5*-r,l.max_z=d;const c=dn(a,s,.5*-r,n),p=on(r,a,i,o,s,n),m=0<i?dn(i,s,.5*r,n):void 0,u=0<i?[c,p,m]:[c,p],g=an.createMesh(u,l,n);return g},an.plane=function(e){const n=!!(e&&e.withTangents!==void 0)&&e.withTangents,a=e&&e.width!==void 0?e.width:1,i=e&&e.length!==void 0?e.length:1,r=e&&e.widthSegments!==void 0?e.widthSegments:5,o=e&&e.lengthSegments!==void 0?e.lengthSegments:5,s=.5*a,d=.5*i,l=new t.AABB;l.min_x=-s,l.min_y=0,l.min_z=-d,l.max_x=s,l.max_y=0,l.max_z=d;const c=rn("x","z","y",1,1,a,i,0,r,o,n),p=an.createMesh([c],l,n);return p},an.sphere=function(e){const n=!!(e&&e.withTangents!==void 0)&&e.withTangents,a=e&&e.radius!==void 0?e.radius:.5,i=e&&e.widthSegments!==void 0?e.widthSegments:16,r=e&&e.heightSegments!==void 0?e.heightSegments:16,o=new t.AABB;o.min_x=-a,o.min_y=-a,o.min_z=-a,o.max_x=a,o.max_y=a,o.max_z=a;const s=sn(a,i,r,n),d=an.createMesh([s],o,n);return d},an.capsule=function(e){const n=!!(e&&e.withTangents!==void 0)&&e.withTangents,a=e&&e.radius!==void 0?e.radius:.5,i=e&&e.height!==void 0?e.height:1,r=e&&e.heightSegments!==void 0?e.heightSegments:5,o=e&&e.capSegments!==void 0?e.capSegments:20,s=new t.AABB;s.min_x=-a,s.min_y=.5*-i-a,s.min_z=-a,s.max_x=a,s.max_y=.5*i+a,s.max_z=a;const d=on(i,a,a,r,o,n),l=sn(a,o,o,n,.5*i,"top"),c=sn(a,o,o,n,.5*-i,"bottom"),p=an.createMesh([c,d,l],s,n);return p},an.torus=function(e){var n=Math.cos,a=Math.sin,r=Math.PI;const o=!!(e&&e.withTangents!==void 0)&&e.withTangents,s=e&&e.tubeRadius!==void 0?e.tubeRadius:.2,d=e&&e.ringRadius!==void 0?e.ringRadius:.3,l=e&&e.ringSegments!==void 0?e.ringSegments:20,c=e&&e.tubeSegments!==void 0?e.tubeSegments:20,p=s+d,m=new t.AABB;m.min_x=-p,m.min_y=-s,m.min_z=-p,m.max_x=p,m.max_y=s,m.max_z=p;const u=[],f=[],h=[],v=[];for(let t=0;t<=l;++t){const e=t*(1/l);for(let i=0;i<=c;++i){const o=i*(1/c),p=n(2*r*e),m=n(2*r*o),y=a(2*r*e),T=a(2*r*o);if(u.push(new g(m*(d+s*p),y*s,T*(d+s*p))),f.push(new g(m*p,y,T*p)),h.push(new _(e,1-o)),t<l&&i<c){const e=t*(c+1)+i,n=(t+1)*(c+1)+i,a=t*(c+1)+(i+1),r=(t+1)*(c+1)+(i+1);v.push(e,n,a),v.push(n,r,a)}}}const y=o?an.calculateTangents(u,f,h,v):void 0,T=an.createMesh([{positions:u,normals:f,uvs:h,tangents:y,indices:v}],m,o);return T};class ln{constructor(e){if(!e.attributes)throw new Error("No shader attributes found!");if(!e.vshader)throw new Error("No vertex shader found!");if(!e.fshader)throw new Error("No fragment shader found!");const n=new t.Map;for(const t in e.attributes)n.insert(t,e.attributes[t]);const a=new t.Shader;a.type=t.ShaderType.VERTEX,a.source=e.vshader;const i=new t.Shader;i.type=t.ShaderType.FRAGMENT,i.source=e.fshader;const r=new t.Vector;r.pushBack(a),r.pushBack(i);const o=new t.Map;o.insert("gles2",r);const s=new t.RenderState;s.depthstencil=new t.DepthStencilState,s.depthstencil.depthTestEnable=!0,s.depthstencil.depthWriteEnable=!0,s.depthstencil.stencilTestEnable=!1,s.depthstencil.depthCompareOp=t.CompareOp.LESS;const d=new t.RasterizationState;s.rasterization=d,d.cullMode=t.CullFace.BACK;const l=new t.ColorBlendAttachmentState;l.srcColorBlendFactor=t.BlendFactor.SRC_ALPHA,l.dstColorBlendFactor=t.BlendFactor.ONE_MINUS_SRC_ALPHA,l.srcAlphaBlendFactor=t.BlendFactor.ONE,l.dstAlphaBlendFactor=t.BlendFactor.ONE,l.colorWriteMask=15,l.ColorBlendOp=t.BlendOp.ADD,l.AlphaBlendOp=t.BlendOp.ADD,l.blendEnable=!0;const c=new t.Vector;c.pushBack(l);const p=new t.ColorBlendState;p.attachments=c,s.colorBlend=p;const m=new t.Pass;m.semantics=n,m.shaders=o,m.renderState=s;const u=new t.Vector;u.pushBack(m),this.native=new t.XShader,this.native.passes=u}}class cn{onInit(){this.sce=tn.engine.scene,this.entity=this.sce.entityFromNative(this.entity),this.engine=tn.engine;for(const e of this.entity.getComponents(Ae))if(e.script===this){this.component=e;break}}}var pn=t.Matrix3x3f,mn=t.Rect,un=t.AABB;function gn(e,t,n,a){const r=[],o=a.length/3,s=e.length,d=new Float32Array(3*s),l=new Float32Array(3*s);for(let r=0;r<o;++r){const t=a[3*r],i=a[3*r+1],o=a[3*r+2],s=e[t],c=e[i],p=e[o],m=n[t],u=n[i],f=n[o],h=c.x-s.x,v=p.x-s.x,y=c.y-s.y,_=p.y-s.y,T=c.z-s.z,S=p.z-s.z,I=u.x-m.x,C=f.x-m.x,M=u.y-m.y,x=f.y-m.y,F=I*x-C*M,A=new g,P=new g;if(0===F)A.set(0,1,0),P.set(1,0,0);else{const e=1/F;A.set((x*h-M*v)*e,(x*y-M*_)*e,(x*T-M*S)*e),P.set((I*v-C*h)*e,(I*_-C*y)*e,(I*S-C*T)*e)}d[3*t+0]+=A.x,d[3*t+1]+=A.y,d[3*t+2]+=A.z,d[3*i+0]+=A.x,d[3*i+1]+=A.y,d[3*i+2]+=A.z,d[3*o+0]+=A.x,d[3*o+1]+=A.y,d[3*o+2]+=A.z,l[3*t+0]+=P.x,l[3*t+1]+=P.y,l[3*t+2]+=P.z,l[3*i+0]+=P.x,l[3*i+1]+=P.y,l[3*i+2]+=P.z,l[3*o+0]+=P.x,l[3*o+1]+=P.y,l[3*o+2]+=P.z}const c=new g,p=new T;for(let o=0;o<s;++o){const e=t[o],n=new g(d[3*o],d[3*o+1],d[3*o+2]),a=new g(l[3*o],l[3*o+1],l[3*o+2]),i=e.dot(n);c.set(e.x,e.y,e.z),c.scale(new g(i,i,i)),c.subtract(n,c).normalize(),p.x=c.x,p.y=c.y,p.z=c.z,c.cross2(e,n),p.w=0>c.dot(a)?-1:1,r.push(p.clone())}return r}function fn(e,t,n,a,i,r,o,s,d,l){const c=[],p=[],m=[],u=[],f=1/d,h=1/l,v=d+1,T=new g;for(let u=0;u<l+1;u++){const d=u*(o*h)-.5*o;for(let o=0;o<v;o++){const l=o*(r*f)-.5*r;T[e]=l*a,T[t]=d*i,T[n]=.5*s,c.push(T.clone()),T[e]=0,T[t]=0,T[n]=0<s?1:-1,p.push(T.clone()),m.push(new _(o*f,1-u*h))}}for(let p=0;p<l;p++)for(let e=0;e<d;e++){const t=e+v*p,n=e+v*(p+1),a=e+1+v*(p+1),i=e+1+v*p;u.push(t,n,i),u.push(n,a,i)}const S=gn(c,p,m,u);return{positions:c,normals:p,uvs:m,tangents:S,indices:u}}function hn(e){var n=Math.floor;const a=e&&void 0!==e.width?e.width:1,i=e&&void 0!==e.height?e.height:1,r=e&&void 0!==e.depth?e.depth:1;let o=e&&void 0!==e.widthSegments?e.widthSegments:1,s=e&&void 0!==e.heightSegments?e.heightSegments:1,d=e&&void 0!==e.depthSegments?e.depthSegments:1;const l=.5*a,c=.5*i,p=.5*r;o=n(o)||1,s=n(s)||1,d=n(d)||1;const m=fn("z","y","x",-1,-1,r,i,a,d,s),u=fn("z","y","x",1,-1,r,i,-a,d,s),g=fn("x","z","y",1,1,a,r,i,o,d),f=fn("x","z","y",1,-1,a,r,-i,o,d),h=fn("x","y","z",1,-1,a,i,r,o,s),v=fn("x","y","z",-1,-1,a,i,-r,o,s),y=new t.AABB;return y.min_x=-l,y.min_y=-c,y.min_z=-p,y.max_x=l,y.max_y=c,y.max_z=p,{data:[m,u,g,f,h,v],aabb:y}}var vn={__proto__:null,box:hn};class yn{constructor(e,t){this._name=e,this._context=t}equals(e){return this._name===e.name}get name(){return this._name}get context(){return this._context}onEnter(){}onExit(){}onUpdate(){}onEvent(){}toString(){return`[${this._name}]`}}class _n{constructor(){this._registeredStates=new Map}setState(){}removeState(){}onUpdate(){}onEvent(){}registerState(e){this._registeredStates.has(e.name)&&console.log(`State [${e.name}] already registered! Overriding`),this._registeredStates.set(e.name,e)}}class Tn extends _n{constructor(){super(...arguments),this._currentStates=new Set}onUpdate(e){for(const t of this._currentStates){const n=this._registeredStates.get(t);n&&n.onUpdate(e)}}onEvent(e){for(const t of this._currentStates){const n=this._registeredStates.get(t);n&&n.onEvent(e)}}setState(e){if(!this._registeredStates.has(e))return void console.log(`Unrecognized state [${e}]`);const t=this._registeredStates.get(e);this._currentStates.has(e)||(t&&t.onEnter(),this._currentStates.add(e))}removeState(e){if(this._registeredStates.has(e)||console.log(`Unrecognized state [${e}]`),this._currentStates.has(e)){const t=this._registeredStates.get(e);t&&t.onExit(),this._currentStates.delete(e)}}}class Sn extends _n{constructor(){super(...arguments),this._currentState=null,this._transitions=new Map}addTransition(e,t){if(this._registeredStates.has(e)&&this._registeredStates.has(t)){this._transitions.has(e)||this._transitions.set(e,new Set);const n=this._transitions.get(e);n&&n.add(t)}}isValidTransition(e,t){const n=this._transitions.get(e);return!!n&&n.has(t)}setState(e){if(this._registeredStates.has(e)){if(this._currentState&&this.isValidTransition(this._currentState.name,e)){const e=this._currentState;e.onExit()}const t=this._registeredStates.get(e);t&&t.onEnter(),this._currentState=t}}removeState(e){this._currentState&&this._currentState.name===e&&(this._currentState.onExit(),this._currentState=null)}onUpdate(e){this._currentState&&this._currentState.onUpdate(e)}onEvent(e){this._currentState&&this._currentState.onEvent(e)}}exports.AABB=un,exports.AlignmentComponent=ye,exports.AnimationComponent=Ie,exports.AudioComponent=Me,exports.AvatarDrive=Yt,exports.Body2D=Vt,exports.Body3D=Wt,exports.ButtonComponent=Z,exports.CameraComponent=d,exports.CanvasComponent=U,exports.CanvasScalerComponent=ge,exports.Collider3DComponent=m,exports.Color=u,exports.ConvFilter=ut,exports.CustomComponent=Ae,exports.Engine=tn,exports.Entity=Pe,exports.EntityLayerMax=64,exports.EntityTagMax=o,exports.EventHandler=e,exports.FilterGraph=Nt,exports.FilterGraphRegistry=wt,exports.FilterNode=ot,exports.FiniteStateMachine=Sn,exports.GenericJoint3DComponent=Te,exports.Geometry=vn,exports.Gyroscope=nn,exports.Hand=Ot,exports.Head=Oe,exports.ImageComponent=O,exports.ImagePixelFormat=i,exports.LabelComponent=me,exports.LayoutComponent=he,exports.LightComponent=y,exports.Mat3=pn,exports.Mat4=S,exports.Material=I,exports.Mesh=an,exports.ModelComponent=M,exports.MultiToggleStateMachine=Tn,exports.OperatorFilter=pt,exports.ParticleSystemComponent=R,exports.PingpongFilter=mt,exports.Quat=A,exports.Rect=mn,exports.RigidBody3DComponent=B,exports.Scene=Re,exports.ScreenTransformComponent=Fe,exports.Script=cn,exports.Segmentation=Ge,exports.SeqAnimationComponent=W,exports.SliderComponent=se,exports.SliderThumbComponent=ce,exports.SpriteComponent=H,exports.State=yn,exports.TouchDevice=Ee,exports.Trigger3DComponent=q,exports.UIColliderComponent=ie,exports.UIEventSystemComponent=ee,exports.Vec2=_,exports.Vec3=g,exports.Vec4=T,exports.XShader=ln;