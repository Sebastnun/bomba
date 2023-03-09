
const tic = new Howl({
    src: ['../assets/sound/tic.ogg'],
    volume: 3
});

const explosion = new Howl({
    src: ['../assets/sound/eplosion.ogg'],
    volume: 2
})

const correcto = new Howl({
    src: ['../assets/sound/correcta.ogg']
})


const incorrecto = new Howl({
    src: ['../assets/sound/incorrecta.ogg']
})


class Timer {

    _intervalID;

    

    constructor(minute, seconds, clazz){
        this.clazz = clazz;
        this.time = (minute * 60) + seconds;
    }

    actualizarContador(time, clazz, interval) {
        const contador = document.querySelector(clazz+" span");
        contador.innerHTML = `${this.stringTime(time)}`;
        tic.play();
        this.time--;
        if (time <= 0) {
            clearInterval(this._intervalID);
            this.animation(this.clazz)
        }
    }

    iniciarTemporizador() {
        this._intervalID = setInterval(
            () => this.actualizarContador(this.time, this.clazz), 1000);
    }

    async penalty(minutes, secons){
        if (this._intervalID == null) return
        if(document.querySelector(this.clazz+" span").classList.contains("correct")) return
        incorrecto.play()
        this.time -= ((minutes * 60) + secons );
        if (this.time < 0) this.time = 0;
        clearInterval(this._intervalID)
        this._intervalID = null
        for (let i=0;i<5;i++){
            document.querySelector(this.clazz+" span").classList.add("incorrect");
            await sleep(200)
            document.querySelector(this.clazz+" span").classList.remove("incorrect");
            await sleep(200)
        }
        this.iniciarTemporizador()
    }

    stringTime(time){
        let minutes = Math.floor(time / 60) < 10 
        ? '0'+Math.floor(time / 60) : Math.floor(time / 60);
        let seconds = (time - minutes * 60) < 10 ? "0"+(time - minutes * 60) :
         (time - minutes * 60);
        return `${minutes}:${seconds}`
    }


    correct(){
        document.querySelector(this.clazz+" span").classList.add("correct");
        clearInterval(this._intervalID);
    }

    async animation(clazz){
        incorrecto.play()
        for (let i=0;i<10;i++){
            document.querySelector(clazz+" span").classList.add("incorrect");
            await sleep(200)
            document.querySelector(clazz+" span").classList.remove("incorrect");
            await sleep(200)
        }
        const img = document.querySelector(clazz + " img");
        const container = document.querySelector(clazz);
        explosion.play()
        img.src = getAnimFrame(1)
        img.classList.remove('bomb')
        img.classList.add('explosion')
        await sleep(46)
        for (let i = 2; i < 10; i++){
            img.src = getAnimFrame(i)
            await sleep(26)
        }
        await sleep(100)
        container.classList.add('lose')
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getAnimFrame = (i) => {
    if (0 >= i > 10) return `../assets/anim/10.png`;

    return `../assets/anim/${i}.png`
}



class Bomb {

    started;

    constructor(timer, clazz, res){
        this.timer = timer;
        this.input = document.querySelector(clazz + " input");
        this.btn = document.querySelector(clazz + " button");
        this.img = document.querySelector(clazz + " img");
        this.container = document.querySelector(clazz);
        this.res = res;
        this.started = false;
        this.btn.addEventListener("click", (e) =>{
            this.check()
        });
        this.input.onkeypress = (e) => {
            if (!e) e = window.event;
            let keyCode = e.code || e.key;
            if (keyCode === 'Enter'){
                this.check()
            }
        }
    }


    start() {
        this.started = true
        this.timer.iniciarTemporizador()
    }

    async check(){
        if (!this.started) return;
        if (this.input.value === this.res){
            this.input.value = ''
            this.timer.correct()
            correcto.play()
        }else{
            this.input.value = ''
            await this.timer.penalty(0,30)
        }
    }


}


document.querySelector('.btn').addEventListener('click', e => {
    const easyBomb = (clazz,res) => new Bomb(new Timer(min,sec,clazz),clazz,res)
    let bomb1 = easyBomb('.timer1',res1)
    let bomb2 = easyBomb('.timer2',res2)
    let bomb3 = easyBomb('.timer3',res3)
    bomb1.start()
    bomb2.start()
    bomb3.start()
})

/*
let timer1 = new Timer(0, 10, ".timer2")
timer1.iniciarTemporizador()
document.querySelector(" button")
timer1.penalty(0,3)*/




