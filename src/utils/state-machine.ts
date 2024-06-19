type State = {
    name:string,
    onEnter?:()=>void|undefined,

}
export class StateMachine {
    _state:Map<string,State>
    _currentState:State|undefined;
    _isChangingState:boolean;
    /**
     * 改变状态的序列，使状态按照顺序执行
     */
    _changingStateQueque:string[]

    _id:string;
    _context:object | undefined;
    /**
     * 
     * @param id 
     * @param context 
     */
    constructor(id:string,context?:object){
        this._id = id
        this._context = context
        this._isChangingState = false
        this._changingStateQueque = []
        this._currentState = undefined
        this._state = new Map()
    }
    get currentStateName(){
        return this._currentState?.name
    }
    update(){
        // console.log(this._changingStateQueque)
        if(this._changingStateQueque.length > 0) {
            this.setState(this._changingStateQueque.shift())
            return
        }
    }
    /**
     * 
     * @param name 
     */
    setState(name:string){
        const methodName = 'setState'
        //状态是否存在
        if(!this._state.has(name)){
            console.warn(`[${StateMachine.name}-${this._id}:${methodName}] try to change unKnown state ${name}`)
            return
        }

        //name判断是不是当前状态
        if(this._isCurrentState(name)){
            return
        }

        if(this._isChangingState){
            console.log('push:',name)
            this._changingStateQueque.push(name)
            return
        }
        this._isChangingState = true
        console.log('正在改变状态1：',this._isChangingState)
        console.log(`[${StateMachine.name}-${this._id}:${methodName}] change from ${this._currentState?.name ?? 'none'} to ${name}`)

        this._currentState = this._state.get(name)


        //运用事件循环机制，先安照代码循序执行，
        //如果onEnter函数中，有settimeout等函数设置 宏任务队列 的操作，
        //isChangingState为同步执行代码没有使用任何队列，会先赋值为false，主代码流程执行完成后，开始执行微任务队列，
        //当微任务队列为空后，开始执行宏任务队列，运行settimeout等函数,状态不会push到_changingStateQueque中。
        //如果没有settimeout等函数设置 宏任务队列 的操作，则按照代码执行顺序，先调用onEnter函数中代码，将状态push到_changingStateQueque中，再为isChangingState赋值为false。
        if(this._currentState?.onEnter){
            console.log(`[${StateMachine.name}-${this._id}:${methodName}] ${this._currentState.name} 被调用`)
            this._currentState.onEnter()
        }
        this._isChangingState = false
        console.log('正在改变状态2：',this._isChangingState)

    }
    /**
     * 
     * @param state 
     */
    addState(state:State){
        this._state.set(state.name,{
            name:state.name,
            //如果 _context 存在，将 state.onEnter 方法绑定到 _context，否则保持原样，
            //bind 方法确保方法调用时的 this 值是指定的对象。
            //bind 确保 state.onEnter 方法在任何调用情况下都能正确访问 _context 对象
            //使用 bind 方法可以避免 this 关键字的值在不同调用上下文中不一致的问题。
            onEnter:this._context ? state.onEnter?.bind(this._context) : state.onEnter
        })
    }
    /**
     * 
     * @param name 
     * @returns 
     */
    _isCurrentState(name:string){
        //有没有当前状态
        if(!this._currentState){
            return false
        }

        return this._currentState.name === name
    }
}