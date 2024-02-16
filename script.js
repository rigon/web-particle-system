function Particles(elemId, numberParticles, radius, force) {
    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.heading = 0; //Math.random() * Math.PI * 2;
        this.speed = 0; //Math.random() * 5;
        this.visited = false;

        this.distance = function(x,y) {
            return Math.sqrt((Math.pow(x-this.x,2))+(Math.pow(y-this.y,2)))
        }
    }

    let parts = new Array();
    let previousMove;

    let elem = document.getElementById(elemId);
    elem.width  = elem.clientWidth;
    elem.height = elem.clientHeight;

    let ctx = elem.getContext("2d");

    this.init = function() {
        const width = elem.clientWidth;
        const height = elem.clientHeight;
        const size = Math.sqrt(elem.clientWidth*elem.clientHeight / numberParticles);//(width + height) / NPARTS; //Math.sqrt(width*width + height*height) / NPARTS;
        //console.log("width", width, "height", height, "size", size, "numberLines", numberLines, "partsPerLine", partsPerLine);
        const numberLines = Math.trunc(height / size);
        const partsPerLine = Math.trunc(width / size);

        let index = 0;
        for(i=0; i<numberLines; i++)
            for(j=0; j<partsPerLine; j++, index++)
        // for(i=numberLines/2-1; i<numberLines/2; i++)
        //     for(j=partsPerLine/2-2; j<partsPerLine/2; j++, index++)
                parts[index] = new Particle(j*size+size/2, i*size+size/2);
    }

    this.draw = function() {
        let zones = new Array();
        for(i=0; i<parts.length; i++) {
            let p = parts[i];
            let zx = Math.trunc(p.x/force);
            let zy = Math.trunc(p.y/force);

            if(zones[zx] == undefined)
                zones[zx] = new Array();

            if(zones[zx][zy] == undefined)
                zones[zx][zy] = new Array();

            zones[zx][zy].push(p);
        }
        for(i=0; i<parts.length; i++) {
            let p = parts[i];

            let xs = 0;
            let ys = 0;
            
            function search_neighbourhood(ix, iy) {
                if(zones[ix] == undefined)
                    return;
                let zone = zones[ix][iy];
                if(zone == undefined)
                    return;

                for(j=0; j<zone.length ; j++) {
                    let z = zone[j];
                    let dist = p.distance(z.x, z.y);
                    if(dist < force && p !== z) {
                        let a = Math.atan2(p.y-z.y, z.x-p.x);
                        xs -= (force / Math.pow(dist, 2)) * Math.cos(a);
                        ys -= (force / Math.pow(dist, 2)) * Math.sin(a);
                    }
                }
            }

            let zx = Math.trunc(p.x/force);
            let zy = Math.trunc(p.y/force);
            let dx = (Math.round(p.x/force)-zx) * 2 - 1;    // -1 or 1
            let dy = (Math.round(p.y/force)-zy) * 2 - 1;    // -1 or 1
            // Only 4 zones influence the particle
            search_neighbourhood(zx, zy);
            search_neighbourhood(zx + dx, zy);
            search_neighbourhood(zx, zy + dy);
            search_neighbourhood(zx + dx, zy + dy);

            //let zangle = Math.atan(xs/xs) - p.heading;
            let px = p.speed * Math.cos(p.heading);
            let py = p.speed * Math.sin(p.heading);
            let hypotenuse = Math.sqrt(Math.pow(px+xs,2) + Math.pow(py+ys,2));
            //let heading = Math.asin(p.speed / hypotenuse * Math.sin(zangle));
            //Math.asin(p.speed / h * Math.sin(angle)) + heading;
            let heading = Math.atan2(py+ys, px+xs);
            if(hypotenuse > p.speed + 1)
                hypotenuse = p.speed + 1;

            p.pressure = Math.abs(hypotenuse - p.speed)*100;
            p.temp_heading = heading;
            p.temp_speed = hypotenuse;
        }
        for(i=0; i<parts.length; i++) {
            let p = parts[i];
            p.heading = p.temp_heading;
            p.speed = p.temp_speed;
            // delete p.temp_heading;
            // delete p.temp_speed;
        }


        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for(i=0; i<parts.length; i++) {
            let p = parts[i];

            p.x += p.speed * Math.cos(p.heading);
            p.y -= p.speed * Math.sin(p.heading);

            // Simulate drag
            p.speed *= 0.99;

            // Reflect on borders
            if(p.x < 0) {
                p.heading = Math.PI - p.heading;
                p.x = 0;
            }
            if(p.x > ctx.canvas.width) {
                p.heading = Math.PI - p.heading;
                p.x = ctx.canvas.width;
            }

            if(p.y < 0) {
                p.heading = Math.PI - p.heading + Math.PI;
                p.y = 0;
            }
            if(p.y > ctx.canvas.height) {
                p.heading = Math.PI - p.heading + Math.PI;
                p.y = ctx.canvas.height;
            }

            ctx.beginPath()
            ctx.strokeStyle = "hsl(" + p.pressure + ", 100%, 50%)";
            ctx.rect(p.x-5, p.y-5, 10, 10);

            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.speed * Math.cos(p.heading)*10, p.y - p.speed * Math.sin(p.heading)*10);
            ctx.stroke();
        }
    }

    this.move = function(event) {
        if(previousMove == undefined) {
            previousMove = event;
            return;
        }

        var x1 = previousMove.clientX;
        var y1 = previousMove.clientY;
        var x2 = event.clientX;
        var y2 = event.clientY;

        if(x1 == x2 && y1 == y2)
            return;

        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        var speed = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        var heading = Math.atan2(y1-y2, x2-x1);

        //console.log("Ponto 1", x1, y1, "Ponto 2", x2, y2, "Vector", heading);
        //console.log(Math.trunc(heading*180/Math.PI));

        for(i=0; i<parts.length; i++) {
            let p = parts[i];
            let distance = p.distance(x2,y2);

            if(p.visited == false && distance < radius ) {
                //console.log("VECTOR", speed, heading);

                // Vector of the movement made with the mouse
                let magnitude = speed * ((radius - distance) / radius);
                // Angle formed between the mouse and particle vectors
                //let angle = 2*Math.PI - 2*(p.heading - heading);
                let angle = 2*Math.PI - 2 * (p.heading - heading);

                //console.log("BEFORE", p);
                //console.log("VECTOR", angle, magnitude);

                // Law of cosines
                let h = Math.sqrt(Math.pow(p.speed, 2) + Math.pow(magnitude, 2) - 2 * p.speed * magnitude * Math.cos(angle));
                // Law of sines
                let t = Math.asin(p.speed / h * Math.sin(angle)) + heading;
                p.speed = h;
                p.heading = t;
                p.visited = true;
            }

            if(p.visited == true && distance > radius)
                p.visited = false;
        }

        previousMove = event;
    }
    
    this.press = function(event) {
        var x = event.clientX;
        var y = event.clientY;


        for(i=0; i<parts.length; i++) {
            let p = parts[i];
            let distance = p.distance(x,y);

            if(distance < radius ) {
                let magnitude = (radius - distance)*0.2;
                let angle = Math.atan2(y-p.y, p.x-x);
                p.speed = magnitude;
                p.heading = angle;
            }
        }
    }

    this.init();
    elem.addEventListener("click", this.press);
    elem.addEventListener("mousemove", this.move);
    
    setInterval(this.draw, 1000/60);
    this.draw();
}
