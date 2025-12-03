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
    setLines(lines){
        this.lines = lines
        // this.setContainers(this.lines,dense)
    }
    getLineContainers(dense=false){
        const lineContainers = [];
        if(!dense){
            this.lines.forEach(line=>{
                const lineContainer = [line];
                lineContainers.push(lineContainer);
            })
        }else{
            const history = [];
            this.lines.forEach(line => {
                for(let i=0,m=lineContainers.length;i<m;i++){
                    const inLines = lineContainers[i];
                    if(inLines.some((inLine)=>{ return (line.start < (inLine.end+1) && inLine.start < (line.end+1)) })){ //충돌하는 것이 있는 경우 
                        continue;
                    }else{ //충돌하는 것이 하나도 없는 경우
                        inLines.push(line);
                        // console.log(`${i}번째에 추가`,line);
                        return;
                        
                    }
                }
                // 아무 맞는 조건이 없으면
                {
                    const lineContainer = [line];
                    lineContainers.push(lineContainer);
                    // console.log(`마지막에에 추가`,line);
                }
                
            })
        }
        return lineContainers;
    }


    draw(dense=null){
        const rootElement = this.rootElement;
        rootElement.style.setProperty('--max-grow',this.maxGrow);
        if(dense===null){ dense = rootElement.hasAttribute('data-dense'); }

        this.drawHeader();
        this.drawBackground();
        this.drawBody(dense);
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

    drawBody(dense=false){
        const bodyElement = this.bodyElement;
        if(!bodyElement) return;
        
        const linesElement = bodyElement.querySelector('.lines');
        if(!linesElement) return;
        linesElement.replaceChildren();
        // console.log(this.lineContainers);

        const lineContainer = this.getLineContainers(dense)
        lineContainer.forEach((lines)=>{
            const lineContainerElement = this.createLineContainerElement(lines);
            // console.log(lines);
            
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
        lineElement.style.setProperty('--start',line.start);
        lineElement.style.setProperty('--end',line.end);
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