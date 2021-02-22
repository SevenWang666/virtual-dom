//类型声明
const vnodeType = {
    HTML:'HTML',
    TEXT:'TEXT',
    COMPONENT:'COMPONENT',
    CLASS_COMPONENT:'CLASS_COMPONENT'
}
const childType = {
    EMPTY:'EMPTY',
    SINGLE:'SINGLE',
    MULTIPLE:'MULTIPLE'
}
//新建虚拟dom
//元素，属性，子元素
function createElement(tag,data,children=null){
    let flag
    if(typeof tag==='string'){
        flag=vnodeType.HTML
    }else if(typeof tag==='function'){
        flag = vnodeType.COMPONENT
    }else{
        flag = vnodeType.TEXT
    }
    let childrenFlag
    if(children==null){
        childrenFlag = childType.EMPTY
    }else if(Array.isArray(children)){
        if(children.length ===0){
            childrenFlag = childType.EMPTY
        }else{
            childrenFlag = childType.MULTIPLE
        }
    }else{
        childrenFlag = childType.SINGLE
        children =createTextVnode(children)
    }
    return {
        flag,
        tag,
        data,
        children,
        childrenFlag,
        el:null
    }
}
//渲染
function render(vnode,container){
    //区分首次渲染和再次渲染
    mount(vnode,container)
}
//首次挂载元素
function mount(vnode,container){
    let {flag } =vnode
    if(flag ==vnodeType.HTML){
        mountElement(vnode,container)
    }else if(flag===vnodeType.TEXT){
        mountText(vnode,container)
    }
}
//挂载元素节点
function mountElement(vnode,container){
    let dom = document.createElement(vnode.tag)
    vnode.el = dom
    let {data,children,childrenFlag} = vnode
    //挂载data属性
    if(data){
        for(let key in data){
            patchData(dom,key,null,data[key])
        }
    }

    if(childrenFlag!==childType.EMPTY){
        if(childrenFlag ==childType.SINGLE){
            mount(children,dom)
        }else if(childrenFlag == childType.MULTIPLE){
            for(let i=0;i<children.length;i++){
                mount(children[i],dom)
            }
        }
    }
    container.appendChild(dom)
}
function patchData(el,key,prev,next){
    switch(key){
        case "style":
            for(let k in next){
                el.style[k] = next[k]
            }
            break;
        case 'class':
            el.className=next
            break
        default:
            if(key[0]==='@'){
                if(next){
                    el.addEventListener(key.slice(1),next)
                }
            }else{
                el.setAttribute(key,next)
            }
    }
}
//挂载文本节点
function mountText(vnode,container){
    let dom = document.createTextNode(vnode.children)
    vnode.el=dom
    container.appendChild(dom)
}
//新建文本类型的vnode
function createTextVnode(text){
    return {
        flag:vnodeType.TEXT,
        tag:null,
        data:null,
        children:text
    }
}