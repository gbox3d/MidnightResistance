/**
 * Created by gbox3d on 2014. 1. 23..
 */

function SlotController(param) {

    function makeSlot(option) {

        var slot_dummy = ramb3d.util.createDummy();
        var angle_div = (360)/option.colors.length;
        //씬노드 추가
        for(var i=0;i< option.colors.length; i++) {

            var object = ramb3d.util.createPlane({
                name : 'plane',
                width : 64,
                height : 32,
                color : option.colors[i],
                parent : slot_dummy
            });

            var rotM = (new THREE.Matrix4()).makeRotationFromEuler(
                new THREE.Euler(THREE.Math.degToRad(i*angle_div),0,0,"XYZ"));

            var trnM = (new THREE.Matrix4()).makeTranslation(0,0,option.radius);

            var resultM = (new THREE.Matrix4()).multiplyMatrices(rotM,trnM);

            object.applyMatrix(resultM);

        }
        return slot_dummy;
    }

    this.slot_root = ramb3d.util.createDummy();

    var slotObj = makeSlot({
        colors:[
            '#000000',
            '#6B0108',
            '#ff0000',
            '#fdc71f',
            '#ffff00',
            '#0e9000',
            '#0000fe',
            '#8a008d',
            '#898c89',
            '#ffffff'
        ],
        radius : 50
    });

    var input_panel = ramb3d.util.createPlane({
        width : 64,
        height : 256,
        //color : 'red',
        render_type : 'css3'

    });

    input_panel.element.style.backgroundColor = '';
    //input_panel.element.style.border= '1px solid black';

    input_panel.position.z = 55;

    this.slot_root.add(input_panel);
    this.slot_root.add(slotObj)

    this.slotContolObj = new setupSlotControl(input_panel.element,slotObj);

    function setupSlotControl(canvas_dom,object) {

        canvas_dom.addEventListener( 'mousedown', onDocumentMouseDown, false );

        function MoveEventHandler(movementX,movementY)
        {
//            object.rotation.y += movementX * 0.01;
            object.rotation.x += movementY * 0.01 * 3;

            if(object.rotation.x < 0 ) {
                object.rotation.x = 0;
            }
            else if(object.rotation.x > THREE.Math.degToRad(360) ) {
                object.rotation.x = THREE.Math.degToRad(360);
            }
        }


        function ReleaseEvent() {

            var value = Math.round(((object.rotation.x / THREE.Math.degToRad(360)) * 10));

            console.log( (object.rotation.x / THREE.Math.degToRad(360)) * 10 );

            object.rotation.x = value * (THREE.Math.degToRad(36));

            param.cbRelease();

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
        }

        function onDocumentMouseUp( event ) {

            ReleaseEvent();



            canvas_dom.removeEventListener( 'mousemove', onDocumentMouseMove );
            canvas_dom.removeEventListener( 'mouseup', onDocumentMouseUp );

        }

        //터치 디바이스
        canvas_dom.addEventListener( 'touchstart', onDocumentTouchStart.bind(this), false );
        canvas_dom.addEventListener( 'touchmove', onDocumentTouchMove.bind(this), false );
        canvas_dom.addEventListener( 'touchend', function(event) {
            ReleaseEvent();
        }, false );

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
            }

        }

        function onDocumentTouchMove( event ) {

            event.preventDefault();

            if(event.touches.length >= 2) {

                var tempx = event.touches[0].pageX - event.touches[1].pageX;
                var tempy = event.touches[0].pageY - event.touches[1].pageY;
                var dist = Math.sqrt(tempx*tempx + tempy*tempy);

                prev_dist = dist;

            }
            else {
                var touch = event.touches[ 0 ];

                var movementX =  (touchX - touch.screenX);
                var movementY =  (touchY - touch.screenY);

                touchX = touch.screenX;
                touchY = touch.screenY;

                MoveEventHandler.call(this,movementX,-movementY);

            }
        }

        this.getValue = function() {

            var value = Math.round(((object.rotation.x / THREE.Math.degToRad(360)) * 10));

            value %= 10;

            return value;

        }


    }

}


function OnRelease() {

    console.log(theApp.Slot.control[0].slotContolObj.getValue() + ','
        + theApp.Slot.control[1].slotContolObj.getValue() + ','
        + theApp.Slot.control[2].slotContolObj.getValue() );

    var text_result_node = theApp.UIElement.pageRegisisReader.querySelector('.text-result');

    text_result_node.innerText = theApp.Slot.control[0].slotContolObj.getValue() + ''
        + theApp.Slot.control[1].slotContolObj.getValue() + ' X 10^'
        + theApp.Slot.control[2].slotContolObj.getValue();



}

theApp.Slot = {};


console.log(theApp.UIElement.pageRegisisReader.querySelector('.container-slot').offsetWidth);
console.log(theApp.UIElement.pageRegisisReader.querySelector('.container-slot').offsetHeight);


theApp.Slot.Smgr = new ramb3d.scene.SceneManager({
    renderer : {
        container : theApp.UIElement.pageRegisisReader.querySelector('.container-slot'),
        bkg_color : '#bbbbbb',
        type : 'css3'
    },
    window_size : {
        width : theApp.UIElement.pageRegisisReader.querySelector('.container-slot').offsetWidth,
        height: theApp.UIElement.pageRegisisReader.querySelector('.container-slot').offsetHeight
    },camera : {
        fov : 45,
        far : 5000,
        near : 1,
        position : new THREE.Vector3(0, 0, 500),
        lookat : new THREE.Vector3()

    }
});

theApp.Slot.control = [
    new SlotController({
        cbRelease : OnRelease
    }),
    new SlotController({
        cbRelease : OnRelease
    }),
    new SlotController({
        cbRelease : OnRelease
    })
];

theApp.Slot.Smgr.scene.add(theApp.Slot.control[0].slot_root);
theApp.Slot.control[0].slot_root.position.x = -64;
theApp.Slot.Smgr.scene.add(theApp.Slot.control[1].slot_root);
theApp.Slot.control[1].slot_root.position.x = 0;
theApp.Slot.Smgr.scene.add(theApp.Slot.control[2].slot_root);
theApp.Slot.control[2].slot_root.position.x = 64;

//루핑
(function loop() {

    //씬업데이트
    theApp.Slot.Smgr.updateAll();

    requestAnimationFrame(loop);
})();