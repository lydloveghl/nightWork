function cartList(){
    axios.defaults.baseURL = 'http://localhost:8888'
    axios.get('/cart/list',{params:{id:localStorage.getItem('id')},headers:{
            authorization:localStorage.getItem('token')
        }
    }).then(res => {
        if(res.data.code != 1){
            alert("请登录")
            location.href = "login.html"
        }
        var selectNum = 0;
        var totalNum = 0;
        var allPrice = 0;
        res.data.cart.forEach(item => {
            if(item.is_select){
                selectNum++;
                totalNum += item.cart_number;
                allPrice += item.cart_number * (item.is_sale ? (item.price * (parseInt(item.sale_type)/100)) : item.price)
            }
        })
        var str = `<aside><input type="checkbox" id="allSelect" class="allSelect" ${selectNum === res.data.cart.length ? 'checked' : ''}>全选</aside>`;
        console.log(res)
        var allNum = 0;
        for(let i = 0;  i < res.data.cart.length;i++){
            let item = res.data.cart[i];
            str += `
                    <div>
                       <input type="checkbox" data-goodsId = ${item.goods_id} class="selectGoods" ${item.is_select ? 'checked' : ''}> 
                       <img src="${item.img_small_logo}">
                       <p>${item.title}<span>${item.is_sale ? '促销' : ''}<span></p>
                       <div class="price">
                            <span class="startPrice"${item.is_sale ? 'style=text-decoration:line-through;' : ''}">&yen;${item.price}</span>
                            ${item.is_sale ? `<span class="salePrice">&yen;${(item.price * (parseInt(item.sale_type)/100)).toFixed(2)}</span>` : ''}
                        </div>
                        <div class="count"><button class='addNum'>+</button><input type="text" value="${item.cart_number}" class='cartNum'><button class='minusNum'>-</button></div>
                        <span class="allPrice">&yen;${item.is_sale ? `${(item.price * (parseInt(item.sale_type)/100) * item.cart_number).toFixed(2)}` : `${(item.price * item.cart_number).toFixed(2)}`}</span>
                        <button class="delete" data-delete=${item.goods_id}>删除</button>
                    </div>`
        }
        str += `<footer><span>总计${totalNum}</span><button class="clearCart">清空购物车</button>
        <span>总价:${allPrice.toFixed(2)}</span><button class="deleteSelect">删除所选商品</button><button class="pay">支付</button></footer>`
        document.querySelector('section').innerHTML = str;
    })
}
cartList();
var section = document.querySelector('section');
var cartNum = document.querySelector('.cartNum')
function cartDelete(){
    section.onclick = function(event){
        if(event.target.className === 'delete'){
            axios.get('/cart/remove',{params:{id:localStorage.getItem('id'),goodsId:event.target.dataset.delete},headers:{
                'authorization':localStorage.getItem('token')
            }}).then(res => {
                cartList()
            })
        }
        if(event.target.className === 'clearCart'){
            console.log(event.target)
            axios.get('/cart/clear',{params:{id:localStorage.getItem('id')},headers:{
                'authorization':localStorage.getItem('token')
            }}).then(res => {
                cartList()
            })
        }
        if(event.target.className === "selectGoods"){
            event.target.checked = !event.target.checked
            axios.post('/cart/select',{
                id: localStorage.getItem('id'),
                goodsId: event.target.dataset.goodsid,
            },{
                headers:{
                    'content-type':'application/x-www-form-urlencoded',
                    'authorization':localStorage.getItem('token')
                }
            }).then(res => {
                if(res.data.code == 1){
                    // alert('操作成功')
                    cartList()
                }
            })
        }
        if(event.target.className === 'addNum'){
            axios.post('./cart/number',{
                id: localStorage.getItem('id'),
                goodsId:event.target.parentNode.parentNode.children[0].dataset.goodsid,
                number:Number(event.target.parentNode.children[1].value) + 1
            },{
                headers:{
                    'content-type':'application/x-www-form-urlencoded',
                    'authorization':localStorage.getItem('token')
                }
            }).then(res => {
                if(res.data.code != 1){
                    console.log(res)
                    return;
                }
                console.log(res)
                cartList()
            })
        }
        
        if(event.target.className === 'minusNum'){
            axios.post('./cart/number',{
                id: localStorage.getItem('id'),
                goodsId:event.target.parentNode.parentNode.children[0].dataset.goodsid,
                number:Number(event.target.parentNode.children[1].value) - 1
            },{
                headers:{
                    'content-type':'application/x-www-form-urlencoded',
                    'authorization':localStorage.getItem('token')
                }
            }).then(res => {
                if(res.data.code != 1){
                    console.log(res)
                    return;
                }
                cartList()
            })
        }
        if(event.target.className === "allSelect"){
            console.log(Number(event.target.checked))
            axios.post('/cart/select/all',{
                id:localStorage.getItem('id'),
                type:Number(event.target.checked)
            },{
                headers:{
                    'content-type':'application/x-www-form-urlencoded',
                    'authorization':localStorage.getItem('token')
                }
            }).then(res => {
                if(res.data.code != 1){
                    alert('修改失败')
                    return;
                }
                cartList()
            })
        }
        if(event.target.className === 'pay'){
            axios.post('/cart/pay',{
                id: localStorage.getItem('id')
            },{
                headers:{
                    'content-type':'application/x-www-form-urlencoded',
                    'authorization':localStorage.getItem('token')
                }
            }).then(res => {
                if(res.data.code != 1){
                    alert('支付失败')
                }
                location.href = 'pay.html'
            })
        }
        if(event.target.className === 'deleteSelect'){
            async function deleteSelect(){
                    let res = await axios.get('/cart/remove/select',{params:{id:localStorage.getItem('id')},headers:{'authorization':localStorage.getItem('token')}})
                    cartList()
            }
            deleteSelect()
        }
    }
}
cartDelete();