/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 7. 25.
 * Time: 오후 10:41
 * To change this template use File | Settings | File Templates.
 */


ramb3d = {
    REVISION : 'r01',
    Renderer : {},
    scene : {}
}





/*

 -SceneManager 생성자 매개 변수

 renderer :{
 canvas_element :
 bkg_color :
 container : 화면이 들어갈 루트 노드 디폴트는 body
 }

 windowSize {
 width:
 height:
 }

 camera : {
 fov:
 aspect:
 near:
 far:
 element:
 position:
 looat
 }

 -프로토타입 함수

 updateAll
 addTBCameraController


 -콜백 함수

 preProcessing : 전처리 updateAll 내 에서 호출됨
 postProcessing : 후처리 updateAll 내 에서 호출됨

 */

ramb3d.scene.SceneManager = function(param) {


    if(param == undefined) {
        param = {};
    }

    var container = document.body;

    if(param.window_size) {
        this.window_size = param.window_size;
    }
    else {

        this.window_size = {
            width : window.innerWidth,
            height : window.innerHeight
        }
    }


    if(param.camera == undefined) {
        param.camera = {};

        param.camera.fov = 45;
        param.camera.near = 1;
        param.camera.far = 5000;
        param.camera.position = new THREE.Vector3(0,0,700);
        param.camera.lookat = new THREE.Vector3();

    }


    //카메라 생성
    this.camera = new THREE.PerspectiveCamera( param.camera.fov, this.window_size.width / this.window_size.height, param.camera.near, param.camera.far );
    this.camera.position.copy( param.camera.position  );
    this.camera.lookAt( param.camera.lookat );

    //씬 생성객체
    this.scene = new THREE.Scene();


    if(param.renderer == undefined) {
        param.renderer = {
            type : 'css3'
        };
    }

    //랜더러 생성
    switch(param.renderer.type)
    {
        case 'css3':
            this.renderer = new THREE.CSS3DRenderer();
//            this.renderer = new ramb3d.Renderer.CSS3D();

            this.renderer.domElement.style.position = 'absolute';
            if(param.renderer.bkg_color)
            {
                this.renderer.domElement.style.backgroundColor = param.renderer.bkg_color;
            }
            else {
                this.renderer.domElement.style.backgroundColor="#9966FF";   //배경컬러지정

            }

            break;
        case 'canvas':

            break;
        case 'webgl':
            // renderer
            /*
             canvas — A Canvas where the renderer draws its output.
             precision — shader precision. Can be "highp", "mediump" or "lowp".
             alpha — Boolean, default is true.
             premultipliedAlpha — Boolean, default is true.
             antialias — Boolean, default is false.
             stencil — Boolean, default is true.
             preserveDrawingBuffer — Boolean, default is false.
             clearColor — Integer, default is 0x000000.
             clearAlpha — Float, default is 0.
             maxLights — Integer, default is 4.

             */
            this.renderer = new THREE.WebGLRenderer(
                {
                    antialias: param.renderer.antialias || true,
//                    clearColor: param.renderer.clearColor || 0x000000 ,
//                    clearAlpha: param.renderer.clearAlpha  || 0,
                    preserveDrawingBuffer : param.renderer.preserveDrawingBuffer  || false,
                    canvas   : param.renderer.canvas,
                    precision: param.renderer.precision,
                    premultipliedAlpha : param.renderer.premultipliedAlpha || true,
                    alpha: param.renderer.alpha || true,
                    maxLights:param.renderer.maxLight || 4,
                    stencil: param.renderer.stencil || true
                }
            );


            this.renderer.setClearColor( param.renderer.bkg_color || 0x000000,0);

//            this.renderer.setSize( this.window_size.width, this.window_size.height);
            break;
        default :
            console.error('unknown renderer');
            break;
    }

    this.renderer_type = param.renderer.type;


    this.renderer.setSize( this.window_size.width, this.window_size.height);

    //컨테인너 노드에 자식으로 붙이기
    if(param.renderer.container) {
        param.renderer.container.appendChild( this.renderer.domElement );
    }
    else {
        document.body.appendChild( this.renderer.domElement );
    }




    /*

     if(param.renderer != undefined) {
     var container = param.renderer.container ? param.renderer.container : container;

     this.renderer = new THREE.CSS3DRenderer(
     param.renderer.canvas_element,
     document.createElement( 'div' ),
     param.renderer.bkg_color);


     }
     else {
     this.renderer = new THREE.CSS3DRenderer();
     this.renderer.domElement.style.backgroundColor="#9966FF";   //배경컬러지정
     document.body.appendChild( this.renderer.domElement );

     }

     container.appendChild( this.renderer.domElement );




     if(param.windowSize != undefined) {

     this.renderer.setSize(param.windowSize.width,param.windowSize.height  );

     }
     else {
     this.renderer.setSize( window.innerWidth, window.innerHeight );
     }




     if(param.camera == undefined) {
     this.camera = new THREE.CSS3DPerspectiveCamera(
     {
     fov : 90,
     aspect : window.innerWidth / window.innerHeight,
     near : 1,
     far : 1000,
     element : this.renderer.cameraElement
     }
     );
     this.camera.position.set(0,0,500);
     this.camera.lookAt( new THREE.Vector3(0,0,0) );
     }
     else {
     this.camera = new THREE.CSS3DPerspectiveCamera(
     {
     fov : param.camera.fov,
     aspect : param.camera.aspect,//window.innerWidth / window.innerHeight,
     near : param.camera.near,//1,
     far : param.camera.far,//1000,
     element : this.renderer.cameraElement
     }
     );
     this.camera.position.copy(param.camera.position);
     this.camera.lookAt( param.camera.lookat );
     }

     this.scene = new THREE.CSS3DScene({
     camera:this.camera
     });

     */


}

