import { _decorator, Component, EventMouse, Input, input, Node, Vec3, Animation } from 'cc';
const { ccclass, property } = _decorator;
export const BLOCK_SIZE = 40;

@ccclass('NewComponent')
export class NewComponent extends Component {
    @property(Animation)
    BodyAnim:Animation = null;
    //是否开始跳跃： _startJump，用于判断角色是否在跳跃状态
    private _startJump: boolean = false;
    //跳跃步数
    private _jumpStep: number = 0;
    //当前的跳跃时间
    private _curJumpTime: number = 0;
    //跳跃时间
    private _jumpTime: number = 0.1;
    //移动速度
    private _curJumpSpeed: number = 0;
    //当前位置
    private _curPos: Vec3 = new Vec3();
    //位移
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    //目标位置
    private _targetPos: Vec3 = new Vec3();
    
    start() {
        input.on(Input.EventType.MOUSE_UP,this.onMouthUp,this);
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) {
                this.node.setPosition(this._targetPos);
                this._startJump = false;
            }else{
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed*deltaTime;
                Vec3.add(this._curPos,this._curPos,this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }

    onMouthUp(event:EventMouse){
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        } else if(event.getButton() === 2){
            this.jumpByStep(2);
        } else if(event.getButton() === 1) {
            this.jumpByStep(-2);
        }
    }
    jumpByStep(step:number){
        //判断是否在跳跃中
        if (this._startJump) {
            return
        }
        this._startJump = true;//标记开始跳跃
        this._jumpStep = step;//跳跃步数

        const clipName = step == 1 ? 'oneStep' : 'twoStep';  // 1. 选择动画片段
        const state = this.BodyAnim.getState(clipName);      // 2. 获取动画状态
        this._jumpTime = state.duration;                    // 3. 设置跳跃时间

        this._curJumpTime = 0;//重置开始跳跃时间
        this._curJumpSpeed = this._jumpStep*BLOCK_SIZE / this._jumpTime;//计算速度
        this.node.getPosition(this._curPos);//当前位置
        Vec3.add(this._targetPos,this._curPos,new Vec3(this._jumpStep*BLOCK_SIZE,0,0));//计算目标位置
        if (this.BodyAnim) {
            if (step === 1) {
                this.BodyAnim.play('oneStep')
            } else if (step === 2) {
                this.BodyAnim.play('twoStep')
            } else if (step === -2) {
                this.BodyAnim.play('twoStep')
            }
        }
    }

}


