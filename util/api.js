import cheerio from 'cheerio';
import request from './request'

const WEBM = 'https://m.kankanwu.com';
const WEB = 'https://www.kankanwu.com';

const fetchData = (uri,par={}) => {
    return fetch(uri,par)
        .then(d=>d.json())
        .then(d=>{
            return d
        })
        .catch(err=>{
            return err
        })
}



const getHref = (s,m) => {
    if(s.includes('//')){
        return 'https:'+s;
    }else{
        return m+s;
    }
}

const GetAlbumByLevel = async () => {
    const response = await fetch($.LOCAL + '/api/v1/appAlbum/member');
    let data = await response.json()
    return data
};

const GetHomeData = async () => {
    const html = await fetch(WEBM).then(d=>d.text());
    const $ = cheerio.load(html);
    const banner = $('.focusList>li').map((i,item)=>{
        return ({
            "ID": $(item).find('a').attr('href'),
            "Cover": getHref($(item).find('img').attr('src'),WEBM),
            "Name": $(item).find('.sTxt').text(),
        })
    }).get();


    const list = (index) => {
        const data = $('.all_tab>.list_tab_img').eq(index).find('li').map((i, item)=>{
            return ({
                "ID": $(item).find('a').attr('href'),
                "Cover": getHref($(item).find('img').attr('src'),WEBM),
                "Name": $(item).find('a').attr('title'),
                "MovieTitle": $(item).find('.title').text(),
                "Score": $(item).find('.score').text(),
            })
        }).get();
        return data;
    }
    const data =  {
        solling:{
            name:'轮播图',
            list:banner
        },
        movie:{
            name:'电影',
            list:list(0)
        },
        tv:{
            name:'电视剧',
            list:list(1)
        },
        comic:{
            name:'动漫',
            list:list(2)
        },
        variety:{
            name:'娱乐',
            list:list(3)
        },
    }
    return data;
};

const GetHomeData2 = async () => {
    const response = await fetch($.LOCAL + '/api/v1/appVideo/homeData');
    let data = await response.json()
    
    // 处理数据，
    Object.keys(data).forEach(key =>{
        data[key].list = data[key].list.map( video => {
            return {
                "ID": video.id,
                "Cover": $.COVER_URL + video.videoInfo.coverPath,
                "Name": video.name,
                "MovieTitle":  video.videoInfo.name,
                "Score": video.rate,
                "VipLevel": video.vipLevel
            }
        })
    })

    return data
};

//影片详情
const GetVideoInfo = async (ID)=> {
    const html = await fetch(WEB+`/${ID}`).then(d=>d.text());
    const $ = cheerio.load(html);
    const MoviePlayUrls = $('#detail-list .play-list').eq(0).children('a').map((i, el)=>{
        return ({
            "ID": 'play_'+i,
            "Index": i,
            "Name": $(el).text(),
            "PlayUrl": WEBM+$(el).attr('href'),
        })
    }).get();
    const RelateList = $('#con_latest_1 .img-list li').map((i, el)=>{
        return ({
            "ID": $(el).find('.play-img').attr('href'),
            "Cover": getHref($(el).find('img').attr('src'),WEB),
            "Name": $(el).find('h3').text(),
            "MovieTitle": $(el).find('.text').text(),
        })
    }).get();
    const getTags = (index) => info.eq(index).find('a').filter((i,el) => $(el).text().length>0).map((i,el) => $(el).text()).get().join(' ');
    const movieInfo = $('#detail-box');
    const info = movieInfo.find('.info dl');
    const Introduction = 
`主演：${getTags(0)}
导演：${getTags(5)}
简介：${$('#detail-intro').text()}`
    console.log('tex', $('#detail-intro').text());
    
    const data =  {
        "MoviePlayUrls":MoviePlayUrls,
        "ID": ID,
        "DBID": 0,
        "Name": movieInfo.find('h1').text(),
        "MovieTitle": info.eq(1).find('span').text(),
        "Cover": getHref(movieInfo.find('.detail-pic img').attr('src'),WEB),
        "Tags": getTags(2),
        "Introduction": Introduction,
        "ReleaseDate": info.eq(6).find('span').text(),
        "Score": 0,
        //"UpdateTime": "2018-09-25T10:58:25",
        "RelateList": RelateList,
        // "RelateList": [],
    }
    return data;
}

