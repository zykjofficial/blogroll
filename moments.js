//===========================================================
// 排序算法
function quickSort(arr, keyword){
  // keyword传入值'time'（按发布时间排序）或'updated'（按更新时间排序）
  if(arr.length == 0){return [];}
  var left = [];
  var right = [];
  var selectItem = arr[0];
  for(var i = 1; i < arr.length; i++){
    if(arr[i][keyword] > selectItem[keyword]){
      left.push(arr[i]);
    }
    else{
      right.push(arr[i]);
    }
  }
  return quickSort(left, keyword).concat(selectItem, quickSort(right, keyword));
}
// ======================================================

// 打印友链基本信息
function loadStatistical(sdata){
// 友链页面的挂载容器
var container = document.getElementById('fcircleContainer');
// 基本信息的html结构
var messageBoard =`
<div id="fMessageBoard">
  <div class="fUpdatedTime">
    <span class="fLabel">最近更新时间：</span><span class="fMessage">${sdata.last_updated_time}</span>
  </div>
  <div class="fMessageItem">
    <div class="fActiveFriend fItem">
      <span class="fLabel">活跃友链数</span>
      <meter class="fMeasureBar" value="${sdata.active_num}" min="0" low="${sdata.friends_num*0.3}" high="${sdata.friends_num*0.7}" max="${sdata.friends_num}"></meter>
      <span class="fMessage">${sdata.active_num}/${sdata.friends_num}</span>
    </div>
    <div class="fErrorSite fItem">
      <span class="fLabel">失联友链数</span>
      <meter class="fMeasureBar" value="${sdata.error_num}" min="0" low="${sdata.friends_num*0.3}" high="${sdata.friends_num*0.7}" max="${sdata.friends_num}"></meter>
      <span class="fMessage">${sdata.error_num}/${sdata.friends_num}</span>
    </div>
    <div class="fArticleNum fItem">
      <span class="fLabel">当前库存</span>
      <meter class="fMeasureBar" value="${sdata.article_num}" min="0" max="${Math.ceil(Number( sdata.article_num) / 100) * 100}"></meter>
      <span class="fMessage">${sdata.article_num}/${Math.ceil(Number( sdata.article_num) / 100) * 100}</span>
    </div>
  </div>
  <div id="switchRankBtn">
    <span id="rankByCreated">created</span>
    <span>
    <input type="checkbox" id="switchRankMode" checked="true" onchange="checkRankMode()"/><label for="switchRankMode" id="switchRank">Toggle</label>
    </span>
    <span id="rankByUpdated">updated</span>
  </div>
</div>
`;
// 加载更多按钮
var loadMoreBtn = `
<div id="fcircleMoreBtn" onclick="loadMoreArticle()">
  <i class="fas fa-angle-double-down"></i>
</div>
`
// 原则上信息面板应该在最前面，所以用beforebegin表示从开始符前面插入
if(container){
  container.insertAdjacentHTML('beforebegin', messageBoard);
  // 为了不影响文章加载，选择afterend表示从结束符后面插入
  container.insertAdjacentHTML('afterend', loadMoreBtn);
  }
}

// ======================================================
// 打印友链内容
function loadArticleItem(datalist,start,end){
// 声明友链页面的挂载容器
var container = document.getElementById('fcircleContainer');
// 循环读取输出友链信息
for (var i = start;i<end;i++){
var item = datalist[i];
var articleItem=`
  <div class="fArticleItem">
    <div class="fArticleAvatar">
      <a class="fArticlelink fAvatar" target="_blank" rel="noopener nofollow" href="${item.link}">
        <img src="${item.avatar}" alt="avatar">
      </a>
      <div class="fArticleAuthor">
        ${item.author}
      </div>
    </div>
    <div class="fArticleMessage">
      <a class="fArticleTitle"  href="${item.link}" target="_blank" rel="noopener nofollow" data-title="${item.title}">
        ${item.title}
      </a>
      <div class="fArticleTime">
        <span class="fArticleCreated"><i class="far fa-calendar-alt">发表于</i>${item.created}</span>
        <span class="fArticleUpdated"><i class="fas fa-history">更新于</i>${item.updated}</span>
      </div>
    </div>
  </div>
`;
if(container){
// 为了便于和后续拼接，选择从容器尾部插入
container.insertAdjacentHTML('beforeend', articleItem);
    }
  }
}

// ======================================================
// 抓取友链api信息并进行分割处理。存入本地存储
if (fdata){
  fetch(fdata.apiurl)
    .then(res => res.json())
    .then(json =>{
      // 获取友链朋友圈基本信息
      var statistical_data = json.statistical_data;
      //存入本地存储
      localStorage.setItem("statisticalList",JSON.stringify(statistical_data))
      // console.log(statistical_data);
      // 获取友链朋友圈文章列表
      var article_data = eval(json.article_data);
      // console.log(article_data);
      // 按创建时间排序
      var article_sortcreated = quickSort(article_data,'time');
      //存入本地存储
      localStorage.setItem("createdList",JSON.stringify(article_sortcreated))
      // 按更新时间排序
      var article_sortupdated = quickSort(article_data,'updated');
      //存入本地存储
      localStorage.setItem("updatedList",JSON.stringify(article_sortupdated))
      // console.log(article_sortcreated);
      // console.log(article_sortupdated);
    }
  )
}
// 初始化方法
function initFriendCircle(){
  var statistical_data = JSON.parse(localStorage.getItem("statisticalList"));
  loadStatistical(statistical_data);
  var switchRankMode = document.getElementById("switchRankMode");
  if (switchRankMode  && fdata){
    //按更新时间排序
    if(switchRankMode.checked){
      // console.log("按更新时间排序");
      var article_sortupdated = JSON.parse(localStorage.getItem("updatedList"));
      loadArticleItem(article_sortupdated ,0,fdata.initnumber)
    }else{
      // console.log("按创建时间排序");
      var article_sortcreated = JSON.parse(localStorage.getItem("createdList"));
      loadArticleItem(article_sortcreated ,0,fdata.initnumber)
    }
  }
}

// 加载更多文章
function loadMoreArticle(){
  // 获取当前已加载的文章数
  var currentArticle = document.getElementsByClassName('fArticleItem').length;
  var article_sortcreated = JSON.parse(localStorage.getItem("createdList"));
  // console.log(article_sortcreated);
  // 从当前文章的下一篇开始，加载下一阶程篇数
  loadArticleItem(article_sortcreated,currentArticle,currentArticle + fdata.stepnumber)
  // 向上滚动一篇文章的距离
  window.scrollBy(0,180)
}

//切换按钮
function checkRankMode(){
  // 首先清空现有的文章内容
  document.getElementById('fcircleContainer').innerHTML=''
  // 获取当前选择的排序方式
  var switchRankMode = document.getElementById("switchRankMode");
    if (switchRankMode && fdata){
      //按更新时间排序
      if(switchRankMode.checked){
        // console.log("按更新时间排序");
        var article_sortupdated = JSON.parse(localStorage.getItem("updatedList"));
        loadArticleItem(article_sortupdated ,0,fdata.initnumber)
      }else{
        // console.log("按创建时间排序");
        var article_sortcreated = JSON.parse(localStorage.getItem("createdList"));
        loadArticleItem(article_sortcreated ,0,fdata.initnumber)
      }
    }
  }
//执行初始化方法
initFriendCircle()
