window.onload = function(){
    //顾客状态值有5个：possible(来了)，waiting（等饭），ready(就绪)，eating（吃饭），impossible(走了)
    let customer = {
        0: {
            name: "BOSS",
            status: "possible",
            img: "./boss.png"
        },
        1: {
            name: "Amber",
            status: "possible",
            img: "./customer1.png"
        },
        2: {
            name: "LiHua",
            status: "possible",
            img: "./customer2.png"
        },
        3: {
            name: "ZhangSan",
            status: "possible",
            img: "./customer3.png"
        },
        4: {
            name: "LiSi",
            status: "possible",
            img: "./customer4.png"
        },
        5: {
            name: "WangWu",
            status: "possible",
            img: "./customer5.png"
        },
        6: {
            name: "IU",
            status: "possible",
            img: "./customer6.png"
        },
    }
    //有四张桌子
    let table = {
    0: {
        list: [],
        total: 0,
        canUse: true,
        userID: 0,
        money: 0,
        dealCount: 0
    },
    1: {
        list: [],
        total: 0,
        canUse: true,
        userID: 0,
        money: 0,
        dealCount: 0
    },
    2: {
        list: [],
        total: 0,
        canUse: true,
        userID: 0,
        money: 0,
        dealCount: 0
    },
    3: {
        list: [],
        total: 0,
        canUse: true,
        userID: 0,
        money: 0,
        dealCount: 0
    }
    };
    //菜品
    let dishes = {
    0: {
        name: "拍黄瓜",
        type: "liangCai",
        price: 15
    },
    1: {
        name: "酸土豆",
        type: "liangCai",
        price:17
    },
    2: {
        name: "淼鑫猪肚鸡",
        type: "zhuCai",
        price: 30
    },
    3: {
        name: "庆丰包子",
        type: "zhuCai",
        price: 25
    },
    4: {
        name: "肖淳红烧肉",
        type: "zhuCai",
        price: 27
    },
    5: {
        name: "家兴大锅炖",
        type: "zhuCai",
        price: 35
    },
    6: {
        name: "web全家桶",
        type: "zhuCai",
        price: 30
    },
    7: {
        name: "QQ咩咩好喝到咩噗茶",
        type: "yinPin",
        price: 10
    },
    8: {
        name: "水果榨汁",
        type: "yinPin",
        price: 10
    }
    };
    //设置四种颜色
    let color = [
    { color1: "d96d00", color2: "ff9122", status: true },
    { color1: "00af00", color2: "80ff00", status: true },
    { color1: "b20000", color2: "ff2020", status: true },
    { color1: "7a4dff", color2: "ac91ff", status: true }
    ];
    //厨师列表 free和busy两种状态（一开始都是free）
    let chef = {
    0: {
        status: "free"
    },
    1: {
        status: "free"
    }
    }
    const paddingchange = 20;//改变padding宽度%
    //时间
    const cookTime = 5000;
    const eatTime = 5000;
    const waiteTime = 10000;
    //时间间隔
    const cookChange = 20;
    const waiteChange = 5;
    const eatChange = 20;
    //等待，煮食，做完菜队列
    let waiteList = [];
    let cookList = [];
    let finishCookList = [];
    let zz = 0; //指针
    let weekCount = 1;//第几周
    let dayCount = 1;//第几天
    let chefCount = 2;//厨师数量
    let waitePadding = 100;//一开始顾客来到时padding占据的宽度%
    let eatingPeople = 0;//吃饭的人的数量
    let cookCount = 0;//要做的菜的数量
    let date = new Date();
    let sButton = null;
    let qButton = null;
    let dButton = null;
    let fireChef = null;
    let removeWaitingListListener = null;
    let cssNode = document.createElement("style");
    cssNode.id = "HTT_Style";
    cssNode.setAttribute("type", "text/css");
    cssNode.innerHTML = "* {\n" +
    "    font-family: Arial, Helvetica, sans-serif;\n" +
    "}";
    document.body.appendChild(cssNode);
    
    //初始化
    let start = document.getElementById("start");
    let addChef1 = document.getElementById("add-chef-icon");
    let addChef2 = document.getElementById("addChef");
    let fireButton = document.getElementById("fire");
    let weekend = document.getElementById("weekend");
    let day = document.getElementById("day");
    let income = document.getElementById("income");

    //消息提示 type指提示类型 text指提示的内容 time指提示显示的时间
    function showAlert(type, text, time) {
        let centerAlert = document.getElementById("center_alert");//获取提示窗口
        let remindText = document.getElementById("center_alert_p");
        let backgroundColor;//背景颜色
        if (type === "warning") {
            backgroundColor = "background-color: #ffb399;";
        } else if (type === "remind") {
            backgroundColor = "background-color: #d9e67d;";
        }
        if (text) {
            remindText.innerHTML = text;
        }
        centerAlert.setAttribute("style", "display:block;" + backgroundColor);
        //超出time则隐藏
        setTimeout(() => {
            centerAlert.setAttribute("style", "display:none;" + backgroundColor);
        }, time);
    }
    //初始化
    function init() {
        const cusWaiteTime = 2000; //等待时间是2秒钟
        const cusComeTime = 3000; //三秒钟来一个客人
        let id = 0;//指customer的id
        let welcome = document.getElementById("welcome");//欢迎窗口
        welcome.style.display = "none";//隐藏欢迎窗口
        showAlert("warning", "餐厅目前有空位，赶紧点击等位客人头像让客人入座点餐吧", 2000);//提示
        waiteList.push(id);//等待队列中放入id
        customer[id].status = "possible";//设置顾客的状态为等待
        newCustomerComing(id, cusWaiteTime);//顾客到来
        //定时执行操作
        let timer = setInterval(() => {
            if (id < 6) {
                id++;
                waiteList.push(id);
                customer[id].status = "possible";
                newCustomerComing(id, cusWaiteTime);
            } else {
                clearInterval(timer);//取消定时操作
            }
        }, cusComeTime);
    }

    //添加事件
    start.addEventListener("click", init);
    addChef1.addEventListener("click", addChef);

    //顾客坐下
    function arrangeSeat(id) {
        for (let i in table) {
            if (table[i].canUse === true) { //如果桌子可以使用
                table[i].id = id;//顾客的id赋给桌子的id
                eatingPeople++;//吃饭人数+1
                showMenu(id, i);//打开菜单
                break;
            }
        }
    }
     
    //删除等待中的顾客
    function delWaitCustomer(parentElement, waitingBox, status, id) {
        if (typeof waitingBox === 'object') {
            if (parentElement.children.length > 0) {
                parentElement.removeChild(waitingBox);
            }
            waitePadding += paddingchange;
            paddingLeft = "padding-left:" + waitePadding + "vw";
            parentElement.setAttribute("style", paddingLeft);
            customer[id].status = status;
        }
    }
    
    //顾客到来
    function newCustomerComing(id, waitingTime) {
        const change = 20;//时间间隔
        const id_temp = id;//顾客id
        let firstColor = 0;//第一种颜色占比
        let secondColor = 100;//第二种颜色占比
        let parentElement = document.getElementById("wait-box");//空白div，用来显示顾客的图片
        waitePadding -= paddingchange;//每出现一次顾客，那么padding-left占据的宽度-20%
        let paddingLeft = "padding-left:" + waitePadding + "vw";//设置padding-left占据的宽度

        //新建一个div(增加顾客图片)
        let div_waiting = document.createElement("div");
        if(id!=0){
            div_waiting.innerHTML = "<div class=\"customer-icon\">\n" +
            "                    <img src=\"./customer" + id_temp + ".png\">\n" +
            "                </div>\n" +
            "                <div class=\"waiting-text\" id=\"waiting-text" + id_temp + "\">\n" +
            "                    等位中\n" +
            "                </div>";
        }
        else{
            div_waiting.innerHTML = "<div class=\"customer-icon\">\n" +
            "                    <img src=\"./boss.png\">\n" +
            "                </div>\n" +
            "                <div class=\"waiting-text\" id=\"waiting-text" + id_temp + "\">\n" +
            "                    等位中\n" +
            "                </div>";
        }
        div_waiting.className = "waiting";//设置class
        div_waiting.id = "waiting" + id_temp;//设置id
        parentElement.appendChild(div_waiting);//在class为"wait-box"的div里添加div_waiting所代表的div
        parentElement.setAttribute("style", paddingLeft);//设置CSS样式
        let waitingBox = document.getElementById("waiting" + id_temp);//第几个等待读条
        let waitingTimeBox = document.getElementById("waiting-text" + id_temp);//等待读条
        //判断餐厅是否有位置
        const newWaitingListener = () => {
            if (eatingPeople < 4) {
                let readyCustomer = waiteList.shift();//删除等待队列的第一个
                arrangeSeat(readyCustomer);//顾客坐下
                let delEle = document.getElementById("waiting" + readyCustomer);
                delWaitCustomer(parentElement, delEle, "ready", readyCustomer);//删除等待中的顾客
            } else {
                showAlert("warning", "餐厅目前没有空位，请耐心等待", 1500);
            }
        }
        waitingBox.addEventListener("click", newWaitingListener);//点击顾客判断是否有位置
        //顾客等待时间的处理
        let timer = setInterval(() => {
            firstColor += change;
            secondColor -= change;
            let background = "background: linear-gradient(-90deg, #2693ff " + firstColor + "%, #006dd9 0" + ", #006dd9 " + secondColor + "%);";//等待读条的颜色变化
            waitingTimeBox.setAttribute("style", background);
            if (firstColor === 100) { //等待时间已过执行删除等待顾客操作
                clearInterval(timer);//取消定时操作
                if (waiteList.indexOf(id_temp) !== -1) {//如果等待队列中有顾客
                    //删除等待中的顾客
                    delWaitCustomer(parentElement, waitingBox, "impossible", id_temp);
                    waiteList.shift();//删去等待队列第一个
                }
            }
        }, waitingTime);
    }

    //顾客不点了
    function updateCustomerStatus(id, menu) {
        customer[id].status = "impossible";
        menu.style.display = "none";
    }

    //判断是哪一张桌子
    function judgeTable(id) {
        switch (id) {
            case "0":
                return "table-firstRow-left";//第一排第一个
                break;
            case "1":
                return "table-firstRow-right";//第一排第二个
                break;
            case "2":
                return "table-secondRow-left";//二排第一个
                break;
            case "3":
                return "table-secondRow-right";//二排第二个
                break;
        }
        return "null";
    }

    //点菜
    function finishOrder(seatNumber, id) {
        const list = document.getElementsByName("menu");
        table[seatNumber].userID = id;//第几个桌子是第几个顾客
        for (let i in list) {
            if (list[i].checked === true) {
                table[seatNumber].list.push(i);//将菜加入到菜表
            }
        }
        let tableList = table[seatNumber].list;
        let parentID = judgeTable(seatNumber);//判断第几张桌子
        let parentElement = document.getElementById(parentID);

        //新建div(增加顾客图片)
        let secondDiv = document.createElement("div");
        secondDiv.className = parentID + "-foodList";
        secondDiv.id = parentID + "-foodList";
        if(id!=0){
            parentElement.innerHTML = "<div id='table" + id + "'>\n" +
                "                    <img src=\"./customer" + id + ".png\">\n" +
                "                </div>";
        }
        else{
            parentElement.innerHTML = "<div id='table" + id + "'>\n" +
                "                    <img src=\"./boss.png\">\n" +
                "                </div>";
        }
        parentElement.appendChild(secondDiv);

        //菜单处理
        let foodList = document.getElementById(parentID + "-foodList");
        for (let j in tableList) {
            //新建div
            let food = document.createElement("div");
            food.className = "food";
            food.innerHTML = dishes[tableList[j]].name;
            foodList.appendChild(food);
        }

        //更改用户状态为吃饭
        customer[id].status = "eating";
        table[seatNumber].canUse = false;
    }

    //返回菜品价格
    function singleFoodPrice(foodName) {
        for (let i in dishes) {
            if (dishes[i].name === foodName) {
                return dishes[i].price;
            }
        }
    }

    //判断是否可以做菜
    function menuCanUse() {
        const list = document.getElementsByName("menu");
        let liangCai = 0,
            zhuCai = 0,
            drinking = 0;
        for (let i in list) {
            if (i < 2) { //凉菜
                if (list[i].checked === true) {
                    liangCai++;
                }
            } else if (i < 7) { //主菜
                if (list[i].checked === true) {
                    zhuCai++;
                }
            } else { //饮品
                if (list[i].checked === true) {
                    drinking++;
                }
            }
        }
        if (liangCai <= 2 && zhuCai>0 && zhuCai<=2 && drinking <= 1) {
            return true;
        }
        return false;
    }
    
    
    //顾客上桌
    function renderTable(seatNumber, id, menu) {
        if (menuCanUse() === true) {//判断是否可以做菜
            finishOrder(seatNumber, id);//点菜

            //修改桌子颜色和菜品的颜色
            let tableNum = judgeTable(seatNumber);//判断第几张桌子
            let parentEleFirst = document.getElementById(tableNum).firstChild;
            let parentEleLast = document.getElementById(tableNum).lastChild;
            let foodDiv = parentEleLast.childNodes;
            let background = "background: linear-gradient(-90deg, #" + color[seatNumber].color1 + " 50%, #" + color[seatNumber].color2 + " 50%);";//第几个桌子就对应第几个颜色
            let backgroundColor = "background-color:#" + color[seatNumber].color2 + ";";//哪个菜对应哪种颜色
            parentEleFirst.setAttribute("style", background);//设置桌子颜色
            for (let j in foodDiv) {
                if ((typeof foodDiv[j]) === 'object') {
                    foodDiv[j].setAttribute("style", backgroundColor); //设置菜品颜色
                    let firstColor = 0;//第一种颜色占比
                    let secondColor = 100;//第二种颜色占比
                    let eatingFood = false;//是否在吃饭
                    let background = "";//进度条
                    let foodName = foodDiv[j].innerHTML;
                    let foodPrice = singleFoodPrice(foodName);
                    //进度条
                    let timer = setInterval(() => {
                        firstColor += waiteChange;
                        secondColor -= waiteChange;
                        background = "background: linear-gradient(-90deg, #" + color[seatNumber].color2 + " " + secondColor + "%, #" + color[seatNumber].color1 + " " + "0,#" + color[seatNumber].color1 + " " + firstColor + "%)";
                        foodDiv[j].setAttribute("style", background);
                        if (finishCookList.length > 0) {
                            for (let k in finishCookList) {
                                if (finishCookList[k].tableNum === seatNumber) { //表示是这桌的菜
                                    let foodId = finishCookList[k].foodID;
                                    //修改菜品对应的颜色
                                    if (foodDiv[j].innerHTML === dishes[foodId].name) {
                                        secondColor = 0;
                                        firstColor = 100;
                                        eatingFood = true;
                                        clearInterval(timer);//重新计时
                                        eatFood(seatNumber, foodDiv[j], seatNumber, background, foodPrice);
                                        finishCookList.shift(); //删除第一道做好的菜
                                    }
                                }
                                break;
                            }
                        }
                        if (eatingFood === false && secondColor <= 0) { //等待时间已到,顾客走人
                            clearInterval(timer);
                            table[seatNumber].dealCount += 1;
                            getMoney(seatNumber);
                            foodDiv[j].setAttribute("style", "text-decoration:line-through;background-color:#505060;");
                        }
                    }, waiteTime / 10);
                } else {
                    break;
                }
            }
            getCookList(seatNumber); //生成厨房菜单
            kitchenOpe(); //开始厨房操作
            let renderText = customer[id].name + "完成点餐，等候用餐\n疯狂点击厨师头像可以加速做菜";
            showAlert("remind", renderText, 2000);
            menu.style.display = "none";
        }
    }

    //处理菜单
    function handleMenu(id) {
        let totalPrice = 0;
        let order = document.getElementById("order");
        let menuId = document.getElementById("menu_title");
        const list = document.getElementsByName("menu");
        for (let i in list) {
            if (list[i].checked === true) {
                totalPrice += parseInt(list[i].value);
            }
        }
        let text = customer[id].name + "正在点菜，已点" + totalPrice + "元的菜";
        menuId.innerHTML = text;
        if (menuCanUse()) {//判断是否可以上=做菜
            order.setAttribute("style", "background: linear-gradient(180deg, #ffe699 50%, #ffd24d 50%);border: 3px solid #a2811d;color: #a2811d;");//可以做菜
        } else {
            order.setAttribute("style", "background: linear-gradient(180deg, #ded3ba 50%, #d3c6a5 50%);border: 3px solid #938867;color: #938867;");//没点主菜不能做菜
        }
    }

    //打开菜单
    function showMenu(id, seatNumber) {
        const menuImg = document.getElementById("menu_pic");//顾客图片
        const list = document.getElementsByName("menu");//菜单
        const order = document.getElementById("order");//点好了，快点上菜按钮
        const quit = document.getElementById("quit");//退出
        let menu = document.getElementById("menu");//菜单div
        let menuId = document.getElementById("menu_title");//点菜信息 
        let text = customer[id].name + "正在点菜，已点0元的菜";
        menu.style.display = "block";
        menuImg.src = customer[id].img;
        menuId.innerHTML = text;
        order.setAttribute("style", "background: linear-gradient(180deg, #ded3ba 50%, #d3c6a5 50%);border: 3px solid #938867;color: #938867;");//点好了快上菜按钮初始化

        //菜单上的选项设为未选择的状态
        list.forEach((item) => {
            item.checked = false;
        })
        list.forEach((item) => {
            item.addEventListener("change", () => {
                handleMenu(id);
            })
        })
        
        const newQB = () => {
            updateCustomerStatus(id, menu);//顾客不点了
        }   
        quit.removeEventListener("click", qButton);
        quit.addEventListener("click", newQB);
        qButton = newQB;
        
        const newSB = () => {
            renderTable(seatNumber, id, menu);//顾客上桌
        }
        order.removeEventListener("click", sButton);
        order.addEventListener("click", newSB);
        sButton = newSB;
    }

     //生成厨房菜单
     function getCookList(seatNumber) {
        const list = document.getElementsByName("menu");
        for (let i in list) {
            if (list[i].checked === true) {
                cookCount++;
                let cookMsg = {
                    tableNum: seatNumber,
                    foodID: i,
                    colorID: seatNumber,
                    status: "wait"
                };
                cookList.push(cookMsg); //将菜号和桌号加入厨房列表
            }
        }
    }

    //如果等待队列大于0执行厨房操作
    setInterval(() => {
        if (cookList.length > 0) {
            kitchenOpe();//厨房操作
        }
    }, 500);

     //倒闭
     setInterval(() => {
        let nextDay = true;
        for (let i in customer) {
            if (customer[i].status !== "impossible") {
                nextDay = false;
            }
        }
        if (nextDay) {
            waitePadding = 100;
            let clearWaitArea = document.getElementById("wait-box");
            clearWaitArea.innerHTML = "";
            dayCount++;
            day.innerHTML = "D" + dayCount;
            init(); //重新初始化
            if (dayCount % 7 === 0) {
                weekCount++;
                weekend.innerHTML = "W" + weekCount;
                let updateMoney = parseInt(income.innerHTML) - (chefCount * 100);
                income.innerHTML = updateMoney;
            }
        } else if (nextDay) {
            showAlert("warning", "餐厅因经营不善倒闭，请刷新页面重新开始！", 3000);
        }
    }, 3000);
    
    
    //厨房操作
    function kitchenOpe() {
        for (let i = zz; i < cookList.length; i++) {
            if (cookList[i].status !== "wait") { //表示正在做或者已完成
                continue;
            }
            let foodID = cookList[i].foodID;//第几道菜
            let foodName = dishes[foodID].name;//菜名
            let colorID = cookList[i].colorID;//第几种颜色
            //厨师循环
            for (let j in chef) {
                if (chef[j].status === "free") {// 找到空闲的厨师
                    cookList[i].status = "ing";
                    let firstColor = 0;
                    let secondColor = 120;
                    if (j > 1) { // 隐藏厨师的解雇按钮。厨师做菜时不能解雇&&第一个、第二个厨师不能解雇
                        let broEle = document.getElementsByClassName("fireCooker")[j - 1];
                        broEle.style.display = "none";
                    }
                    let parEle = document.getElementsByClassName("chef")[j];
                    let curEle = document.getElementsByClassName("chef-icon")[j];
                    let background = "background: linear-gradient(-90deg, #" + color[colorID].color1 + " 50%, #" + color[colorID].color2 + " 50%);";//厨师做菜的背景色
                    curEle.setAttribute("style", background);
                    //新建div
                    let foodNameDiv = document.createElement("div");
                    let id = "cookFood" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + i;
                    foodNameDiv.className = "cookFood";
                    foodNameDiv.id = id;
                    foodNameDiv.innerHTML = foodName;
                    let backgroundColor = "background-color:#" + color[colorID].color2 + ";";
                    foodNameDiv.setAttribute("style", backgroundColor);
                    parEle.appendChild(foodNameDiv);
                    chef[j].status = "busy";
                    if (cookCount > 0) { //如果还有未做的菜
                        kitchenOpe();//厨房操作
                    }

                    //进度条
                    let timer = setInterval(() => { //厨师做菜时间
                        firstColor += cookChange;
                        secondColor -= cookChange;
                        let ele = document.getElementById(id);
                        let background = "background: linear-gradient(-90deg, #" + color[colorID].color2 + " " + secondColor + "%, #" + color[colorID].color1 + " " + "0,#" + color[colorID].color1 + " " + firstColor + "%)";
                        ele.setAttribute("style", background);
                        if (firstColor === 120) { //菜做好了
                            cookCount--; //未做数量减少一个
                            zz++; //指针前进一步
                            cookList[i].status = "finish";
                            finishCookList.push(cookList[i]); //先进先出
                            chef[j].status = "free";
                            background = "background: linear-gradient(-90deg, #aaa 50%, #ddd 50%);";
                            curEle.setAttribute("style", background);
                            if (j > 1) { // 隐藏厨师的解雇按钮。厨师做菜时不能解雇&&第一个厨师不能解雇
                                let broEle = document.getElementsByClassName("fireCooker")[j - 1];
                                broEle.style.display = "block";
                            }
                            let foodDiv = document.getElementById(id);
                            foodDiv.setAttribute("style", "display:none;");
                            clearInterval(timer);
                        }
                    }, cookTime / 5);
                    break;
                }
            }
        }
    }
    
    //吃饭
    function eatFood(seatNumber, foodDivIndex, seatNumber, background, foodPrice) {
        let firstColor = 0;//第一种颜色占比
        let secondColor = 100;//第二种颜色占比
        table[seatNumber].money = parseInt(table[seatNumber].money) + parseInt(foodPrice);
        //进度条
        let timer = setInterval(() => {
            firstColor += eatChange;
            secondColor -= eatChange;
            background = "background: linear-gradient(-90deg, #" + color[seatNumber].color2 + " " + firstColor + "%, #" + color[seatNumber].color1 + " " + "0,#" + color[seatNumber].color1 + " " + secondColor + "%)";
            foodDivIndex.setAttribute("style", background);
            if (secondColor <= 0) { //等待时间已到
                //收钱
                table[seatNumber].dealCount += 1;
                getMoney(seatNumber);
                clearInterval(timer);
            }
        }, eatTime / 5);
    }

    //清理桌子
    function cleanTable(seatNumber) {
        let tableNum = judgeTable(seatNumber);//判断第几张桌子
        let ele = document.getElementById(tableNum);
        let renderHtml = "<div></div>"
        ele.innerHTML = renderHtml;
        table[seatNumber] = {
            list: [],
            total: 0,
            canUse: true,
            userID: 0,
            money: 0,
            dealCount: 0
        };
        if (eatingPeople > 0) {
            eatingPeople--; //正在使用的桌子减少1
        }
    }
    
    //结账
    function getMoney(seatNumber) {
        if ((table[seatNumber].dealCount) === (table[seatNumber].list.length)) { //表示吃完了
            let text = "";
            let customerID = table[seatNumber].userID;
            let customerName = customer[customerID].name;//顾客名
            let income = table[seatNumber].money;//收入
            customer[customerID].status = "impossible";//顾客状态设为走了
            if (income > 0) {
                text = customerName + "完成用餐，收获$" + income;
                let totalIncome = document.getElementById("income");
                let totalIncomeT = parseInt(totalIncome.innerHTML);
                totalIncomeT += parseInt(income);//收入增加
                totalIncome.innerHTML = "" + totalIncomeT;//修改html（收入显示）
                let alertDiv = document.getElementById("center_alert_p");
                alertDiv.setAttribute("style", "text-align:center;");
                showAlert("remind", text, 1500);//显示text内容
            } else {
                text = customerName + "失望而归，别再让客人挨饿了";
                showAlert("warning", text, 1500);//显示text内容
            }
            //清理桌子
            cleanTable(seatNumber);
        }
    }
    
    //新增样式
    function addStyle(newStyle) {
        let style = document.getElementById("HTT_Style");
        style.appendChild(document.createTextNode(newStyle));
    }

    //恢复样式
    function removeStyle() {
        let delStyle = document.getElementById("HTT_Style");
        delStyle.removeChild(delStyle.lastChild);
    }

    //放弃添加厨师
    function notAddBtn() {
        addChef2.style.display = "none";
        removeStyle();
    }

    //确定解除厨师
    function sureFireBtn(chefID) {
        let income = document.getElementById("income");
        let remainMoney = parseInt(income.innerHTML);
        if (parseInt(income.innerHTML) < 99) {
            showAlert("warning", "你的金额以及不足支付解约金", 1500);
        } else {
            fireButton.style.display = "none";
            if (chefCount === 3) { //两行变一行
                removeStyle();
                removeStyle();
            }
            let cookDiv = document.getElementById("cook");
            let removeChefDiv = document.getElementById(chefID);
            cookDiv.removeChild(removeChefDiv.parentNode);
            showAlert("remind", "解约厨师成功，解约支出￥99", 1500);
            remainMoney -= 99;
            income.innerHTML = remainMoney;
            let chefIndex = chefID.split("_")[1];
            delete chef[chefIndex];
            chefCount--;
        }
    }
    //不解除
    function notFireBtn() {
        fireButton.style.display = "none";
        removeStyle();
    }
    
    //删除厨师
    function delChef(chefID) {
        fireButton.style.display = "flex";
        let newStyle = ".bar div{margin: 0 1em;padding: 0 0.5em;}";
        addStyle(newStyle);
        let yes_Btn = document.getElementById("sure-fire-btn");
        let no_Btn = document.getElementById("not-fire-btn");
        const fireChefT = () => {
            sureFireBtn(chefID);
        };
        yes_Btn.removeEventListener("click", fireChef);
        yes_Btn.addEventListener("click", fireChefT);
        fireChef = fireChefT;
        no_Btn.addEventListener("click", notFireBtn);
    }
    
    //确定添加
    function sureAddBtn() {
        let totalIncome = document.getElementById("income");
        let totalIncomeT = parseInt(totalIncome.innerHTML);
        if (chefCount > 8) {
            showAlert("warning", "已达到招聘上限！", 1500);
            return;
        } else if (totalIncomeT < 100) {
            showAlert("warning", "您的金额不足以招聘厨师！", 1500);
            return;
        } else {
            removeStyle();
            let chefDiv = document.createElement("div");
            //添加厨师图片
            chefDiv.innerHTML = "<div class=\"chef-icon\">\n" +
                "                <img src=\"./chef.png\">\n" +
                "            </div>\n" +
                "            <div id=\"chef_" + chefCount + "\" class=\"fireCooker\">\n" +
                "                X\n" +
                "            </div>";
            chefDiv.className = "chef";
            let cookDiv = document.getElementById("cook");
            let addChefDiv = document.getElementById("add-chef");
            cookDiv.insertBefore(chefDiv, addChefDiv);
            let style = ".chef {\n" +
                "    height: 25vw;\n" +
                "}\n" +
                "\n" +
                ".cook {\n" +
                "    margin-bottom: 5vh;\n" +
                "}";
            addStyle(style);
            addChef2.style.display = "none";
            chef[chefCount] = { status: "free" };
            let delChefDiv = document.getElementById("chef_" + chefCount);
            const addChefButtonListener = () => {
                delChef("chef_" + (chefCount - 1));
            };
            delChefDiv.removeEventListener("click", dButton);
            delChefDiv.addEventListener("click", addChefButtonListener);
            dButton = addChefButtonListener;
            chefCount++;
            showAlert("remind", "招聘厨师成功！您已经有" + chefCount + "名厨师", 1500);
            totalIncomeT -= 100;
            totalIncome.innerHTML = "" + totalIncomeT;
            kitchenOpe();//厨房操作
        }
    }

    //添加厨师
    function addChef() {
        addChef2.style.display = "flex";
        let newStyle = ".bar div{margin: 0 1em;padding: 0 0.5em;}";
        addStyle(newStyle);
        let yes_Btn = document.getElementById("yes-btn");
        let no_Btn = document.getElementById("no-btn");
        yes_Btn.addEventListener("click", sureAddBtn);
        no_Btn.addEventListener("click", notAddBtn);
    }

}