ramb3d.scene.SceneManager.prototype = {

    updateAll : function(param) {

        //선처리
        if(this.preProcessing) {

            this.preProcessing();

        }

        if(param == undefined) {
            param = {};
        }

        if(param.resize != undefined) {

            this.camera.aspect = param.resize.width / param.resize.height;
            this.camera.updateProjectionMatrix();


            this.renderer.setSize( param.resize.width, param.resize.height);
        }

        this.renderer.render( this.scene, this.camera );

        //후처리
        if(this.postProcessing) {

            this.postProcessing();

        }

    },
    //트랙볼 카메라 컨트롤러 추가
    addTBCameraController : function(param) {

        if(this.CameraController != undefined) {
            this.CameraController.release();
        }

        this.CameraController = new ramb3d.scene.TBCameraController(param);

        return this.CameraController;

    },
    addAmbientLight : function(color) {
        var ambientLight = new THREE.AmbientLight(color || 0x222222);
        this.scene.add(ambientLight);
    },
    addDirectionalLight : function(param) {

        if(param == undefined) {
            param = {}
        }

        var directionalLight = new THREE.DirectionalLight(param.color || 0xffffff);
        directionalLight.position.copy(param.direction || new THREE.Vector3(1,1,1)).normalize();

        this.scene.add(directionalLight);
    }

}

///////////////////////////////////////////////////////
//camera controller


//구형태의 트랙볼 제어 카메라 컨트롤러
/*

 Smgr : 씬매니져객체
 center : 시점(구의 중심점)
 radius : 카메라와 시점좌표간의 거리

 */
