// ==UserScript==
// @name            Collect Accuray Places
// @author          olecom
// @namespace       accuray
// @description     Collect Accuray Places
// @match           http://accuray.com/treatment-centers*
// @version         0.1
// ==/UserScript==

function uglify_js(w ,doc ,con ,store){
var v, current_page = qs('.pager-current').innerHTML

    v = store['____CAPn']
    if(!v){
        con.log('goto the first page')
        store['____CAPn'] = '0'
        return w.location = '/treatment-centers'
    } else if(v != current_page){// goto to last processed page
        return w.location = '/treatment-centers?page=' + (+v - 1)
    }
    v = null

    if(store['____CAP']){
        con.log('process this page')
        doThis_GoNext()
    }
    return info()

function info(msg){
var x, el = gi("____CAP")

    if(!el){
        x = cl("div")
        x.setAttribute("style",
            "font-size:10pt; background-color:#77FF00; position:fixed;" +
            "top:21px;left:7px;z-index:77;padding:2px"
        )
        qs('body').appendChild(x)

        el = cl("div")
        el.onclick = onExport
        el.setAttribute("style", "color:white;font-size:10pt;" +
"background-color:green; padding:2px; border: 2px dashed;"
        )
        el.innerHTML = '== Export Collected =='
        x.appendChild(el)

        el = cl("div")
        el.onclick = onStartStop
        el.setAttribute("id", "____CAP")
        el.setAttribute("style", "font-size:10pt;color:white;background-color:red;padding:7px")
        el.innerHTML = '<span style="color:blue">== Auto Collecting ==</span><br>'
+'<div>'
+ "To <b>" + (store['____CAP'] ? 'STOP' : 'Start') + "</b> collecting info press ME!"
+ "<br>"
+ "Current page: " + current_page
+ "<br>"
+ "Last page: " + store['____CAPn']
+'</div>'
        x.appendChild(el)
    }
    if(msg){
        el.innerHTML += msg
    }
    return el
}

function onExport(){
var me = this, el

    me.onclick = function(){
        el.focus()
        el.select()
    }
    me.innerHTML = 'Please wait...'
    el = gi("____CAP")
    el.innerHTML = '' +
'  <textarea style="position:absolute; top:-12px; width:1px;height:1px;">' +
'     copy|paste' +
'  </textarea>'
    el = el.children['0']//textarea
    setTimeout(exportData, 512)

    return

    function exportData(){
    var pg, ar, t, i, j, s
       ,re = new RegExp(
'<div class="address-line-1">([^<]*)<[/]div>[^<]*' +// 1
'<div class="address-line-2">([^<]*)<[/]div>[^<]*' +// 2
'<div class="address-line-3">([^<]*)<[/]div>[^<]*' +// 3
'<div class="address-city-state-zip">([^,]*), *([^<]*)<[/]div>[^<]*' +// 4, 5
'<div class="address-country">([^<]*)<[/]div>'     // 6
       )

        s = '', i = 0
        for(t in store) if('__' == t.slice(0, 2) && (pg = JSON.parse(store[t]))){
            for(j = 0; j < pg.length; ++j){
                ar = pg[j].match(re)
                if(!ar) continue
                i++
                s +=(
ar[4] +'\t'+ ar[6] +'\t'+ ar[1] +'\t'+ ar[2] +'\t'+ ar[3] +'\t'+ ar[5] +'\n'
                )
            }
        }
        el.onkeydown = onkeydown
        me.innerHTML =
'Press CTRL + C to copy ' + i +' results into clipboard'
        el.value = s
        el.focus()
        el.select()

        return
    }

    function onkeydown(ev){
        if(ev.ctrlKey && 67 == ev.keyCode){
            setTimeout(function clean_export(){
                me.innerHTML = 'Copied'
                el = me = null
            }, 12)
        }
    }
}

function onStartStop(){
var sts = store['____CAP']

    if(!sts){
        con.log('start')
        store['____CAP'] = 'runs'

        return doThis_GoNext()
    }
    con.log('stop')
    return delete store['____CAP']
}

function doThis_GoNext(){
var i, el, items

    el = qa('.location-address')
    if(el.length){
        items = new Array(el.length)
        for(i = 0; i < el.length; ++i){
            items[i] = el[i].innerHTML.replace(/   */g, ' ').replace(/\n/g, '')
        }
        store['__' + current_page] = JSON.stringify(items)
        store['____CAPn'] = current_page
    }

    el = qs('.pager-next')
    if(el){
        con.log('goto next page')
        el = el.children[0]
        el.focus()
        return setTimeout(function(){
            el.dispatchEvent(mkClick())
        }, 1024)
    }
    con.log('stop last page')
    delete store['____CAP']

    return con.log('stop: the end')
}

function mkClick(){
    var ev = ce("MouseEvents")
    ev.initMouseEvent("click", true, true, w, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    return ev
}
function gi(i){ return doc.getElementById(i) }
function qs(s){ return doc.querySelector(s) }
function qa(s){ return doc.querySelectorAll(s) }
//function gs(n){ return doc.getElementsByTagName(n) }
function ce(v){ return doc.createEvent(v) }
function cl(t){ return doc.createElement(t) }
}

uglify_js(window, document, console, localStorage)
