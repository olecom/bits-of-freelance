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
   ,data = getData()
   ,xhr  = new XMLHttpRequest

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

        el = cl("div")
        el.onclick = onShowGeoLoc
        el.innerHTML = '== GEO =='
        x.appendChild(el)
        if(!store['____GEO']){
            store['____GEO'] = '0'
        }

        el = cl("div")
        el.onclick = onExportGeoMsg
        el.innerHTML = '<div id="____GEOMSG">== Export GEO ==</div>'
+'<br><textarea id="____GEOEXP" style="width:256px;height:77px;"></textarea>'
        x.appendChild(el)
    }
    if(msg){
        el.innerHTML += msg
    }
    return el
}

function onExportGeoMsg(){
    gi('____GEOMSG').innerHTML = 'Please wait...'
    setTimeout(onExportGeo, 512)
}

function onExportGeo(){
var i, d = '', el = gi('____GEOEXP'), geo

    for(i = 1; i < data.length - 1; ++i){// skip last empty string
        if((geo = JSON.parse(store['_G_' + i]).results[0])){
            d += JSON.stringify(geo.geometry.location) + '\t' + geo.formatted_address + '\n'
        } else {
            d += '\t-no-info-\n'//empty item
        }
    }
    el.value = d
    el.focus()
    el.select()

    return
}