ramb3d.scene.TBCameraController = function(param) {


    var Smgr = param.Smgr;
    var radius = param.radius;

    var angle_limit = param.limit;

    Smgr.camera.position.set(0,0,radius);

    var dummy_lookat = ramb3d.util.createDummy({
        parent : Smgr.scene,
        position :param.center
    });

    //dummy_lookat.eulerOrder = 'YXZ';
    dummy_lookat.rotation.order = 'YXZ';

    var dummy_eye = ramb3d.util.createDummy({
        position :Smgr.camera.position
    });

    Smgr.scene.add(dummy_lookat);

    dummy_lookat.add(dummy_eye);

    var canvas_dom = Smgr.renderer.domElement;

    //추가적인 후면 씬메니져
    if(param.subSmgr != undefined) {
        this.subSmgr = param.subSmgr;
    }



    //이밴트 핸들링

    var _onDocumentMouseDown = onDocumentMouseDown.bind(this);
    var _onDocumentMouseMove = onDocumentMouseMove.bind(this);
    var _onDocumentMouseUp = onDocumentMouseUp.bind(this);
    var _onDocumentMouseWheel = onDocumentMouseWheel.bind(this);

    function MoveEventHandler(movementX,movementY)
    {
        //시점 중심으로 fps 카메라식으로 회전시키기 위하여...

//        dummy_lookat.eulerOrder = 'YXZ';
//        console.log(dummy_lookat);

        dummy_lookat.rotation.y += movementX * 0.01;
        dummy_lookat.rotation.x -= movementY * 0.01;

        //회전 제한 범위 계산
        if(angle_limit) {

            if(dummy_lookat.rotation.x < angle_limit.min_x   ) {

                dummy_lookat.rotation.x = angle_limit.min_x;
            }
            else if(dummy_lookat.rotation.x > angle_limit.max_x) {

                dummy_lookat.rotation.x = angle_limit.max_x;

            }

            if(dummy_lookat.rotation.y < angle_limit.min_y   ) {

                dummy_lookat.rotation.y = angle_limit.min_y;
            }
            else if(dummy_lookat.rotation.y > angle_limit.max_y) {

                dummy_lookat.rotation.y = angle_limit.max_y;

            }
        }

        this.apply();

        Smgr.updateAll();

        if(this.subSmgr) {
            this.subSmgr.updateAll();
        }

    }

    function WheelEventHandler(deltaZ) {

        dummy_eye.position.z += deltaZ;

        this.apply();
        Smgr.updateAll();

    }


    function onDocumentMouseDown( event ) {

        event.preventDefault();

        canvas_dom.addEventListener( 'mousemove',  _onDocumentMouseMove , false );
        canvas_dom.addEventListener( 'mouseup', _onDocumentMouseUp, false );

    }

    function onDocumentMouseMove( event ) {

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        MoveEventHandler.call(this,movementX,movementY);



        //this.apply();
        //Smgr.updateAll();
    }

    function onDocumentMouseUp( event ) {

        canvas_dom.removeEventListener( 'mousemove', _onDocumentMouseMove );
        canvas_dom.removeEventListener( 'mouseup', _onDocumentMouseUp );
    }
    function onDocumentMouseWheel( event ) {

        event.preventDefault();

        WheelEventHandler.call(this,event.wheelDeltaY);

//        dummy_eye.position.z += event.wheelDeltaY;
//
//        this.apply();
//        Smgr.updateAll();

        //moveFront(event.wheelDeltaY);

    }

    canvas_dom.addEventListener( 'mousedown', _onDocumentMouseDown, false );
    canvas_dom.addEventListener( 'mousewheel', _onDocumentMouseWheel, false );

    //
    /////////////////////

    //터치 디바이스
    document.addEventListener( 'touchstart', onDocumentTouchStart.bind(this), false );
    document.addEventListener( 'touchmove', onDocumentTouchMove.bind(this), false );

    var touchX,  touchY;
    var prev_dist

    function onDocumentTouchStart( event ) {

        event.preventDefault();

        var touch = event.touches[ 0 ];

        touchX = touch.screenX;
        touchY = touch.screenY;

        if(event.touches.length >= 2) {

            var tempx = event.touches[0].pageX - event.touches[1].pageX;
            var tempy = event.touches[0].pageY - event.touches[1].pageY;
            //var dist = Math.sqrt(tempx*tempx + tempy*tempy);
            //prev_dist = dist;
        }

    }

    function onDocumentTouchMove( event ) {

        event.preventDefault();

        if(event.touches.length >= 2) {

            var tempx = event.touches[0].pageX - event.touches[1].pageX;
            var tempy = event.touches[0].pageY - event.touches[1].pageY;
            var dist = Math.sqrt(tempx*tempx + tempy*tempy);

            //moveFront(-(dist - prev_dist));
            prev_dist = dist;

            WheelEventHandler.call(this,-(dist - prev_dist));

        }
        else {
            var touch = event.touches[ 0 ];

            var movementX =  (touchX - touch.screenX);
            var movementY =  (touchY - touch.screenY);

            touchX = touch.screenX;
            touchY = touch.screenY;

            MoveEventHandler.call(this,movementX,movementY)

            //if(Math.abs(movementX) < 30 && Math.abs(movementY) < 30 ) {
            //    callbackControl(-movementX,-movementY);
            //}


        }



        //var touch = event.touches[ 1 ];
    }

    //
    ////////////////////

    this.apply = function() {

        //매트릭스 css3 적용
        dummy_lookat.updateMatrix();

        //씬노드에 있는 노드들의 월드행렬들을 최신으로 모두 갱신해주기
        Smgr.scene.updateMatrixWorld(true);

        //월드 좌표구하기
        var worldPos = new THREE.Vector3(0,0,0);
        worldPos.getPositionFromMatrix(dummy_eye.matrixWorld);
        Smgr.camera.position.copy(worldPos);
        Smgr.camera.lookAt( dummy_lookat.position );

        if(this.subSmgr) {

            this.subSmgr.camera.position.copy(worldPos);
            this.subSmgr.camera.lookAt( dummy_lookat.position );

        }


    }
    this.release = function() {

        canvas_dom.removeEventListener( 'mousedown', _onDocumentMouseDown );
        canvas_dom.removeEventListener( 'mousemove', _onDocumentMouseMove );
        canvas_dom.removeEventListener( 'mouseup', _onDocumentMouseUp );
        canvas_dom.removeEventListener( 'mousewheel', _onDocumentMouseWheel );
    }

    this.setRadius= function(radius)  {
        dummy_eye.position.set(0,0,radius);
        return this;
    }

    this.setRotation = function(x,y,z) {

//        rotation.eulerOrder = ''

        dummy_lookat.rotation.set(x,y,z);
        return this;
    }

    this.getBilboard = function(up_vector) {
        var mat_sunbil = new THREE.Matrix4();
        mat_sunbil.lookAt( Smgr.camera.position, dummy_lookat.position, up_vector ); //빌보드 행렬만들기

        return mat_sunbil;
        //dummy_hyuna.rotation.setEulerFromRotationMatrix( mat_sunbil, dummy_hyuna.eulerOrder ); //빌보드 행렬 적용


    }





}

