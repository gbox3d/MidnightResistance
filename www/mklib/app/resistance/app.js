/**
 * Created by gbox3d on 2014. 1. 15..
 */


    //http://www.ntrexgo.com/archives/4645

var theApp={}

theApp.UIElement = {}
theApp.UIElement.pageHome = document.getElementById('page-home');
theApp.UIElement.pageIntro = document.getElementById('page-intro');
theApp.UIElement.pageRegisisReader = document.getElementById('page-regsistance-reader');
theApp.UIElement.pageVideo = document.getElementById('page-video');

theApp.CurrentPage = theApp.UIElement.pageHome;

theApp.mkControl = new mk.control({
    app:theApp,
    startPage: theApp.UIElement.pageHome
});

mk.helper.setUpButton(
    {
        target : document.querySelector('#btn-intro'),
        OnClick : function() {
            theApp.mkControl.changePage(theApp.UIElement.pageIntro);
        }
    }
);

mk.helper.setUpButton(
    {
        target : document.querySelector('#btn-resistance'),
        OnClick : function() {
            theApp.mkControl.changePage(theApp.UIElement.pageRegisisReader);

            var slot_window = theApp.UIElement.pageRegisisReader.querySelector('.container-slot')

            theApp.Slot.Smgr.updateAll({
                resize : {
                    width :  slot_window.offsetWidth,
                    height : slot_window.offsetHeight
                }
            });

        }
    }
);

//mk.helper.setUpButton(
//    {
//        target : document.querySelector('#btn-video'),
//        OnClick : function() {
//            theApp.mkControl.changePage(theApp.UIElement.pageVideo);
//        }
//    }
//);

var menugohome_btns = document.querySelectorAll('.mk-ui-backButton');

for(var i=0 ; i< menugohome_btns.length;i++) {

    mk.helper.setUpButton(
        {
            target : menugohome_btns[i],
            OnClick : function() {
                theApp.mkControl.backPage();

            }
        }
    );
}


theApp.UIElement.pageVideo._mkattr_myScroll = new iScroll( theApp.UIElement.pageVideo.querySelector('.mk-content') );

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);



