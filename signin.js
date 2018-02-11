$(document).ready(init);

var fs = false;
var fsLoc = [0,0];
var chatOpen = true;
var iconSelected = false;
var homeOpen = false;

function init(){
    $('.square:nth-child(4)').on('click',minimize);
    $('.open-app').on('click',minimize);
    $('.square:nth-child(3)').on('click',maximize);
    $('.begin-menu li').on('click',setWallpaper);
    $('.begin-button').on('click',openBeginMenu);
    $(document).on('click',deselect);
    $('.desktop-icon p').on('click',highlightIcon);
    $('.chat, .home').on('dblclick',openApp);
    $('.square:nth-child(2)').on('click',closeWindow);
    $('.container , .home-container').on('mousedown',focusWindow);
    $('.color').on('click',selectColor);
    $('.submit').on('click',enterChat);

    $('.container, .home-container').draggable({
        cancel: '.container div, .container div *, .home-container div, .home-container div *'
    });

    if (localStorage.getItem('userName')) {
        $('input').val(localStorage.getItem('userName'));
    }

    if (localStorage.getItem('background')) {
        $('body').addClass(localStorage.getItem('background'));
    }

    timeNow()

    var timeKeeper = setInterval(timeNow,30000);
}

function minimize(){
    let obj = $(this).attr('class').split(' ')[0]
    let app;

    if (obj === 'square'){
        app = $(this).parent().attr('class').split(' ')[1]
        let otherapp = app === 'chatapp' ? 'homeapp' : 'chatapp';
        $(this).parent().hide().css('z-index','10');
        $('.open-app.'+app).addClass('close-app');
        if ($('#desktop > .'+ otherapp).css('display') !== 'none'){
            $('.open-app.'+otherapp).removeClass('close-app').css('z-index','20');
        }
    } else {
        app = $(this).attr('class').split(' ')[1];
        let otherapp = app === 'chatapp' ? 'homeapp' : 'chatapp';
        if ($(this).hasClass('close-app')){
            $('#desktop > .'+app).show().css('z-index','20');
            $(this).removeClass('close-app');
            $('#desktop > .'+ otherapp).css('z-index','10');
            $('.open-app.'+otherapp).addClass('close-app');
        } else {
            $('#desktop > .'+app).hide().css('z-index','10');
            $('#desktop > .'+ otherapp).css('z-index','20');
            $(this).addClass('close-app');
            if ($('#desktop > .'+ otherapp).css('display') !== 'none'){
                $('.open-app.'+otherapp).removeClass('close-app');
            }
        }
    }
}

function maximize(){
    app = $(this).parent().attr('class').split(' ')[1];

    if (fs) {
        $('#desktop > .'+app).attr('style','top: '+fsLoc[0]+'; left: '+fsLoc[1]+'; display: block; z-index: 20');
        fs = false;
    } else {
        fsLoc = [$('#desktop > .'+app).css('top'),$('#desktop > .'+app).css('left')]
        $('#desktop > .'+app).css({'width':'100%','height':'100%','top':'0','left':'0'});
        fs = true;
    }
}

function enterChat(){
    let name = $('#namefield').val();
    if (name.length > 2) {
        $('.warning').text('');
        localStorage.setItem('userName',name);
        // $('#namefield').val('');
        $('.mainbody').hide();
        $('iframe').attr('src','./main-chat.html');
        $('.chatbody').show();
    } else {
        $('.warning').text('User name must be at least 3 characters');
    }


}

function selectColor(){
    $('.color').removeClass('selected');
    $(this).addClass('selected');
    let color = $(this).attr('class').split(' ')[1];
    localStorage.setItem('color',color);
}


function timeNow(){
    let d = new Date();
    let hour = d.getHours();
    let min = d.getMinutes();
    let ampm = 'am';
    if (hour > 12){
        ampm = 'pm';
        hour -= 12;
    }
    if (min < 10 && min > 0){
        min = '0' + min;
    } else if (!min){
        min = '00';
    }
    $('.time-box span').text(`${hour}:${min}${ampm}`);
}


function setWallpaper(){
    let newClass = $(this).text();
    $('body').attr('class','');
    $('body').addClass(newClass);
    console.log(newClass);
    localStorage.setItem('background',newClass);
}

function openBeginMenu(event){
    event.stopPropagation();
    $('.begin-menu').toggle();
}

function deselect(){
    $('.begin-menu').hide();
    $('.desktop-icon p').removeClass('highlighted');
    iconSelected = false;
}

function highlightIcon(event){
    if (iconSelected){
        deselect();
    }
    event.stopPropagation();
    let icon = $(event.target).parent().attr('class').split(' ')[1];
    $('.' + icon + ' p').addClass('highlighted');
    iconSelected = true;
}

function closeWindow(){
    let app = $(this).parent().attr('class').split(' ')[1];
    if (app === 'chatapp'){
        $('.mainbody').show();
        $('iframe').attr('src','');
        $('.chatbody').hide();
        $('.open-app.chatapp').hide();
        chatOpen = false;
    } else {
        $('.open-app.homeapp').hide();
        homeOpen = false;
    }
    $(this).parent().hide();
}

function openApp(){
    let app = $(this).attr('class').split(' ')[1];
    console.log(app);
    if (app === 'chat'){
        if (!chatOpen){
            chatOpen = true;
            $('.container').attr('style','');
            $('.home-container').css('z-index','10');
            $('.container').css('z-index','20');
            $('.open-app.chatapp').css('display','inline-block');
            $('.open-app.chatapp').removeClass('close-app');
            $('.open-app.homeapp').addClass('close-app');
        }
    } else {
        if (!homeOpen){
            homeOpen = true;
            $('.home-container').attr('style','');
            $('.container').css('z-index','10');
            $('.home-container').css('z-index','20');
            $('.home-container.homeapp').show();
            $('.open-app.homeapp').css('display','inline-block');
            $('.open-app.chatapp').addClass('close-app');
            $('.open-app.homeapp').removeClass('close-app');
        }
    }
}

function focusWindow(){
    let target = $(this).attr('class').split(' ')[0];
    console.log(target);
    if (target === 'container'){
        $('.container').css('z-index','20');
        $('.home-container').css('z-index','10');
        $('.open-app.chatapp').removeClass('close-app');
        $('.open-app.homeapp').addClass('close-app');
    } else {
        $('.container').css('z-index','10');
        $('.home-container').css('z-index','20');
        $('.open-app.chatapp').addClass('close-app');
        $('.open-app.homeapp').removeClass('close-app');
    }
}