function onShowGeoLoc(){
var i, d

    i = +store['____GEO'] + 1
    con.log('geo: ', i)
    d = data[i]
    if(d){
        d = d.split('\t')
        xhr.open('GET',formatQuery(d[0], d[1], d[2]), false)
        xhr.send()
        store['_G_' + i] = xhr.responseText
        store['____GEO'] = '' + i
        setTimeout(onShowGeoLoc, 1024)
    }
    return

    function formatQuery(cntr, city, addr){
        return 'https://maps.googleapis.com/maps/api/geocode/json'
+'?address=' + city + '+' + addr.replace(/  */g, '+')
+'&components=country:' + cntr
+'&sensor=false'
    }
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

function getData(){
    return [
"Alpha-2 code	city	address-line-1	address-line-2	address-line-3	state-zip",
"AU	Gosford	41 William Street			New South Wales 2250",
"AU	Herston	Butterfield Street			Queensland 4006",
"AU	Liverpool	Corner Campbell &amp; Goulburn Streets			New South Wales ",
"AU	Perth	Hospital Ave, Nedlands			WA 6009",
"BE	Brussels	Laarbeeklaan 101	1090 Brussels		",
"BE	Brussels	10 Ave Hippocrate			B-1200",
"BE	Edegem	Wilrijkstraat 10			2650",
"BE	Liege	Domaine Universitaire du Sart Tilman, B. 35			b-4000",
"BE	Verviers	Rue du Parc, 29			4800",
"CA	Edmonton	11560 University Avenue			Alberta T6G 1Z2",
"CA	Greenfield Park	3120 Boulevard Taschereau			QC J4V 2K7",
"CA	Hamilton	711 Concession Street			Ontario L8V 1C3",
"CA	London	790 Commissioners Road East			Ontario N6A 4L6",
"CA	Montreal	1650 Cedar Avenue			Quebec H3G 1A4",
"CA	Montreal	1560 Sherbrooke Street East			Quebec ",
"CA	Ottawa	501 Smyth Road			Ontario K1H 8L6",
"CA	Toronto	2075 Bayview Ave			Ontario M4N 3M5",
"CN	Beijing	Bei Xi Huan ZhongLU 100			100045",
"CN	Beijing	No.69, Yongding Road			Haidian District ",
"CN	Beijing	No.1 Shuaifuyuan Wangfujing			Dongcheng District 100730",
"CN	Beijing	28 FuXing Road, Haidian District			100853",
"CN	BeiJing	No8, Dong Da Jie, Feng Tai District			",
"CN	Beijing	No5 Nan Men Cang			East City District ",
"CN	Beijing	No.30 Fucheng Road, Haidian District			100142",
"CN	Beijing	NO.17 Panjiayuannanli			Chaoyang District ? 100021",
"CN	Guang Zhou	111 LiuHua Road			510010",
"CN	Kunming	No 295 Xichang Road			650032",
"CN	Lanzhou City	Binhe South Road, Qili He District			Gansu Province ",
"CN	Luoyang	Hi-tech zones			Heinan ",
"CN	Nanjing	Zhongshan East Road.305#			Jiangsu, 210002",
"CN	NanJing	Yang Gong Jing 34 Biao 34 Hao			",
"CN	Nanning	10 Hua Dong Road			Guangxi 530011",
"CN	Shanghai	174 Changhai Road, Yang Pu District			",
"CN	Shanghai	525 Hong Fend Road Pudong District			201206",
"CN	Shanghai	180 Fenglin Road			",
"CN	ShengHe	No 83 WenHua Road			110015",
"CN	Tianjin	Huan Hu Xi Road	TiYuanBei, HeXi District		300060",
"CN	Yantai	7 South ZhichuRoad, Zhifu district			ShanDong ",
"CO	Medellin	Cll 56 # 46 – 37			",
"CZ	Ostrava	17, Listopadu 1790			70852",
"SV	San Salvador	Tercera Calle Poniente, Block No 122			Colonia Escalon, Zona 11. ",
"FI	Kuopio	Puijonlaaksontie 2 Cancer Center / 1			70210",
"FR	Bordeaux	229, Cours d’Argonne			Cedex 33076",
"FR	Bordeaux	15 Rue Claude Boucher			33077",
"FR	Caen	3 Avenue General Harris			14076",
"FR	Dechy	Route de Cambrai			59187",
"FR	Fort de France	97 261 Fort-de-France Cedex			",
"FR	Levallois-Perret	4 Rue Kleber			",
"FR	Lille	3 rue F. Combemale			Cedex F 59020",
"FR	Lyon	28 rue Laennec			69373",
"FR	Marseille	Chemin des Bourrely			13015",
"FR	Mulhouse	20 Avenue du Docteur Rene Laennec			",
"FR	Nancy	6 Avenue de Bourgogne			Cedex 54519",
"FR	Nice	33, avenue de Valombrose			cedex 2 06189",
"FR	Orleans	14 Avenue de l'Hopital			45000",
"FR	Paris	26 rue d’Ulm			Cedex 75005",
"FR	Paris	47-83, boulevard de l’Hopital	75651 PARIS Cedex 13		14076",
"FR	Reims	1 Rue du General Koenig			51056",
"FR	Rennes	Rue de la Baaille Flandres-Dunkerque			35042",
"FR	Saint Herblain	Boulevard J. Monod			Nantes 44805",
"FR	Strasbourg	3 Rue de la Porte de l'Hopital			",
"FR	Toulouse	2024 Rue du Pont Saint Pierre			Toulouse ",
"FR	Toulouse	1, avenue Irene Joliot-Curie			31059",
"FR	Tours	2 boulevard Tonnelle - 37044 Tours France			37044 Cedex 9",
"FR	Villejuif	114, rue Edouard-Vaillant			94805",
"DE	Bamberg	Buger Str. 82			96049",
"DE	Berlin	Augustenburger Platz 1			13353",
"DE	Berlin	Kadiner Stra?e 23	Strahlentherapie		10243",
"DE	Berlin	Schwanebeker Chaussee, 50			13125",
"DE	Boeblingen	Bunsenstr. 215			71032",
"DE	Bonn	Sigmund Freud Str 25			",
"DE	Erfurt	Nordhaeuser Strasse 74			99089",
"DE	Essen	Hufelandstr. 55			D-45122",
"DE	Frankfurt	Schleusenweg 2-16 Uniklinik Frankfurt am Main			60528",
"DE	Goppingen	Eichertstrasse 3			73035",
"DE	Goppingen	CyberKnife Suedwest	Eichertstrasse 3		73035",
"DE	Gustrow	Friedrich-Trendelenburg-Allee 2	D- 18273		Mecklenburg / Vorpommern 18273",
"DE	Hamburg	Langenhorner Chaussee 369			22419",
"DE	Hamburg	Martinistrasse 52			D-20246",
"DE	Heidelberg	Im Neuenheimer Feld 400			Baden-Wuerttemberg 69120",
"DE	Idar-Oberstein	Strahlentherapie	Dr.-Ottmar-Kohler-Str. 2		D-55743",
"DE	Koln	Kerpener Str. 62			50924",
"DE	Konstanz	Haydnstr. 2			Baden-Wuerttemberg D-78464",
"DE	Magdeburg	Leipzigerstr. 44, D-39112			",
"DE	Munich	Max-Lebsche-Platz 31			",
"DE	Munich	Ismaninger Str. 22			81675",
"DE	Munster	Albert - Schweitzer - Str. 33			DE 48149",
"DE	Soest	Senator-Schwartz-Ring 8			59494",
"GR	Athens	54 Ethnikis Antistaseos	15231 Chalandri		",
"HK	Hong Kong	40 Stubbs Road			",
"HK	Kowloon	30 Gascoigne Road			Hong Kong ",
"HK	Li Shu Pui Block	2 Village Road			Happy Valley ",
"IN	Bangalore	HCG Tower,N.8.P.Kalinga Rao Rd. Sampangiramanagar			",
"IN	Chennai	New no 6, Old no 24, Cenotaph Road, Teynampet			600018",
"IN	Gurgaon	Sector 38			Haryana 122 001",
"IN	Hyderabad	Road No 12, MLA Colony, Banjara Hills			Andhra Pradesh 500034",
"IN	Kolkata 700 020	Regd. Office: 1, Bishop Lefroy Road			West Bengal ",
"IN	New Delhi	5, Pusa Road, Rajinder Nagar			110005",
"IN	Parel	Dr. E Borges Road			Mumbai, 410208",
"IE	Dublin	Old Lucan Road			D20",
"IT	Ancona	Via Conca, 71			60126",
"IT	Aosta	Viale Ginevra Viale Ginevra 3			AO ",
"IT	Aviano	Via Pedemontana Occ. 12			PD 33081",
"IT	Bari	C.B.H. Citta di Bari Hospital spa Via Hahnemann10			70126",
"IT	Brescia	P. Le Spedali Civili, 1			",
"IT	Candiolo	Strada Provinciale, 142 km 3,95			Torino 10060",
"IT	Candiolo	Strada Provinciale 142 - Km. 3,95			TO 10060",
"IT	Casavatore	Via Taverna Rossa 169			NA 80020",
"IT	Firenze	Via del Pergolino 4.			50139",
"IT	Firenze	Largo Brambilla, 3			50134",
"IT	Genova	Largo Rosanna Benzi, 10			GE 16132",
"IT	Lucca	Via dell’ Ospedale			LU 55100",
"IT	Meldota	Via Piero Maroncelli, 40			FC 47014",
"IT	Messina	Via Consolare Valeria			98122",
"IT	Milano	Via Saint Bon 20			20147",
"IT	Milano	Via Ripamonti 435			20141",
"IT	Milano	11, Via Celoria			Lombardia 20133",
"IT	Milano	Via Olgettina 60			20132",
"IT	Modena	Via del Pozzo, 71			41125",
"IT	Naples	Via Mariano Semmola			80131",
"IT	Palermo	Via Parlavecchio 143			Sicily 90127",
"IT	Ravenna	Viale Vincenzo Randi, 5			",
"IT	Reggio Emilia	Viale Risorgimento 57			RE 42100",
"IT	Rome	Circonvallazione Gianicolense 87			RO 00512",
"IT	Vicenza	Ospedale Civile San Bortolo	Vle Rodolfi 37		36100",
"JP	Chousei-gun	550-1 Kouri, Nagara-machi			Chiba 297-0203",
"JP	Daito-shi	2-10-50, Tanigawa			Osaka 574-0074",
"JP	Date-shi	23-1, Hakozaki Aza Higashi			Fukushima 960-0686",
"JP	Edogawa-ku	2-24-18 Higashi-koiwa			Tokyo 133-0052",
"JP	Fuefuki-shi	436 Kokufu Kasugai-cho			Yamanashi 406-0014",
"JP	Fukui-shi	7-1 Funahashi, Wadanaka-cyo,			Fukui 918-8503",
"JP	Fukuoka-shi	3-1-1 Maidashi, Higashi-Ku			Fukuoka 812-8582",
"JP	Funabashi-shi	618-1 Hongo-cyo			Chiba 273-0033",
"JP	Hidaka-shi	1397-1 yamane			Saitama 350-1298",
"JP	Hitachi-shi	841 Momiya-cho			Ibaraki 319-1235",
"JP	Ichinomiya-shi	2-2-22, Bunkyo			Aichi 491-8558",
"JP	Imbari-shi	7-1-6 Kitamura			Ehime 799-1592?",
"JP	Kamakura-shi	1370-1, Okamoto			Kanagawa 247-8533",
"JP	Kawasaki-shi	255 Furusawa, Asao-ku			Kanagawa 215-0026",
"JP	Kitakyushu-shi	2-5-1 Sawami, Tobata-ku			Fukuoka 804-0093",
"JP	Koriyama-shi	1-1-17 Ekimae			Fukushima 963-8585",
"JP	Kumagaya-shi	1120 Dai			Saitama 360-0804",
"JP	Kumamoto-shi	7-90-2 Izumi			Kumamoto 862-0941",
"JP	Kumamoto-shi	5-3-1, Chikami			Kumamoto 861-4193",
"JP	Kure-shi	3-1 Aoyama-cho			Hiroshima 737-0023",
"JP	Kurume City	21 3-3-8 Miyanozin			Fukuoka 839 0801",
"JP	Kyoto-shi	126 Shimotoba Kamimisu-cho, Fushimi-ku			Kyoto 612-8473",
"JP	Machida-shi	27-1 Negishi-machi			Tokyo 194-0034",
"JP	Matsumoto	2-5-1 Honjyo,			Nagano 390-8510",
"JP	Minokamo City	590 Shimokobi, Kobi-Cho			Gifu 505-0034",
"JP	Miyakonojo-shi	17-1, Hayasuzu			Miyazaki 885-0055",
"JP	Nagoya-shi	1-1 Kanakoden, Chikusa-ku			Aichi 464-8681",
"JP	Nagoya-shi	1 Aza Kawasumi, Mizuho-cho, Mizuho-ku			Aichi 467-8602",
"JP	Nagoya-shi	2-9 Myoken-cho, Syowa-ku			Aichi 466-8650",
"JP	Obihiro	7-5 Inadacho-Kisen			Hokkaido 080-0833",
"JP	Oita City	3-7-11 Nishi Tsurusaki			Oita 870-0192",
"JP	Okayama City	567-1, Kurata, Naka-ku			Okayama 703-8265",
"JP	Osaka	8-1 Tamagawa Shinmach Takatsuki-shi			Osaka 569-0856 &nbsp;",
"JP	Sendai-shi	4-21 Kamiyagari Aza Mukaihara, Izumi-ku			Miyagi 981-3121",
"JP	Shimajiri-gun	171-1 Aza Hokama, Yaese-cho			Okinawa 901-0417",
"JP	Suita-shi	2-15 Yamadaoka			Osaka&nbsp; 565-0871?",
"JP	Suzuka-shi	1275-53, Yamanoue, Yasuzuka-cho			Mie 513-0818",
"JP	Takasaki-shi	886 Nakao-machi			Gunma 370-0001",
"JP	Tokyo	4-1-22 Hiroo, Shibuya-ku			Tokyo 150-8935?",
"JP	Tokyo	18-22,Honkomagome 3-chome	Bunkyo-ku		113-867",
"JP	Towada-shi	14-8 Nishi Juniban-cho			Aomori 034-0093",
"JP	Toyama-shi	1837-5, Hiyodorijima			Toyama 930-0885",
"JP	Toyohashi-shi	134 Haneihunmachi			Aichi 441-8029",
"JP	Toyokawa-shi	100-1 Kozakai-cho Doji			Aichi 441-0195",
"JP	Tsushima-shi	3-73 Tachibana-cho			Aichi 496-8537",
"JP	Ube-shi	108 Ooaza Tsumasaki-kaisaku			Yamaguchi 759-0204",
"JP	Uji-shi	36-26 Uji-Satojiri			Kyoto 611-0021",
"JP	Yokohama-shi	3-6-1 Shimo Sueyoshi, Turumi-ku			Kanagawa 230-8765",
"JP	Yokohama-shi	574-1 Ichizawa-cho, Asahi-ku			Kanagawa&nbsp; 241-0014",
"MY	Kuala Lumpur	39, Jalan Kia Peng			50450",
"MY	Petaling Jaya	No.1, Jalan 215, Section 51,	Off Jalan Templer		Selangor Darul Eshan 46050",
"MY	Selangor	1, Jalang SS12/1A47500 Subang Jaya			Derul Ehsan ",
"MX	Chihuahua	Calle Hacienda de la Esperanza #6304	Colonia Cima Commercial		31217",
"MX	Mexico City	Cuauhtemoc 330, Col. Doctores, Mexico DF			",
"MX	Monterrey	Hospital Alta Especialidad Monterrey	Hidalgo Ave. 2525 Pte. Col. Obispado		Nuevo Leon 64060",
"MM	Nay Pyi Taw	Thaik Chaung St., Bldg. 44			",
"NL	Deventer	Nico Bolkensteinlaan 85	7416 SE Deventer		7416 SE",
"NL	Rotterdam	Groene Hilledijk 301		3075EA	",
"PK	Karachi	Rafiqui Shaheed Road			75510",
"PH	Makati City	No. 2 Amorsolo Street, Legaspi Village			1229",
"PH	San Fernando	Mc Arthur Highway, Brgy. Maimpis			Pampanga ",
"PL	Gliwice	ul. Wybrzeze Armii Krajowej 15			44-101",
"PL	Poznan	15th Garbary Street			61-866",
"PL	Wieliszew	Koscielna 63			05-135",
"RO	Sibiu	Str. Izvorului Nr. 1A			550172",
"RU	Chelyabinsk	Blukhera str. 42			454087",
"RU	Moscow	Marshal Novikov Street, 23,			",
"RU	Moscow	23, bld. 4 Kashirskoe Shosse			115478",
"RU	Moscow	4th Tverskaya-Yamskaya, 16			125047",
"RU	St. Petersburg	6-ya Sovetskya str. 24-26			19144",
"RU	Voronezh	Ostuzheva str., 31			394033",
"SA	Riyadh	PO BOX 3354			12211",
"SG	Singapore	3 Mt Elizabeth Road			228510",
"SG	Singapore	11 Hospital Drive			169610",
"KR	Busan	267-2, Jwadong-ri Jangan-eup, Gijang-gun			Korea 619-953",
"KR	Daejeon	33 Munhwa-Ro			Jungu 301-721",
"KR	Gyeonggi-do	93-6 Gi-dong, Paldal-Gu			Suwon 442-723",
"KR	Huasun-Eup	160 Ilsimri Hwasun Eup,			Huasun-Gun 519-809",
"KR	Incheon	665 Pupyong-dong	Pupyong-gu		Bupyong-Gu 403-720",
"KR	Jinju-si	67-2 Chiram-dong			Gyeongsangnamdo 660-702",
"KR	Kyeonggi-Do	CyberKnife Center	7-206, 3GA, Sinheung-Dong, Jung-Gu		Incheon 400-711",
"KR	Kyonggi	809 Madu-dong	Koyang		411-764",
"KR	Pusan	305 Gudeok-Ro Seo-Gu,			602-739",
"KR	Seoul	211 Eonju-ro			Gangnam-gu 135-720",
"KR	Seoul	612, Eonjuro			Gangnam-gu 135-720",
"KR	Seoul	126-1, Anam-Dong 5-Ga			Seongbuk-Gu 136-705",
"KR	Seoul	215-4 Gongneung-Dong			Nowon-Ku 139-706",
"KR	Seoul	CyberKnife Center	215-4 Gongneung-Dong, Nowon-Ku		139-706",
"KR	Seoul	1 Hoegi-dong			Dongdaemun-ku 130-702",
"KR	Seoul	388-1 PUNGNAP-2 DONG, SONGPA-GU, 138-736			",
"KR	Seoul	50, Irwon-dong			Gangnam-gu 135-710",
"KR	Seoul	Cyberknife Center	#505 Banpo-dong, Seocho-gu,		137-701",
"KR	Seoul	657 Hannam-dong,	Yongsan-gu,		140-210",
"KR	Seoul	272-28 Gwadae-Dong, Gangseo-Gu			",
"KR	Seoul	134 Sinchon-dong			Seodaemoon-Gu 120-752",
"KR	Seoul	50 Yonsei-ro, Seodaemun-gu			120-752",
"KR	Soo-Gu	685 Gasoowon-Dong			Daejeon 302-918",
"KR	Wonju	162 Ilsan-dong			Kangwon-do 220-701",
"KR	Wonju City	162, Ilsan-dong			Kangwon-Do 220-701",
"KR	Wonmi-gu Bucheon	1174 Jung-Dong, Wonmi-Gu			420-767",
"ES	Ciudad Real	Calle del Obispo Rafael Torija			13005",
"ES	Madrid	C/. La Maso, 38 Mirasierra			28034",
"ES	Madrid	Plaza Republica Argentina 7			28002",
"ES	Majadahonda (Madrid)	Manuel de Falla 1			28222",
"ES	Salamanca	Paseo de San Vicente, 58-182			37007",
"ES	San Sebastian	Paseo Dr. Beguiristain 119			20014",
"LK	Colombo 2	TomoTherapy Centre	70, Park Street		",
"SE	Lund	Skanes Universitetssjukhus, Klinikgatan 7			221 85",
"CH	8008 Zurich	Witellikerstrasse 40			",
"CH	Bern	Freiburgstrasse 4			3010",
"CH	Fribourg	CP 1708			",
"CH	Lausanne	Rue du Bugnon 46			Vaud CH-1011",
"CH	Lugano	Via Moncucco, 10			CH-6903",
"CH	Sion	Av. Grand-Champsec 80			CH-01950",
"CH	St. Gallen	Rorschacher Strasse 95			9007",
"TW	Kaohsiung	100 Tzyou 1st Road			Sanmin District 80756",
"TW	Kaohsiung	No. 162, Cheng Kung Yi Road			Lingya District 00802",
"TW	Sijhih City	No.2, Ln. 59, Jiancheng Road			Taipei County, 22174",
"TW	Taichung	No. 110, Sec. 1, Chien-Kuo N. Road			South District 00402",
"TW	Taichung City	No.2, Yude Rd.			North District 40447",
"TW	Taichung City 433	No.117, Shatian Rd., Shalu Dist.			43303",
"TW	Tainan	No. 138, Sheng Li Road			Taiwan 704",
"TW	Taipei	No.7 Chung San South Road			Zhongzheng District 10048",
"TW	Taipei	No. 7, Chung San South Road			",
"TW	Taipei	No.95, Wenchang Road			Shihlin District 11101",
"TW	Taipei	252, Wu Hsing Street			110",
"TW	Taipei	No.111, Sec. 3, Xinglong Rd., Wenshan Dist			",
"TW	Taipei 116	111 Hsing-Long Road, Sec. 3			Taiwan ",
"TW	Taipei City 114	No. 325, Sec 2, Cheng Kung Road	Neihu District		Taiwan ",
"TW	Taipei County	21, Nan-Ya S. Rd., Sec. 2 Pan-Chiao			Banqiao 22060",
"TW	Taipei County	21, Nan-Ya S. Rd., Sec. 2 Pan-Chiao			Banqiao 22060",
"TW	Taipei County	No.291, Jhongiheng Rd.			Jhonghe 23561",
"TW	Yongkan City	No. 901, Zhong Hua Rd			Tainan County ",
"TH	Bangkok	270 Rama VI Road, Rajchathevee			10400",
"TH	Sripoom	110/201 Intawaroros Road			Chiang Mai 50200",
"TR	Alsancak-Izmir	Nevzat Guzel?rmak Caddesi No:5			",
"TR	Ankara	Vatan Caddesi No:33 Demetevler			",
"TR	Ankara	Vatan Caddesi No:33 Demetevler			",
"TR	Ankara	6532			",
"TR	Ankara	Bilkent Yolu No:3 Bilkent			6533",
"TR	Ankara	Sogutozu Mah. 2165. Sokak no:6			6520",
"TR	Elazig Yolu	Turgut Ozal Tip Merkeli			",
"TR	Erzurum	Osmangazi Mah.Yakutiye			25100",
"TR	Istanbul	Buyukdere Cad. No: 40			",
"TR	Istanbul	Semsi Denizer Cd. E-5 Karayolu Cevizli Mevkii			",
"TR	Istanbul	Istanbul Universitesi Onkoloji Enstitusu Capa			34093",
"TR	Istanbul	Defterdar Yokusu No: 37			",
"TR	Istanbul	Department of Radiation Oncology	Anadolu Caddesi Na:1 Bayramoglu Cikisi	Cayirova Mevkii	",
"TR	Istanbul	Darulaceze Cad. 25 Okmeydani - Sisli			34384",
"TR	Iszmit	Kocaeli Devlet Hastanesi			Kocaeli ",
"TR	IZMIR	IZMIR ATATURK EGITIM VE ARASTIRMA HASTANESI RADYA			35360",
"TR	Osmangazi	Alaattin Mah.Menekse Sokak Osmangazi			Bursa 16040",
"TR	Samsun	Eski Havaalani Merki			55100",
"TR	Trabzon	Inonu Mah.Maras Caddesi			61040",
"UA	Kiev	08112, Kiev region	Kiev-Svyatoshinskij district,	Kapitanovka village, Radyanska str.21	",
"AE	Al Ain	P.O. Box 15258, Al Ain	Pupyong-gu		",
"GB	Birmingham	Edgbaston			B15 2TH",
"GB	Cambridge	Hills Road			England CB2 2QQ",
"GB	London	162 - 174, Cromwell Road			England SW5 0TU",
"GB	London	Westminster Bridge Road			Lambeth SE1 7EH",
"GB	London	81 Harley Street			W1G 8PP",
"GB	London	St Bartholomew’s Hospital (Barts)	West Smithfield		EC1A 7BE",
"GB	London	20 Devonshire Place			W1G 6BW",
"GB	London	Fulham Road			SW3 6JJ",
"GB	Middlesbrough	Marton Road			Middlesbrough TS4 3BW",
"GB	Newcastle upon Tyneupon Tyne	Freeman Road			England NE7 7DN",
"GB	Northwood	Rickmansworth Road	Radiotherapy Department		Middlesex HA6 2RN",
"GB	Nottingham	Hucknail Road			Nottinghamshire NG5 1PB",
"US	Albany	417 3rd Avenue			GA 31702",
"US	Albany	113 Holland Ave			NY 12208-3410",
"US	Albuquerque	4650 Jefferson Lane NE			NM 87109",
"US	Albuquerque	1201 Camino de Salud			NM 87131",
"US	Amarillo	1500 Wallace Blvd			TX 79106",
"US	Anchorage	3200 Providence Drive			AK 99508",
"US	Ann Arbor	5301 East Huron River Drive #995			MI 48106",
"US	Antigo	112 E Fifth Ave			WI 54409",
"US	Appleton	1818 North Meade Street			WI 54911",
"US	Appleton	1506 S. Oneida Street			WI 54915",
"US	Arlington	1701 N. George Mason Drive			VA 22205",
"US	Arlington Heights	800 W. Central Road			IL 60005",
"US	Asheville	21 Hospital Dr.			NC 28801",
"US	Austin	1400 North IH 35			TX 78701",
"US	Bakersfield	6501 Truxturn Ave.			CA 93309",
"US	Baltimore	9103 Franklin Square Dr.			MD 21237",
"US	Baltimore	401 N. Broadway	Weinberg Bldg., Suite 1440		MD 21231",
"US	Baltimore	2401 W. Belvedere Avenue			MD 21215",
"US	Baltimore	900 Caton Avenue			MD 21229",
"US	Baltimore	401 North Broadway, Suite 1440			MD 21231-2410",
"US	Baton Rouge	4950 Essen Lane			LA 70809",
"US	Bayamon	Urb. Santa Rosa, 11-25 Carr. 174			PR 00959-6609",
"US	Beckley	275 Dry Hill Road			WV 25801",
"US	Bel Air	602 S. Atwood, Suite 105			MD 21014",
"US	Bellingham	3217 Squalicum Parkway			WA 98225",
"US	Bethesda	Building 10 CRC NIH	10 Center Drive		MD 20892",
"US	Bethesda	8901 Wisconsin Avenue			MD 20889",
"US	Billings	1315 Golden Valley Circle			MT 59102",
"US	Birmingham	2010 Brookwood Medical Center Drive			AL 35209",
"US	Birmingham	810 St. Vincent Drive			AL 35205",
"US	Birmingham	2145 Bonner Way			AL 35243",
"US	Boston	330 Brookline Avenue			MA 02215",
"US	Boston	Moakley Building	830 Harrison Avenue		MA 02118",
"US	Bradenton	6310 Health Parkway Suite 100			FL 34202",
"US	Brandon	621 Lumsden Ct.			FL 33511",
"US	Bristol	1 Medical Park Blvd.			TN 37620",
"US	Brockton	680 Centre Street			MA 02302",
"US	Brooklyn	2505 86th Street			NY 11214",
"US	Brunswick	2415 Parkwood Drive			GA 31520",
"US	Caguas	Hospital Interamericano de Medicina Avanzada	Luis Munoz Marin Avenue	Urbanizacion Mariolga	PR 00725",
"US	Canton	1320 Mercy Drive NW			OH 44708",
"US	Cape Coral	1419 SE 8th Terrace			FL 33990",
"US	Cape Girardeau	211 St. Francis Drive			MO 63703",
"US	Cedar Rapids	701 10th Street SE			IA 52403",
"US	Chambersburg	260 North 7th Street			PA 17201",
"US	Chapel Hill	101 Manning Dr.			NC 27514",
"US	Charleston	86 Jonathan Lucas St Ste 344			SC 29425",
"US	Charleston	125 Doughty St, Suite 760			SC 29403",
"US	Charlottesville	PO Box 800383			VA 22908",
"US	Chattanooga	975 E. Third Street			TN 37403",
"US	Cheyenne	214 E. 23 St.			WY 82001",
"US	Chicago	160 East Illinois Street			IL 60611&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;",
"US	Chicago	7435 West Talcott Avenue			IL 60631",
"US	Chicago	1650 West Harrison			IL 60612",
"US	Cincinnati	2000 Joseph E. Sanker Blvd.			OH 45212",
"US	Clarkston	6770 Dixie Highway Ste 106			MI 48346-2066",
"US	Cleveland	11100 Euclid Avenue			OH 44106",
"US	College Station	500 Raymond Stotzer Parkway			TX 77843",
"US	Colorado Springs	525 North Foote Ave			CO 80909",
"US	Colorado Springs	2222 N. Nevada Ave			CO 80907",
"US	Columbus	3764 39th Ave.			NE 68601",
"US	Columbus	3535 Olentangy River Road			OH 43214",
"US	Concord	920 Church Street N			NC 28025",
"US	Cookeville	142 West Fifth Street			TN 38501",
"US	Cornwall	15 Laurel Avenue			NY 12518",
"US	Corpus Christi	1415 Santa Fe			TX 78404",
"US	Corpus Christi	14120 Northwest Blvd.			TX 78410",
"US	Cortlandt Manor	1980 Crompond Rd.			NY 10567",
"US	Cranford	570 South Avenue East, Building A			NJ 07016",
"US	Culpeper	501 Sunset Lane			VA 22701",
"US	Dallas	10425 N. Central Expressway			TX 75231",
"US	Dallas	5323 Harry Hines Blvd.			TX 75390",
"US	Dallas	3500 Gaston Avenue			TX 75246",
"US	Davenport	1227 E. Rusholme Street			IA ",
"US	Dayton	2632 Woodman Center Court			OH 45420",
"US	Dayton	1 Wyoming St			OH 45409",
"US	Dearborn	18101 Oakwood Blvd			MI 48124",
"US	Decatur	1990 East Lake Shore Dr			IL 62521",
"US	Deerfield Beach	201 East Sample Road			FL 33064",
"US	Des Moines	Mercy Medical Plaza	411 Laurel Street	Suite C100	IA 50314",
"US	Detroit	4100 John R Street			MI 48201",
"US	Duarte	1500 East Duarte Road			CA 91010",
"US	Duluth	502 East Second St			MN 55805",
"US	Dunmore	1110 Meade Street			PA 18512",
"US	East Chicago	4321 Fir Street			IN 46312",
"US	East Setauket	181 Belle Meade Road, Suite 1B			NY 11733",
"US	Easton	250 S. 21st Street			PA 18042",
"US	Egg Harbor Township	2500 English Creek Avenue, Building 400			NJ 08234",
"US	Elmhurst	Elmhurst Memorial Hospital	Radiation Oncology Department	200 Berteau Avenue	IL 60126",
"US	Everett	1321 Colby Avenue	1700 13th Street		WA 98201",
"US	Falls Church	3300 Gallows Road			VA 22304",
"US	Farmington	263 Framington Avenue			CT 06030-3930",
"US	Fayetteville	1638 Owen Drive			NC 28304",
"US	Fenton	1011 Bowles Ave. Suite G-50			MO 63026",
"US	Flint	4100 Beecher Road			MI 48532-3685",
"US	Flushing	40-22 Main St, 4th Fl			NY 11354",
"US	Fort Wayne	11141 Parkview Plaza Drive	Suite 110		IN 46845",
"US	Fort Worth	800 W. Magnolia Ave., Suite B			TX 76104",
"US	Fountain Valley	18111 Brookhurst Street, LL, Suite 0300			CA 92708-6728",
"US	Frederick	501 West Seventh Street			MD 21701",
"US	Fresno	2823 Fresno Street			CA 93721",
"US	Furlong	2365 Heritage Center Dr			PA 18925",
"US	Gainesville	6420 W. Newberry Road			FL 32605",
"US	Glendale	5310 W. Thunderbird Road	Suite 108		AZ 85306",
"US	Goodyear	14200 W. Celebrate Life Way			AZ 85338",
"US	Goshen	200 High Park Ave			IN 46526",
"US	Grand Forks	960 South Columbia Rd			ND 58201",
"US	Grand Rapids	250 Cherry Street SE			MI 49503",
"US	Great Falls	1101 26th Street South			MT 59405",
"US	Greensboro	501 N. Elam Avenue			NC 27403",
"US	Greenville	600 Moye Blvd			NC 27834",
"US	Grove	3632 HWY 59 N			OK 74344",
"US	Gulfport	4500 Thirteenth Street			MS 39501",
"US	Hackensack	155 State Street			NJ 07601",
"US	Harrisburg	4300 Londonderry Road			PA 17109",
"US	Harrisonburg	100 East Grace Street			VA 22801",
"US	Hartford	94 Woodland Street			CT 06105",
"US	Havertown	2010 West Chester Pike	Suite 115		PA 19083",
"US	Honolulu	1301 Punchbowl Street			HI 96813",
"US	Houston	2002 Holcombe Blvd			TX 77030",
"US	Houston	6720 Bertner Ave.			TX 77030",
"US	Houston	6565 Fannin			TX 77030",
"US	Huntington	2900 First Avenue			WV 25702",
"US	Hutchinson	1701 East 23rd Avenue			KS 67502",
"US	Indianapolis	8111 South Emerson Avenue			IN 46237",
"US	Jackson	1225 North State Street			MS 39202",
"US	Jacksonville	7751 Baymeadows Road East			FL 32256",
"US	Johnson City	30 Harrison Street			NY 13790",
"US	Joliet	2614 West Jefferson Street			IL 60435",
"US	Kalamazoo	200 North Park Street			MI 49007",
"US	Knoxville	1924 Alcoa Highway			TN 37920",
"US	Knoxville	1915 White Avenue			TN 37916",
"US	La Mesa	5555 Grossmont Center Drive			CA 91942",
"US	Lafayette	120 Old Laramie Trail East			CO 80026-7012",
"US	Lafayette	120 Old Laramie Trail East			CO 80026-7012",
"US	Lafayette	155 Hospital Drive	Suite 102		LA 70503",
"US	Lafayette	917 General Mouton Avenue			LA 70501",
"US	Lake Success	6 Ohio Drive Suite 103			NY 11042",
"US	Lake Worth	5301 South Congress Ave.			FL 33462",
"US	Lancaster	2102 Harrisburg Pike			PA 17601",
"US	Langhorne	1201 Langhorne-Newtown Road (Route. 413)			PA 19047",
"US	Lansing	1215 East Michigan Avenue			MI ",
"US	Las Cruces	2450 South Telshore Blvd			NM 88011",
"US	Las Vegas	655 North Town Center			NV 89144",
"US	Layton	2132 N. 1700 W.			UT 84041",
"US	League City	2240 Gulf Freeway South			TX 77573",
"US	Lexington	800 Rose Street			KY 40536",
"US	Lexington	1740 Nicholasville Road			KY 40503",
"US	Lincoln	555 S. 70th Street			NE 68510",
"US	Little Rock	4301 W. Markham St.			AR 72205",
"US	Livingston	94 Old Short Hills Road			NJ 07039",
"US	Lone Tree	10463 Park Meadows Dr. Bldg 5 Suite 114			CO 80124",
"US	Lone Tree	10463 Park Meadows Blvd., Suite 111			CO 80124",
"US	Long Beach	2801 Atlantic Avenue			CA 90801",
"US	Long Branch	300 2nd Avenue			NJ 07740",
"US	Los Angeles	200 UCLA Medical Plaza, Suite B265			CA 90095-6951",
"US	Los Angeles	1441 Eastlake Avenue			CA 90033",
"US	Los Gatos	15400 National Ave.			CA 95032",
"US	Louisville	529 South Jackson Street			KY 40202",
"US	Louisville	529 South Jackson Street			KY 40202",
"US	Madison	600 Highland Avenue			WI 53792",
"US	Madison	2015 Linden Drive			WI 53706-1102",
"US	Manitowoc	2300 Western Avenue, P.O. Box 1450			WI 54220",
"US	Marietta	401 Matthew Street			OH 45750",
"US	Marietta	320 Kennestone Hospital Blvd.	Suite Lower Level 1		GA 30060",
"US	Marrero	1101 Medical Center Boulevard			LA 70072",
"US	Marshfield	611 St. Joseph Ave			WI 54449",
"US	McAlester	901 N. Strong Blvd			OK 74501-4206",
"US	McHenry	4305 W Medical Center Drive			IL 60050",
"US	Medford	2825 East Barnett Road			OR 97504",
"US	Melbourne	1430 S. Pine St.			FL 32901",
"US	Memphis	5959 Park Avenue			TN 38119",
"US	Memphis	55 Humphreys Center Drive	Suite 100		TN 38120",
"US	Miami	7867 North Kendall Dr. Suite 105			FL 33156",
"US	Miami	3663 South Miami Avenue			FL 33133",
"US	Miami	6200 South West 73rd Street			FL 33143",
"US	Miami	1475 NW 12th Avenue			FL 33136",
"US	Miami Shores	9165 Park Drive			FL 33138",
"US	Middleburgh Heights	18697 Bagley Road			OH 44130-3497",
"US	Milford	113 Pocono Drive			PA 18337",
"US	Milwaukee	9200 West Wisconsin Avenue			WI 53226-3596",
"US	Milwaukee	2900 W. Oklahoma Ave.			WI 53201",
"US	Mineola	259 First Street			NY 11501",
"US	Minneapolis	500 Harvard Street SE			MN ",
"US	Mobile	1660 Springhill Ave			AL 36604",
"US	Moore	2117 Riverwalk Drive			OK 73160",
"US	Mount Laurel	715 Fellowship Road			NJ 08054",
"US	Mountain View	2500 Grant Road			CA 94040",
"US	Muskogee	1555 Eco-Friendly Drive			OK 74401",
"US	Myrtle Beach	4708 Oleander Dr			SC 29577",
"US	Naples	733 4th Avenue North			FL 34102",
"US	Naples	1885 SW Health Parkway			FL 34109",
"US	Nashville	2300 Patterson Street			TN 37203",
"US	New Brunswick	1 Robert Wood Johnson Place			NJ 08901",
"US	New Brunswick	254 Easton Avenue			NJ 08901",
"US	New Haven	1450 Chapel St.			CT 06511-4405",
"US	New York	130 East 77th Street			NY 10065",
"US	Newark	4755 Ogletown Stanton Road			DE 19718",
"US	Newnan	600 Celebrate Life Parkway			GA 30265",
"US	Newport Beach	One Hoag Dr.			CA 92658",
"US	Newport Beach	1605 Avocado Avenue	P.O. 959		CA 92660",
"US	Norfolk	Sentara Norfolk General Hospital	600 Gresham Dr.		VA 23507",
"US	Normal	407 East Vernon Avenue		Suite 110	IL 61761",
"US	Nyack	111 North Highland Avenue			NY 10956",
"US	Oak Lawn	4440 West 95th Street			IL 60453",
"US	Oakland	350 Hawthorne Ave.			CA 94609",
"US	Ogden	5475 South 500 East Adams Avenue			UT 84405",
"US	Oklahoma City	5701 North Portland Ste B102			OK 73112",
"US	Oklahoma City	3300 NW 56th Street, LL 100			OK 73112",
"US	Oklahoma City	1000 North Lee			OK 73102",
"US	Omaha	6901 N. 72nd Street			NE 68122",
"US	Orlando	1400 South Orange Avenue&nbsp;&nbsp;			FL 32806",
"US	Overland Park	Dept. of Radiation Oncology	5721 W 119th Street		KS 66209",
"US	Palm Beach Gardens	10335 North Military Trail, Suite B			FL 33410",
"US	Palo Alto	300 Pasteur Dr			CA 94305",
"US	Paramus	1 Valley Health Plaza			NJ 07652",
"US	Park Ridge	1775 Dempster Street			IL 60068",
"US	Park Ridge	1700 Luther Lane	Suite 1110		IL 60068",
"US	Pasadena	630 S. Raymond Ave.	Ste. 104		CA 91105",
"US	Pembroke Pines	801 North Flamingo Road	Suite 11		FL 33028",
"US	Pennington	408 Scotch Road			NJ 08534",
"US	Peoria	221 NE Glen Oak Avenue			IL 61636",
"US	Peoria	7309 Knoxville Road			IL 60614",
"US	Philadelphia	800 Spruce St.			PA 19107",
"US	Philadelphia	1331 E. Wyoming Avenue			PA 19124-3808",
"US	Phoenix	4611 E. Shea Blvd., Suite 120			AZ 85028",
"US	Phoenix	350 West Thomas Road			AZ 85013",
"US	Phoenix	1111 E McDowell Rd			AZ 85006",
"US	Pittsburgh	4800 Friendship Ave			PA 15224",
"US	Pittsburgh	5230 Centre Avenue			PA 15232",
"US	Pittsburgh	University Drive C			PA 15240",
"US	Pittsfield	725 North Street			MA 01201",
"US	Pomona	1910 Royalty Drive			CA 91767",
"US	Pontiac	70 Fulton Street			MI 48341",
"US	Portland	Peter O. Kohler Pavilion, 4th Floor, 808 SW Campus			OR 97239",
"US	Portsmouth	620 John Paul Jones Circle			VA 23708",
"US	Poughkeepsie	45 Reade Place			NY 12601",
"US	Princeton	210 New Hope Road			WV 24740",
"US	Providence	Rhode Island Hospital	593 Eddy Street		RI 02903",
"US	Raleigh	4420 Lake Boone Trail			NC 27607",
"US	Rancho Mirage	40055 Bob Hope Drive Ste B-1			CA 92270",
"US	Rapid City	353 Fairmont Blvd			SD 57701",
"US	Red Bank	One Riverview Plaza			NJ 07701",
"US	Reno	645 North Arlington Ave,#120			NV 89503",
"US	Reno	1155 Mill St.			NV 89502",
"US	Riverside	4500 Brockton Ave.			CA 92501",
"US	Roanoke	2013 South Jefferson Street, SW			VA 24033",
"US	Rochester	601 Elmwood Avenue, Box 704			NY 14642",
"US	Rye	1 Theall Road			NY 10580-1404",
"US	Sacramento	4501 X Street	G126		CA 95817",
"US	Saginaw	800 South Washington Ave.			MI 48601",
"US	Saint Louis	3635 Vista Avenue			MO 63110",
"US	Saint Paul	69 W. Exchange Street			MN 55102",
"US	Salem	665 Winter St. SE			OR 97301",
"US	Salt Lake City	1250 East 3900 South, Suite 10			UT 84124",
"US	San Antonio	8215 Ewing Halsell Drive			TX 78229",
"US	San Diego	5395 Ruffin Road	Suite 103		CA 92123",
"US	San Francisco	1600 Divisadero St., Basement Level			CA 94143-1708",
"US	San Francisco	1600 Divisaero St.			CA 94115",
"US	Sarasota	3663 Bee Ridge Road			FL 34233",
"US	Savannah	225 Candler Drive			GA 31405",
"US	Scottsdale	7373 N. Scottsdale Road, Bldg E			AZ 85253",
"US	Scottsdale	2926 N. Civic Center Plaza			AZ 85251",
"US	Seattle	550 17th Avenue, Suite A10	James Tower Life Sciences Building		WA 98122",
"US	Seattle	5225 Tallman Avenue NW			WA 98107",
"US	Sherman Oaks	5522 Sepulveda Blvd			CA 91411",
"US	Shreveport	2600 Kings Highway			LA 71103",
"US	Sidney	216 14th Ave SW			MT 59270",
"US	Sierra Vista	5151 E Hwy 90			AZ 85635",
"US	Sioux Falls	1305 W. 18th Street			SD 57105",
"US	Smithtown	989 Jericho Turnpike			NY 11787",
"US	South San Francisco	220 Oyster Point Blvd.			CA 94080",
"US	Spartanburg	101 East Wood Street			SC 29303",
"US	Spokane Valley	13424 E Mission Ave			WA 99216",
"US	Springfield	Mercy St. John’s Hospital	2055 S. Fremont		MO 65804",
"US	Springfield	2055 South Fremont Avenue			MO 65804",
"US	St. George	1308 E. 900 S. Unit B			UT 84790",
"US	St. Louis	12303 DePaul Drive			MO 63044",
"US	St. Louis	660 S. Euclid Avenue			MO 63110",
"US	St. Louis	607 S. New Ballas Road			MO 63141",
"US	St. Petersburg	6600 66th Street North			FL ",
"US	Stamford	Tully Health Center	32 Strawberry Hill Court		CT 06902",
"US	Staten Island	360 Bard Avenue			NY 10310",
"US	Stuart	2111 SE Ocean Blvd.			FL 34996",
"US	Summit	99 Beauvoir Ave.			NJ 07901",
"US	Sun City West	14506 W Meeker Blvd			AZ 85375",
"US	Sylvania	5200 Harroun Road			OH 43560",
"US	Syracuse	5008 Brittonfield Parkway	Suite 700		NY 13057-2010",
"US	Syracuse	750 East Adams Street			NY 13210",
"US	Tacoma	1003 South 5th St.			WA 98405",
"US	Tallahassee	2003 Centre Pointe Blvd			FL 32308",
"US	Tampa	5935 Webb Road			FL 33615",
"US	Tampa	12902 Magnolia Drive			FL 33612",
"US	Tampa	4101 Jim Walter Blvd.			FL 33607",
"US	Tampa	1 Tampa General Circle			FL 33606-3571",
"US	The Villages	11950 County Road 101			FL 32162",
"US	Toledo	3404 W. Sylvania Avenue			OH ",
"US	Toms River	99 Highway 37 West			NJ 08755",
"US	Topeka	1700 SW 7th Street			KS 66606",
"US	Tualatin	6489 SW Borland Road			OR 97062",
"US	Tucson	1501 N. Campbell Ave			AZ 85724",
"US	Tulsa	6802 South Olympia Ave.	Suite G100		OK 74132",
"US	Tulsa	2408 East 81st Street Suite 110			OK 74137",
"US	Tulsa	1923 South Utica Avenue			OK 74104",
"US	Tulsa	1923 South Utica Avenue			OK 74104",
"US	Tulsa	12697 E. 51st St. South			OK 74146",
"US	Tulsa	10109 East 79th St.			OK 74133",
"US	Tyler	721 Clinic Drive			TX 75701",
"US	Urbana	602 W. University Ave			IL 61801",
"US	Valencia	25751 McBean Parkway	Suite 110		CA 91355",
"US	Vancouver	400 NE Mother Joseph Place			WA 98664",
"US	Venice	959 E. Venice Avenue			FL 34292",
"US	Vero Beach	931 37th Place			FL 32960",
"US	Vista	902 Sycamore Avenue			CA 92081",
"US	Warrenville	4405 Weaver Parkway			IL 60555",
"US	Washington	3800 Reservoir Road, NW			DC 20007",
"US	Washington	5255 Loughboro Road, NW			DC 20016",
"US	Watertown	401 9th Avenue NW			SD 57201",
"US	Waukesha	725 American Avenue			WI 53188",
"US	Wausau	425 Pine Ridge Blvd.			WI 54401",
"US	Wellington	3343 State Road Seven			FL 33449",
"US	Westchester	7710 University Court			OH 45069",
"US	Westerville	495 Cooper Rd., Suite 125			OH 43081",
"US	Whippany	16 Eden Lane			NJ 07981",
"US	Wichita	CyberKnife Center	825 N. Emporia		KS 67214",
"US	Willingboro	220 Sunset Road #4			NJ 08046",
"US	Wisconsin Rapids	410 Dewey Street			WI 54495",
"US	Worcester	123 Summer Street			MA 01608",
"US	Yonkers	9 O'dell Plaza			NY 10701",
"US	Yuma	1951 W. 25th St, Suite F			AZ 85364",
"US	Zion	2520 Elisha Avenue			IL 60099",
"VE	Caracas	Final Avenida Rio de Janeiro. Urb. El Llanito			",
"VE	Caracas	Sector Bella Vista, Avenida Principal			",
"VN	Hanoi	No 1 Tran Hung Dao Street	Hai Ba Trung District		Cau Giay District C107-D5",
""]
}
}

uglify_js(window, document, console, localStorage)