const GetVideoInfo2 = async (ID)=> {
    console.log('getGetVideoInfo2');
    
    const response = await fetch($.LOCAL + '/api/v1/appVideo/' + ID);
    let video = await response.json()
    console.log('videoINfo', video);
    // videoInfo.
    const starring = video.videoInfo.videoStarring.map( v=> {
        return v.starring
    })

    const tag = video.tags.map( v=> {
        return v.tagName
    })
    
    const Introduction = 
    `主演：${starring.join(',')}
导演：${video.videoInfo.director}
简介：${video.remark}`
    const data =  {
        "MoviePlayUrls":[{
            "ID": video.id,
            "Index": 0,
            "Name": video.sysFileUpload.originalName,
            "PlayUrl": $.VIDEO_URL + video.sysFileUpload.path
        }],
        "ID": video.id,
        "DBID": 0,
        "Name": video.name,
        "MovieTitle": video.videoInfo.name,
        "Cover": $.COVER_URL + video.videoInfo.coverPath,
        "Tags": tag.join('/'),
        "Introduction": Introduction,
        "ReleaseDate": video.updateTime,
        "Score": video.rate,
        //"UpdateTime": "2018-09-25T10:58:25",
        "RelateList": [],
        "VipLevel": video.vipLevel
    }
    return data;
}

const GetPlayUrl2 = async (url)=> {
    const u = url.replace('https://m','https://www');
    const html = await fetch(u).then(d=>d.text());
    const $ = cheerio.load(html);
    const playUrl = $('iframe').attr('src').split('=')[1];
    console.log(playUrl)
    return playUrl;
}

const GetPlayUrl = async (url, ID)=> {
    // const response = await fetch($.LOCAL + '/api/v1/appVideo/credit/' + ID, {
    //     headers: new Headers({
    //         'X-Token': global.token
    //     })
    // });
    // // console.log('response', response);
    // let credit = await response.text()

    let credit = await request({
        url: $.LOCAL + '/api/v1/appVideo/credit/' + ID,
        method: 'get'
    })

    console.log('credit', credit);

    console.log('playurl', url + 'index.m3u8?key='+credit+'&token='+global.token);
    
    return url + 'index.m3u8?key='+credit+'&token='+global.token;
    // return 'http://192.168.45.129:8888/video/20190612/b1e6aff2-f3ac-477d-9ece-667e3129cf48/m3u8/index.m3u84'
    // return 'http://192.168.45.129:90/video';
}

const GetDoubanInterests = ({DBID,start=0,count=5})=>fetchData(`https://frodo.douban.com/api/v2/movie/${DBID}/interests?start=${start}&count=${count}&status=done&order_by=latest&apikey=0b2bdeda43b5688921839c8ecb20399b`,{headers:{"User-Agent":"api-client/1 com.douban.movie"}});

