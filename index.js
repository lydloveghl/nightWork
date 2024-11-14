var head = document.querySelectorAll('h1')
var userName = document.querySelector('span')
head[0].style.display = 'block';
head[1].style.display = 'none'
axios({
    method:'get',
    url:'http://localhost:8888/users/info',
    headers:{
        'authorization':localStorage.getItem('token')
    },params:{
        id:localStorage.getItem('id')
    }
}).then(res => {
    if(res.data.code != 1){
        head[0].style.display = 'block';
        head[1].style.display = 'none';
        return;
    }
    head[0].style.display = 'none';
    head[1].style.display = 'block';
    userName.innerText = res.data.info.nickname;
    userName.style.color = 'red'
})
var outBox = document.querySelector('section')
axios.defaults.baseURL = 'http://localhost:8888'
var goodsObj = {
        current:1,
        pagesize:42,
        search:"",
        filter:"",
        saleType:"10",
        sortType:"id",
        sortMethod:"ASC",
        category:""
}
var pageNum = document.querySelector('footer>b')
var pageSelect = document.querySelector('.pageSelect')
function goodsList(){
    axios.get('/goods/list',{
        params:goodsObj
    }).then(res => {
        var str = ''
        res.data.list.forEach(item => {
            str += `<div class = 'goodsBox'>
                        ${item.is_hot ? "<span>畅销</span>" : ""}
                        ${item.is_sort ? "<span>折扣</span>" : ""}
                        <img src = '${item.img_big_logo}' alt = ''/>
                        <div class = 'goodsInfo'>
                            <a href = 'detail.html?goodsid=${item.goods_id}'>
                                <p class = 'goodsName'>${item.title}</p>
                                <p class = 'goodsPrice'>￥${item.price}</p>
                            </a>
                            <button class  = 'addCar'>添加到购物车</button>
                        </div>
                    </div>`
        })
        var pages = ''
        for(let i = 1;i <= res.data.total; i++){
            pages += `<option value="${i}">${i}</option>`
        }
        pageSelect.innerHTML = pages
        pageSelect.value = res.data.yourParams.current
        pageNum.innerText = `${res.data.yourParams.current} / ${res.data.total}`
        outBox.innerHTML = str
    })
}
goodsList();
var categoryList = document.querySelector('ul')
function createList(){
    axios.get('/goods/category').then(res => {
        var str = ''
        res.data.list.forEach(item => {
                str += `<li class = 'categoryBox'>${item}</li>`
        })
        categoryList.innerHTML = str
    })
}
createList()
categoryList.onclick = function(event){
    if(event.target.className === 'categoryBox'){
        for(let i = 0; i < categoryList.children.length; i++){
            categoryList.children[i].classList.remove('active')
        }
        event.target.classList.add('active')
    }
    goodsObj.category = event.target.innerText;
    goodsList();
}
var sortNav = document.querySelector('nav')
sortNav.onclick = function(event){
    if(event.target.className === 'sort_item'){
        for(let i = 0; i < sortNav.children.length; i++){
            sortNav.children[i].classList.remove('active')
        }
        event.target.classList.add('active')
    }
    goodsObj.filter = event.target.dataset.sort;
    goodsList();
}
var searchInput = document.querySelector('input')
searchInput.onchange = function(){
    goodsObj.search = this.value;
    console.log(goodsObj)
    goodsList();
}
var rankBox = document.querySelector('.rank')
rankBox.onclick = function(event){
    if(event.target.className === "rank_item"){
        for(let i = 0; i < rankBox.children.length; i++){
            rankBox.children[i].classList.remove('active')
        }
        event.target.classList.add('active')
        goodsObj.sortType = event.target.dataset.method;
        goodsObj.sortMethod = event.target.dataset.rank;
        goodsList();
    }
}
var pageChange = document.querySelector('footer')
pageChange.onclick = function(event){
    if(event.target.className === 'pageChange'){
        if(goodsObj.current > 1){
            if(event.target.dataset.page === 'down'){
                goodsObj.current -= 1;
                goodsList();
            }
        }
        if(event.target.dataset.page === 'up'){
            goodsObj.current += 1;
            goodsList();
        }
    }
}
pageChange.onchange = function(event){
    if(event.target.className === 'pageSelect'){
        goodsObj.current = event.target.value;
        goodsList();
    }
}
var cartCircle = document.querySelector('.cartCircle')
outBox.onclick = function(event){
    if(event.target.className === 'addCar'){
        var str = event.target.parentNode.children[0].getAttribute('href')
        clickGoodsId = str[str.length - 1]
        var goodsMes = {
            id:localStorage.getItem('id')*1,
            goodsId:clickGoodsId*1
        }
        addCart(goodsMes)
    }
}
function addCart(obj){
    axios.post('/cart/add',obj,{
        headers:{
            'authorization':localStorage.getItem('token'),
            'content-type':'application/x-www-form-urlencoded'
        }
    }).then(res => {
        console.log(res)
        if(res.data.code !== 1){
            alert('res.data.message')
            return;
        }
        cartCreate()
        alert('添加成功')

    })
}
cartCircle.onclick = function(){
    location.href = 'cart.html'
}
function cartCreate(){
    axios.get('/cart/list',{params:{id:localStorage.getItem('id')},headers:{
        authorization:localStorage.getItem('token')
    }}).then(res => {
        cartCircle.style.display = 'inline-block' 
        cartCircle.innerText = res.data.cart.length
    })
}
cartCreate()