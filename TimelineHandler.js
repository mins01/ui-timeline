class TimelineHandler{
    rootElement = null;
    times = null;
    lines = null;
    maxGrow = 12;
    constructor(rootElement){
        this.rootElement = rootElement;
    }
    get headerElement(){ return this.rootElement.querySelector('.timeline-header'); }
    get backgroundElement(){ return this.rootElement.querySelector('.timeline-background'); }
    get bodyElement(){ return this.rootElement.querySelector('.timeline-body'); }
    
    setTimes(times){
        this.times = times
    }
    setLines(lines,dense=false){
        this.lines = lines
        this.lineContainers = [];
        if(!dense){
            this.lines.forEach(line=>{
                const lineContainer = [line];
                this.lineContainers.push(lineContainer);
            })
        }
    }


    draw(){
        const rootElement = this.rootElement;
        
        const backgroundElement = this.backgroundElement;

        rootElement.style.setProperty('--max-grow',this.maxGrow);

        this.drawHeader();
        this.drawBackground();
        this.drawBody();
    }

    drawHeader(){
        const headerElement = this.headerElement;
        if(!headerElement) return;
        const timesElement = headerElement.querySelector('.times');
        if(!timesElement) return;
        timesElement.replaceChildren();

        this.times.forEach(time => {
            const timeElement = this.createTimeElement(time.grow??1,time.label)
            timesElement.append(timeElement)
        });
    }

    // <div class="time" style="flex-grow:31;"><div class="time-label">1월</div></div>
    createTimeElement(grow=1,label=null){
        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        timeElement.style.flexGrow = grow;
        if(label !== null){
            const labelElement = document.createElement('div');
            labelElement.classList.add('time-label');
            labelElement.textContent = label;
            timeElement.append(labelElement)
        }
        return timeElement;
    }

    drawBackground(){
        const backgroundElement = this.backgroundElement;
        if(!backgroundElement) return;
        
        const timesElement = backgroundElement.querySelector('.times');
        if(!timesElement) return;
        timesElement.replaceChildren();

        this.times.forEach(time => {
            const timeElement = this.createTimeElement(time.grow??1)
            timesElement.append(timeElement)
        });
    }

    drawBody(){
        const bodyElement = this.bodyElement;
        if(!bodyElement) return;
        
        const linesElement = bodyElement.querySelector('.lines');
        if(!linesElement) return;
        linesElement.replaceChildren();
console.log(this.lineContainers);

        this.lineContainers.forEach((lines)=>{
            const lineContainerElement = this.createLineContainerElement(lines);
            console.log(lines);
            
            linesElement.append(lineContainerElement);
        })
        // this.lines.forEach(time => {
        //     const timeElement = this.createTimeElement(time.grow??1)
        //     timesElement.append(timeElement)
        // });
    }

    createLineContainerElement(lines){
        const lineContainerElement = document.createElement('div');
        lineContainerElement.classList.add('line-container');
        lines.forEach((line)=>{
            lineContainerElement.append(this.createLineElement(line));
        })
        return lineContainerElement;
    }

    // <div class="line" data-start="1" data-end="365">
    //     <div class="line-content">
    //         <div class="line-bar text-bg-primary">
    //             <div class="line-icon">A</div>
    //             <div class="line-label">1-12 메세지메세지 메세지</div>
    //         </div>
    //     </div>
    // </div>
    createLineElement(line){
        const lineElement = document.createElement('div');
        lineElement.classList.add('line');
        lineElement.dataset.start = line.start;
        lineElement.dataset.end = line.end;
        line.lineElement = lineElement; // 엘레멘트 연결시킴
        lineElement.append(this.createLineContentElement(line));
        return lineElement;
    }

    createLineContentElement(line){
        const lineContentElement = document.createElement('div');
        lineContentElement.classList.add('line-content');
        
        if(line.lineContentElementHtml){
            lineContentElement.innerHTML = line.lineContentElementHtml;
        }else{
            const lineBarElement = document.createElement('div');
            lineBarElement.classList.add('line-bar');
            lineBarElement.append(line.label??'')
            lineContentElement.append(lineBarElement);
        }
        return lineContentElement;
    }
}