//获取列表
const GetPageList = async ({pageSize=25,pageIndex=1,Type='',Status='',Area='',Plot='',Year='',orderBy='hits'}) => {
    const mapType = {
        movie:1,
        tv:2,
        comic:3,
        variety:4,
    }
    //orderBy：'addtime' | 'hits' | 'gold'
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-${Type}-mcid-${Plot}-lz-${Status}-area-${Area}-year-${Year}-letter--order-${orderBy}-picm-1-p-${pageIndex}.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-4-mcid-16-lz-2-area-%E5%A4%A7%E9%99%86-year-2018-letter--order-addtime-picm-1-p-1.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-3-mcid-59-lz-1-area-%E5%A4%A7%E9%99%86-year-2018-letter--order-hits-picm-1-p-2.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-3-mcid-59-lz-2-area-%E5%A4%A7%E9%99%86-year-2018-letter--order-hits-picm-1-p-2.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-1-mcid-8-lz--area-%E5%A4%A7%E9%99%86-year-2018-letter--order-addtime-picm-1-p-1.html
    //https://www.kankanwu.com/index.php?s=Showlist-show-id-2-mcid-133-lz-1-area-%E5%A4%A7%E9%99%86-year-2018-letter--order-addtime-picm-1-p-1.html
    //https://m.kankanwu.com/Animation/index_1_______1.html
    //https://m.kankanwu.com/Comedy/index_1_58_2_2018__hits_%E5%A4%A7%E9%99%86_1.html
    //https://m.kankanwu.com/Comedy/index_1_58_2_2018__hits_%E6%97%A5%E6%9C%AC_1.html
    //https://m.kankanwu.com/Comedy/index_1_58__2018__hits_%E5%A4%A7%E9%99%86_1.html
    //https://m.kankanwu.com/Comedy/index_1_28_2_2019__hits_%E5%A4%A7%E9%99%86_1.html
    //https://m.kankanwu.com/${Type}/index_${pageIndex}_${Plot}_${Status}_${Year}__${orderBy}_${Area}_1.html
    //https://m.kankanwu.com/${Type}/index_${pageIndex}_${Plot}__${Year}__${orderBy}_${Area}_1.html
    //const html = await fetch(WEBM+`/${Type}/index_${pageIndex}_${Plot}_${Status}_${Year}__${orderBy}_${Area}_1.html`).then(d=>d.text());
    const html = await fetch(WEB+`/index.php?s=Showlist-show-id-${mapType[Type]}-mcid-${Plot}-lz-${Status}-area-${Area}-year-${Year}-letter--order-${orderBy}-picm-1-p-${pageIndex}.html`).then(d=>d.text());
    console.log('`/index.php?s=Showlist-show-id-${mapType[Type]}-mcid-${Plot}-lz-${Status}-area-${Area}-year-${Year}-letter--order-${orderBy}-picm-1-p-${pageIndex}.html`', `/index.php?s=Showlist-show-id-${mapType[Type]}-mcid-${Plot}-lz-${Status}-area-${Area}-year-${Year}-letter--order-${orderBy}-picm-1-p-${pageIndex}.html`);
    
    const $ = cheerio.load(html);
    const data =  $('#contents li').map((i, el)=>{
        const video = $(el).find('a');
        return ({
            "ID": video.attr('href'),
            "Name": video.find('img').attr('alt'),
            "MovieTitle": $(el).find('.state').text(),
            "Cover": getHref(video.find('img').attr('src'),WEB),
        })
    }).get()
    return data;
}

//获取列表
const GetPageList2 = async ({size=10, page=1, id='', Status='', Area='', Plot='', Year='', orderBy='hits'}) => {
    const response = await fetch($.LOCAL + `/api/v1/appVideo/?videoalbumId=${id}&countryCode=${Area}&publishTime=${Year}&page=${page}&size=${size}`);
    let data = await response.json();
    console.log('data', data);
    
    const result = data.content.map( video =>{
        console.log('i', video);
        
        return ({
            "ID": video.id,
            "Name": video.name,
            "MovieTitle": video.name,
            "Cover":  $.COVER_URL + video.videoInfo.coverPath,
            "VipLevel": video.vipLevel
        })
    })
    console.log('result', result);
    return result;
    // return ({
    //     "ID": video.attr('href'),
    //     "Name": video.find('img').attr('alt'),
    //     "MovieTitle": $(el).find('.state').text(),
    //     "Cover": getHref(video.find('img').attr('src'),WEB),
    // })
}   

//GetSearch
const GetSearch = async ({pageSize=25,pageIndex=1, SearchKey}) => {
    const html = await fetch(WEBM+`/vod-search-wd-${SearchKey}-p-${pageIndex}.html`).then(d=>d.text());
    const $ = cheerio.load(html);
    const getInfo = (info,i) => info.find('p').eq(i).find('a').map((i,el) => $(el).text()).get().join(' ');
    const data =  $('#resize_list li').map((i, el)=>{
        const video = $(el).find('a');
        const info = $(el).find('.list_info');
        return ({
            "ID": video.attr('href'),
            "Name": video.attr('title'),
            "Cover": getHref(video.find('img').attr('src'),WEB),
            "Info":{
                "Type":getInfo(info,1),
                "Art":getInfo(info,2),
                "Status":info.find('p').eq(3).text(),
                "Time":info.find('p').eq(4).text(),
            }
        })
    }).get()
    const isEnd = pageIndex>$('.ui-vpages span').text();
    return {
        list:data,
        isEnd:isEnd
    };
}