///////////////////////////////////////////////////////
ramb3d.util = {



    /*

     parameter list

     element :
     position :
     parent :
     name :

     */

    createDummy  : function(param) {

        if(param == undefined) {
            param = {};
            param.position = new THREE.Vector3();
        }

        var dummy;
        //더미 만들기
        if(param.render_type == 'webgl') {
            dummy = new THREE.Object3D();
        }
        else {
            /*
            dummy = new ramb3d.scene.CSS3DObject({
                element: document.createElement('div')
            });
            */
            dummy = new THREE.CSS3DObject(
                document.createElement('div')
            );
        }



        if(param.position != undefined ) {
            dummy.position.copy(param.position);
        }

        if(param.name != undefined ) {
            dummy.name = param.name;
        }

        if(param.parent != undefined) {
            param.parent.add(dummy);
        }

        return dummy;

    },

    /*

     parameter list

     element :
     width :
     height :
     color :
     texture :
     position :
     name :
     parent :


     */
    createPlane : function(param) {

        var object;

        if(param.render_type === undefined) {
            param.render_type = 'css3';
        }

        switch (param.render_type) {

            case 'css3':

                (function() {

                    var element = $('<div></div>');

                    if(param.width != undefined) {
                        element.css('width',param.width);
                        element.css('height',param.height);

                    }
                    else {
                        element.css('width',64 + 'px');
                        element.css('height',64 +'px');
                    }

                    // 추가
                    if(param.pattern == 'stripe') {
                        element.css('background-color',param.color);
                        element.css('background-size',param.gap+'px '+param.gap+'px');
                        element.css('background-image','linear-gradient(transparent 50%, rgba(255,255,255,.6) 50%)');
                    }else if(param.pattern == 'cross'){
                        element.css('background-color',param.color);
                        element.css('background-size',param.gap+'px '+param.gap+'px');
                        element.css('background-image','linear-gradient(90deg, rgba(30,30,30,.5) 50%, transparent 50%), linear-gradient(rgba(30,30,30,.5) 50%, transparent 50%)');
                    }else if(param.pattern == 'grid'){
                        element.css('background-color',param.color);
                        element.css('background-size',param.gap+'px '+param.gap+'px ,'+param.gap+'px '+param.gap+'px ,'+ param.gap/5+'px '+param.gap/5+'px ,'+param.gap/5+'px '+param.gap/5+'px');
                        element.css('background-position','-2px -2px, -2px -2px, -1px -1px, -1px -1px');
                        element.css('background-image','linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px), linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)');
                    }

                    if(param.color != undefined) {
                        element.css('background-color',param.color);
                    }
                    else {
                        element.css('background-color','#000000');
                    }

                    if(param.texture != undefined) {
                        element.css('background-image', 'url('+ param.texture + ')');
                        element.css('background-size', '100%');
                    }

                    /*
                    var centerOrigin = param.centerOrigin ? param.centerOrigin : '-50%,-50%';

                    object = new ramb3d.scene.CSS3DObject( {
                            element: element[0],
                            centerOrigin : centerOrigin
                        }
                    );
                    */
                    object = new THREE.CSS3DObject(
                        element[0]
                    );


                })();

                break;
            case 'webgl':

                (function() {

                    var matrial = param.matrial || new THREE.MeshBasicMaterial({
                        color: param.color
                    });

                    object = new THREE.Mesh(
                        new THREE.PlaneGeometry(param.width, param.height),
                        matrial);

                })();


                break;
        }

        if(param.position != undefined ) {
            object.position.copy(param.position);
        }
        if(param.rotation != undefined ) {
            object.rotation.copy(param.rotation);
        }

        if(param.name != undefined ) {
            object.name = param.name;
        }

        if(param.parent != undefined) {
            param.parent.add(object);
        }

        return object;


    },

    /*
    큐브만들기
     */
    createCube : function (option) {

        var root_node = ramb3d.util.createDummy();
        //모델 세팅
        var object = ramb3d.util.createPlane({
//            name : 'hello-plane',
            width : option.size,
            height : option.size,
            texture : option.texture,
            render_type : 'css3',
            parent : root_node
        });
        object.element.style.webkitBackfaceVisibility="hidden";
        object.position.set(0,0,64);

        cloneobj = object.clone();
        root_node.add(cloneobj);
        cloneobj.position.set(0,0,-64);
        cloneobj.rotation.set(0,THREE.Math.degToRad(180),0);

        var cloneobj = object.clone();
        root_node.add(cloneobj);
        cloneobj.position.set(0,64,0);
        cloneobj.rotation.set(THREE.Math.degToRad(-90),0,0);

        cloneobj = object.clone();
        root_node.add(cloneobj);
        cloneobj.position.set(0,-64,0);
        cloneobj.rotation.set(THREE.Math.degToRad(90),0,0);

        cloneobj = object.clone();
        root_node.add(cloneobj);
        cloneobj.position.set(64,0,0);
        cloneobj.rotation.set(0,THREE.Math.degToRad(90),0);

        cloneobj = object.clone();
        root_node.add(cloneobj);
        cloneobj.position.set(-64,0,0);
        cloneobj.rotation.set(0,THREE.Math.degToRad(-90),0);

        return root_node;

    },

    /*

     color : 라인 오브잭트컬러값
     start : 시작점
     end : 끝점
     thick : 두께
     {
     w:가로 두께,
     h:세로두께
     }

     예제>
     var line = new ramb3d.util.createLine({
     color : new THREE.Color(0xff0000),
     start: new THREE.Vector3(300,-200),
     end : new THREE.Vector3(0,0),
     thick : {
     w : 100,
     h : 25
     }
     });

     */
    createLine : function(param) {

        var color = param.color;

        var start = param.start;
        var end = param.end;


        var line_vector = new THREE.Vector3();

        line_vector = line_vector.subVectors(start,end);

        var line = ramb3d.util.createDummy();


        var dummy_root = ramb3d.util.createDummy(
            {
                parent:line,
                position: start
            }
        );


        var dummy = ramb3d.util.createDummy(
            {
                parent:dummy_root
            }
        );
        dummy.rotation.y = THREE.Math.degToRad(90);


        var dark_color = new THREE.Color(0x000000);

        //측면
        ramb3d.util.createPlane({
            width : line_vector.length(),
            height : param.thick.h,
            parent: dummy,
            position : new THREE.Vector3(param.thick.h/2,0,param.thick.w/2),
            color :  (new THREE.Color).copy(color).lerp(dark_color,0.1).getStyle()
        });

        //반대편
        ramb3d.util.createPlane({
            width : line_vector.length(),
            height : param.thick.h,
            parent: dummy,
            position : new THREE.Vector3(param.thick.h/2,0,-param.thick.w/2),
            color :  (new THREE.Color).copy(color).lerp(dark_color,0.1).getStyle()
        }).rotation.x = THREE.Math.degToRad(180);


        //상단
        ramb3d.util.createPlane({
            width : line_vector.length(),
            height : param.thick.w,
            centerOrigin : '0%,-50%',
            parent: dummy,
            position : new THREE.Vector3(param.thick.h/2,param.thick.h/2,0),
            color : color.getStyle()
        }).rotation.x = THREE.Math.degToRad(-90);

        //하단
        ramb3d.util.createPlane({
            width : line_vector.length(),
            height : param.thick.w,
            centerOrigin : '0%,-50%',
            parent: dummy,
            position : new THREE.Vector3(param.thick.h/2,-param.thick.h/2,0),
            color : color.getStyle()
        }).rotation.x = THREE.Math.degToRad(90);


        //앞
        ramb3d.util.createPlane({
            width : param.thick.w,
            height : param.thick.h,
            centerOrigin : '-50%,-50%',
            parent: dummy,
            position : new THREE.Vector3(0,0,0),
            color : (new THREE.Color).copy(color).lerp(dark_color,0.2).getStyle()
        }).rotation.y = THREE.Math.degToRad(-90);

        ramb3d.util.createPlane({
            width : param.thick.w,
            height : param.thick.h,
            centerOrigin : '-50%,-50%',
            parent: dummy,
            position : new THREE.Vector3(line_vector.length(),0,0),
            color : (new THREE.Color).copy(color).lerp(dark_color,0.2).getStyle()
        }).rotation.y = THREE.Math.degToRad(90);



        var mat_lookat = new THREE.Matrix4();
        mat_lookat.lookAt( start, end, dummy_root.up ); // 행렬만들기


        dummy_root.rotation.setFromRotationMatrix( mat_lookat, dummy_root.rotation.eulerOrder ); //라인 위치 잡도록 룩엣 행렬적용
        //dummy_root.rotation.setEulerFromRotationMatrix( mat_lookat, dummy_root.rotation.eulerOrder ); //라인 위치 잡도록 룩엣 행렬적용


        return line;

    },

    createWall : function(param){

        console.log('createWall')
        // side
        var width = param.width; // 780px
        var height = param.height; // 500px
        var thickness = param.thickness; // 300px


        var Wall = ramb3d.util.createDummy();

        var dummy_root = ramb3d.util.createDummy(
            {
                parent:Wall,
                position: new THREE.Vector3(0,0,0)
            }
        );


        var side = ramb3d.util.createDummy(
            {
                parent:dummy_root
            }
        );

        var back = ramb3d.util.createDummy(
            {
                parent:dummy_root
            }
        );

        var bottom = ramb3d.util.createDummy(
            {
                parent:dummy_root
            }
        );



        // 배경 - 측면
        ramb3d.util.createPlane({
            width : thickness,
            height : height,
            centerOrigin : '0%,-100%',
            parent: side,
            color :  param.color,
            pattern : param.pattern,
            gap : param.gap
        });

        // 배경 - 뒷면
        ramb3d.util.createPlane({
            width : width,
            height : height,
            centerOrigin : '0%,-100%',
            position:new THREE.Vector3(thickness-width/2,0,width/2),
            parent: back,
            color :  param.color,
            pattern : param.pattern,
            gap : param.gap
        }).rotation.y = THREE.Math.degToRad(-90);
//            .rotation.y = THREE.Math.degToRad(90);

        // 배경 - 바닥
        ramb3d.util.createPlane({
            width : thickness,
            height : width,
            centerOrigin : '0%,-100%',
            position:new THREE.Vector3(0,width/2,width/2),
            parent: bottom,
            color :  param.color,
            pattern : param.pattern,
            gap : param.gap
        }).rotation.x = THREE.Math.degToRad(90);

        return Wall;
    },
    ///////////////////////////////////
    ///월드 좌표 얻기
    getAbsolutePosition : function(obj3d) {

        var worldPos = new THREE.Vector3(0,0,0);

        worldPos.getPositionFromMatrix(obj3d.matrixWorld);

        return worldPos;
    },
    /////////////////////////////////////////////////////////////////////
    //테스트용으로 정한 오브잭트를 돌려 보게 한다
    setup_controlTest : function(canvas_dom,object) {

        canvas_dom.addEventListener( 'mousedown', onDocumentMouseDown, false );

        function MoveEventHandler(movementX,movementY)
        {
            object.rotation.y += movementX * 0.01;
            object.rotation.x -= movementY * 0.01;

        }

        function onDocumentMouseDown( event ) {

            event.preventDefault();

            canvas_dom.addEventListener( 'mousemove', onDocumentMouseMove, false );
            canvas_dom.addEventListener( 'mouseup', onDocumentMouseUp, false );

        }

        function onDocumentMouseMove( event ) {

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            MoveEventHandler.call(this,movementX,movementY);
//            MoveEventHandler(movementX,movementY);
            //매트릭스 css3 적용
            //object.updateMatrix();
//            Smgr.updateAll();

        }

        function onDocumentMouseUp( event ) {

            canvas_dom.removeEventListener( 'mousemove', onDocumentMouseMove );
            canvas_dom.removeEventListener( 'mouseup', onDocumentMouseUp );

        }

        //터치 디바이스
        document.addEventListener( 'touchstart', onDocumentTouchStart.bind(this), false );
        document.addEventListener( 'touchmove', onDocumentTouchMove.bind(this), false );

        var touchX,  touchY;
        var prev_dist

        function onDocumentTouchStart( event ) {

            event.preventDefault();

            var touch = event.touches[ 0 ];

            touchX = touch.screenX;
            touchY = touch.screenY;

            if(event.touches.length >= 2) {

                var tempx = event.touches[0].pageX - event.touches[1].pageX;
                var tempy = event.touches[0].pageY - event.touches[1].pageY;
                //var dist = Math.sqrt(tempx*tempx + tempy*tempy);
                //prev_dist = dist;
            }

        }

        function onDocumentTouchMove( event ) {

            event.preventDefault();

            if(event.touches.length >= 2) {

                var tempx = event.touches[0].pageX - event.touches[1].pageX;
                var tempy = event.touches[0].pageY - event.touches[1].pageY;
                var dist = Math.sqrt(tempx*tempx + tempy*tempy);

                //moveFront(-(dist - prev_dist));
                prev_dist = dist;
//                WheelEventHandler.call(this,-(dist - prev_dist));

            }
            else {
                var touch = event.touches[ 0 ];

                var movementX =  (touchX - touch.screenX);
                var movementY =  (touchY - touch.screenY);

                touchX = touch.screenX;
                touchY = touch.screenY;

                MoveEventHandler.call(this,movementX,movementY);

                //if(Math.abs(movementX) < 30 && Math.abs(movementY) < 30 ) {
                //    callbackControl(-movementX,-movementY);
                //}


            }



            //var touch = event.touches[ 1 ];
        }

    }
    //end of  setup_controlTest
    ////////////
}