const GetSearch2 = async ({pageSize=10,pageIndex=1, SearchKey}) => {
    const response = await fetch($.LOCAL + `/api/v1/appVideo/search?key=${SearchKey}&page=${pageIndex}&size=${pageSize}`);
    let data = await response.json();
    const result = data.content.map((video,el)=>{
        return ({
            "ID": video.id,
            "Name": video.name,
            "Cover": $.COVER_URL + video.videoInfo.coverPath,
            "VipLevel": video.vipLevel,
            "Info":{
                "Type":video.videoalbumName,
                "Art": '',
                "Status": '',
                "Time": video.videoInfo.publishTime
            }
        })
    })
    const isEnd = (data.totalElements <= pageSize * pageIndex)
    // const isEnd = pageIndex == 1 ? data.totalElements
    // console.log('sarch', result, isEnd, pageIndex);
    return {
        list: result,
        isEnd: isEnd
    };
}

const GetLatest = async ({pageSize=10,pageIndex=1, SearchKey}) => {
    const response = await fetch($.LOCAL + `/api/v1/appVideo/latest?page=${pageIndex}&size=${pageSize}&sort=updateTime`);
    let data = await response.json();
    const result = data.content.map((video,el)=>{
        return ({
            "ID": video.id,
            "Name": video.name,
            "Cover": $.COVER_URL + video.videoInfo.coverPath,
            "UpdateTime": video.updateTime,
            "VipLevel": video.vipLevel,
            "Info":{
                "Type":video.videoalbumName,
                "Art": '',
                "Status": '',
                "Time": video.videoInfo.publishTime
            }
        })
    })
    const isEnd = (data.totalElements <= pageSize * pageIndex)
    // const isEnd = pageIndex == 1 ? data.totalElements
    // console.log('sarch', result, isEnd, pageIndex);
    return {
        list: result,
        isEnd: isEnd
    };
}

//
const GetAlbum = async (id) => {
    id = id || ''
    const response = await fetch($.LOCAL + `/api/v1/appAlbum?id=${id}`);
    let data = await response.json();
    console.log('categories', data);
    return data;
}

const GetCountryCode = async (type) => {
    if(type == null || type == '')
        return []
    const response = await fetch($.LOCAL + `/api/v1/appCode?type=${type}`);
    let data = await response.json();
    return data.map((v,index) => {
        return {
            id: v.detailCode,
            name: v.detailName
        }
    });
}

const Login = ({username, password}) => {
    return request({
        url: '/api/v1/login-app',
        method: 'post',
        data: {
            loginAcc: username,
            password: password
        }
    })    
}

const Logout = () => {
    return request({
        url: '/api/v1/session',
        method: 'delete'
    })    
}

const Register = (data) => {
    return request({
        url: '/api/v1/register-app',
        method: 'post',
        data
    })    
}

const GetSession = () => {
    return request({
        url: '/api/v1/session',
        method: 'get'
    })    
}

const GetCard = (cardno) => {
    return request({
        url: '/api/v1/card/' + cardno,
        method: 'get'
    })    
}

const Charge = (data) => {
    console.log('data', data)
    return request({
        url: '/api/v1/charge',
        method: 'post',
        data
    })    
}

const GetChargeHistory = (params) => {
    params.sort = 'createTime'
    params.order = 'desc'
    params.page = params.pageIndex
    params.size = params.pageSize
    return request({
        url: '/api/v1/charge',
        method: 'get',
        params: params
    })    
}


export {fetchData,GetHomeData, GetHomeData2, GetVideoInfo, GetVideoInfo2, GetPageList, GetPageList2, GetDoubanInterests,GetPlayUrl, GetSearch, GetSearch2, GetCountryCode, GetAlbum, GetAlbumByLevel, GetLatest, Login, GetSession, Logout, Register, GetCard, Charge, GetChargeHistory}