///////벡터 확장
//    (0,0,1) 기준으로 x,y 축의 회전 각도를 구한다.

THREE.Vector3.prototype.getHorizontalAngle = function() {
    var b = new  THREE.Vector3();

    b.y =  THREE.Math.radToDeg(Math.atan2(this.x, this.z));

    if (b.y < 0) {
        b.y += 360
    }
    if (b.y >= 360) {
        b.y -= 360
    }
    var a = Math.sqrt(this.x * this.x + this.z * this.z);
    b.x = THREE.Math.radToDeg(Math.atan2(a, this.y)) - 90;
    if (b.x < 0) {
        b.x += 360
    }
    if (b.x >= 360) {
        b.x -= 360
    }
    return b;
};

////////////////////
//gbox3d fatch start
//커스텀 오브잭트 클로닝
THREE.CSS3DObject.prototype.clone = function() {

    console.log(this.element);
    var clone_obj = new THREE.CSS3DObject(
        this.element.cloneNode(false)
    );

    //슈퍼콜링
    THREE.Object3D.prototype.clone.call(this,clone_obj);

    //console.log('my css3d obj clone');
    return clone_obj;
}

THREE.CSS3DObject.prototype.add = function(object) {

    THREE.Object3D.prototype.add.call(this,object);

    this.element.appendChild(object.element);


    return this;
}

THREE.CSS3DObject.prototype.initElement = function(element) {
    this.element = element;
    this.element.style.position = "absolute";
    this.element.style.WebkitTransformStyle = 'preserve-3d';
    this.element.style.MozTransformStyle = 'preserve-3d';
    this.element.style.oTransformStyle = 'preserve-3d';
    this.element.style.transformStyle = 'preserve-3d';
}




//gbox3d fatch end
//////////////////
