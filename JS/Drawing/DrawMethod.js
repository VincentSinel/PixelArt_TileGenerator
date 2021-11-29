var previewCanvas = document.getElementById("ZoomView");
var fileName = "";
var WaterCreated = false;
var WaterData = [];
var tick = 0;

function DrawGrass(){

    let TileWidth = document.getElementById("TileSizeXGrass").value;
    let TileLength = document.getElementById("TileSizeYGrass").value;
    let grassH = document.getElementById("GrassHeight").value;
    let grassW = document.getElementById("GrassWidth").value;
    let grassQ = document.getElementById("GrassQuantity").value;
    let ColorNoise = document.getElementById("ColorNoise").value;
    let ColorBackNoise = document.getElementById("ColorBackNoise").value;

    let Color1 = document.getElementById("LightColor").value.convertToRGBA();
    Color1[3] = parseFloat(document.getElementById("ALightColor").value) * 255;
    let Color2 = document.getElementById("DarkColor").value.convertToRGBA();
    Color2[3] = parseFloat(document.getElementById("ADarkColor").value) * 255;
    let Color3 = document.getElementById("BackColor").value.convertToRGBA();
    Color3[3] = parseFloat(document.getElementById("ABackColor").value) * 255;

    let sprite = new TileSprite3D(TileWidth,TileLength,grassH);
    let x,y,z;
    let c2 = new Color(Color1[0],Color1[1],Color1[2],Color1[3]);
    let c1 = new Color(Color2[0],Color2[1],Color2[2],Color2[3]);
    let c3 = new Color(Color3[0],Color3[1],Color3[2],Color3[3]);

    let g1 = new Gradiant(c3);
    g1.Param.Variation = ColorBackNoise

    sprite.Fill(g1);
    for (let t = 0; t < grassQ; t++) {
        let bezier = new Bezier();
        let angle = Math.random() * Math.PI * 2;
        let radius = Math.random() * grassW;

        x = Math.random() * TileWidth;
        y = Math.random() * TileLength;
        z = (Math.random() * 0.2 + 0.8) * grassH;

        bezier.P[0].x = x;
        bezier.P[0].y = y;
        bezier.P[0].z = 0;

        bezier.P[1].x = x;
        bezier.P[1].y = y;
        bezier.P[1].z = z;

        bezier.P[2].x = x + radius * Math.cos(angle);
        bezier.P[2].y = y + radius * Math.sin(angle);
        bezier.P[2].z = z;

        bezier.P[3].x = x + radius * Math.cos(angle);
        bezier.P[3].y = y + radius * Math.sin(angle);
        bezier.P[3].z = (1 - Math.random() * 0.2) * z;

        let g = new Gradiant(c1.Variation(ColorNoise));
        g.Style = Gradiant.GradiantStyle.Linear;
        g.Param = {P1: new Vector(0, 0, 0), P2: new Vector(0,0, z), Style: 0, Variation: 0};
        g.SecondColor = c2.Variation(ColorNoise);

        sprite.DrawBezier(bezier, g);
    }

    previewCanvas.width = TileWidth;
    previewCanvas.height = TileLength;
    previewCanvas.style.transform = "scale(5) translate(0, 40%)";
    previewCanvas.parentNode.style.width = TileWidth * 5 + 10;
    previewCanvas.parentNode.style.height = TileLength * 5 + 10;
    let ctx2 = previewCanvas.getContext("2d");
    ctx2.putImageData(sprite.ImageData(), 0, 0);

    fileName = "Grass.png";


    let div = document.getElementById("Result");
    div.style.backgroundImage = "url(" + previewCanvas.toDataURL("image/png") + ")";
}


function DrawStone(){

    let TileWidth = document.getElementById("TileSizeXRock").value;
    let TileLength = document.getElementById("TileSizeYRock").value;

    let sprite = new Sprite(TileWidth * 3,TileLength * 3);



    
    let color_r = new Color(255,0,0,255);
    let color_g = new Color(0,255,0,255);
    let color_b = new Color(0,0,255,255);
    let color_d = new Color(50,50,50,255);
    let color_l = new Color(255,0,0,100);
    let colors = [
        new Color(255,255,255,255), 
        new Color(255,128,128,255), 
        new Color(128,255,128,255), 
        new Color(128,128,255,255), 
        new Color(255,128, 0,255), 
        new Color(255,0, 128,255), 
        new Color(0,128, 255,255)
    ];
    let grads = [];
    for(let i = 0; i < colors.length; i++)
    {
        grads.push(new Gradiant(colors[i]));
    }


    //let d = new Color(255,255,255,255);
    //let c4 = new Color(0,0,255,0);
    //let c5 = new Color(30, 80, 121,255);
    //let c6 = new Color(62, 143, 210,255);
    //let g2 = new Gradiant(c,c,new Vector(0, 0, 0), new Vector(1, 0, 1));
    //let g3 = new Gradiant(c6, c6, new Vector(0,0,0), new Vector(0,0,1));

    let grad_red = new Gradiant(color_r);
    let grad_vert = new Gradiant(color_g);
    let grad_line = new Gradiant(color_l);

    
    let size = 32;
    let coefy = 2;
    let nbrpoint = 10;
    var voronoi = new Voronoi();
    var bbox = {xl: 0, xr: size*3, yt: 0, yb: coefy * size * 3}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    var sites = [];

    var poisson = new Poisson();
    poisson.width = size;
    poisson.height = size * coefy;
    poisson.point_nbr = nbrpoint;
    let list = poisson.generate_poisson();

    for(let e = 0; e < list.length; e++)
    {
        let ed = list[e];
        sites.push({x: ed.x, y: ed.y});
        sites.push({x: ed.x, y: ed.y + coefy * (size)});
        sites.push({x: ed.x, y: ed.y + coefy * (size * 2)});
        sites.push({x: ed.x + size, y: ed.y});
        sites.push({x: ed.x + size, y: ed.y + coefy * (size)});
        sites.push({x: ed.x + size, y: ed.y + coefy * (size * 2)});
        sites.push({x: ed.x + size * 2, y: ed.y});
        sites.push({x: ed.x + size * 2, y: ed.y + coefy * (size)});
        sites.push({x: ed.x + size * 2, y: ed.y + coefy * (size * 2)});
    }
    var diagram = voronoi.compute(sites, bbox);

    let cell1 = diagram.cells[16];
    let polygon = [];
    sprite.SetPixel(Math.round(cell1.site.x), Math.round(cell1.site.y), color_r);
    for(let e = 0; e < cell1.halfedges.length; e++)
    {
        let edge = cell1.halfedges[e];
        sprite.DrawLine(edge.getStartpoint().x, edge.getStartpoint().y, edge.getEndpoint().x, edge.getEndpoint().y, grad_red);
        polygon.push(new Vector(Math.round(edge.getStartpoint().x), Math.round(edge.getStartpoint().y), 0));
    }
    for(let e = 0; e < polygon.length; e++)
    {
        let edge = polygon[e];
        sprite.SetPixel(edge.x, edge.y, color_g);
    }

    

    for(let i = 0; i < colors.length; i++)
    {
        let p = new Vector(Math.round(Math.random()*32 + 32),Math.round(Math.random()*32 + 32),0);

        if (p.InsidePolygon(polygon))
        {
            sprite.SetPixel(p.x, p.y, colors[i]);

            let v = new Vector(p.x - cell1.site.x, p.y - cell1.site.y, 0);
            let coef = 500 / v.length();
            v.x = v.x * coef + cell1.site.x;
            v.y = v.y * coef + cell1.site.y;

            sprite.DrawLine(v.x, v.y, cell1.site.x, cell1.site.y, grad_line);


            for (let j = 0; j < polygon.length; j++)
            {
                let p = Vector.intersect2D(v, cell1.site,polygon[j], polygon[(j + 1) % polygon.length]);
                if (p)
                {
                    sprite.SetPixel(Math.round(p.x), Math.round(p.y), color_b);
                }
            }


        }
        else
        {
            sprite.SetPixel(p.x, p.y, color_d);
        }
    }





    
        //let g = new PolygonalGradiant(c4,d,poly);
        //g.style = 1
        //g.Param = [3];
    
       // sprite.FillPolygon(poly, new Vector(cell.site.x  - size, cell.site.y / coefy  - size, 0), g);
       // sprite.SetPixel(cell.site.x, Math.floor(cell.site.y / coefy), c);





    
    previewCanvas.width = TileWidth * 3;
    previewCanvas.height = TileLength * 3;
    previewCanvas.style.transform = "scale(5) translate(0, 40%)";
    previewCanvas.parentNode.style.width = TileWidth * 3 * 5 + 10;
    previewCanvas.parentNode.style.height = TileLength * 3 * 5 + 10;
    let ctx2 = previewCanvas.getContext("2d");
    ctx2.putImageData(sprite.ImageData(), 0, 0);

    fileName = "Stone.png";


    let div = document.getElementById("Result");
    div.style.backgroundImage = "url(" + previewCanvas.toDataURL("image/png") + ")";
}




function DrawWater(){

    WaterData = [];
    tick = 0;
    let TileWidth = document.getElementById("TileSizeXWater").value;
    let TileLength = document.getElementById("TileSizeYWater").value;

    let frame = parseInt(document.getElementById("Water_FrameCount").value);


    let Color_B1 = document.getElementById("Water_BackColor1").value.convertToRGBA();
    Color_B1[3] = parseFloat(document.getElementById("Water_ABackColor1").value) * 255;
    let Color_B2 = document.getElementById("Water_BackColor2").value.convertToRGBA();
    Color_B2[3] = parseFloat(document.getElementById("Water_ABackColor2").value) * 255;

    let Color_C1 = document.getElementById("Water_CellColor1").value.convertToRGBA();
    Color_C1[3] = parseFloat(document.getElementById("Water_ACellColor1").value) * 255;
    let Color_C2 = document.getElementById("Water_CellColor2").value.convertToRGBA();
    Color_C2[3] = parseFloat(document.getElementById("Water_ACellColor2").value) * 255;

    let coefperlin = parseInt(document.getElementById("Water_BackColorCoef").value) / 10000.0;
    let Changeperlin = parseInt(document.getElementById("Water_BackColorChangeCoef").value) / 100.0;
    let NoiseBack = parseInt(document.getElementById("Water_BackColorNoise").value);

    let NoiseCell = parseInt(document.getElementById("Water_CellColorNoise").value);
    let SpeedCell = parseInt(document.getElementById("Water_CellColorPow").value);

    let coefy = document.getElementById("Water_CoefY").value;
    let nbrpoint = document.getElementById("Water_NbrPoint").value;

    console.log(coefperlin);
    //console.log(Color_Back2);
    console.log(Changeperlin);

    //let Color_Back1 = new Color(30, 80, 121,255);
    //let Color_Back2 = new Color(23, 62, 94,255);
    let Color_Back1 = new Color(Color_B1[0],Color_B1[1],Color_B1[2],Color_B1[3]);
    let Color_Back2 = new Color(Color_B2[0],Color_B2[1],Color_B2[2],Color_B2[3]);
    let Grad_Back = new Gradiant(Color_Back1, Color_Back2);
    Grad_Back.Style = Gradiant.GradiantStyle.PerlinNoise;
    Grad_Back.Param = {
        Style: 2, 
        Width: TileWidth,
        Height: TileLength,
        Coef: coefperlin,
        Change: Changeperlin, 
        OffSetX: 0,
        OffSetY: 0,
        Variation: NoiseBack};


    //let Color_Cell1 = new Color(0,0,255,0);
    //let Color_Cell2 = new Color(255,255,255,100);
    let Color_Cell1 = new Color(Color_C2[0],Color_C2[1],Color_C2[2],Color_C2[3]);
    let Color_Cell2 = new Color(Color_C1[0],Color_C1[1],Color_C1[2],Color_C1[3]);
    let Grad_Cell = new Gradiant(Color_Cell1, Color_Cell2);
    Grad_Cell.Style = Gradiant.GradiantStyle.Polygonal;
    Grad_Cell.Param = {
        Polygon: [], 
        Center: new Vector(), 
        Style: 1, 
        Pow: SpeedCell, 
        Variation: NoiseCell};

    
    var voronoi = new Voronoi();
    var bbox = {xl: 0, xr: TileWidth * 3, yt: 0, yb: coefy * TileLength * 3}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    var sites = [];
    

    var poisson = new Poisson();
    poisson.width = TileWidth;
    poisson.height = TileLength * coefy;
    poisson.point_nbr = nbrpoint;
    let list = poisson.generate_poisson();
    let move = [];
    let moveforce = 10;
    for(let e = 0; e < list.length; e++)
    {
        move.push([Math.random() * moveforce, Math.random() * moveforce]);
    }

    for(let f=0; f < frame; f++)
    {
        var sites = [];
        let sprite = new Sprite(TileWidth,TileLength);
        let offset = Math.PI * 2 / frame * f;
        Grad_Back.Param.OffSetX = 2*Math.cos(offset);
        Grad_Back.Param.OffSetY = Math.sin(offset);
        sprite.Fill(Grad_Back);
        for(let e = 0; e < list.length; e++)
        {
            let ed = list[e];

            let offx = move[e][0] * Math.cos(offset);
            let offy = move[e][1] * Math.sin(offset)

            if (ed.x + offx <= 0) offx = 0.1 - ed.x;
            if (ed.x + offx >= TileWidth) offx = ed.x - TileWidth - 0.1;
            if (ed.y + offy <= 0) offy = 0.1 - ed.y;
            if (ed.y + offy >= coefy * TileLength) offy = ed.y - coefy * TileLength - 0.1;


            sites.push({x: ed.x + TileWidth * 0 + offx, y: ed.y + coefy * (TileLength * 0) + offy});
            sites.push({x: ed.x + TileWidth * 0 + offx, y: ed.y + coefy * (TileLength * 1) + offy});
            sites.push({x: ed.x + TileWidth * 0 + offx, y: ed.y + coefy * (TileLength * 2) + offy});
            sites.push({x: ed.x + TileWidth * 1 + offx, y: ed.y + coefy * (TileLength * 0) + offy});
            sites.push({x: ed.x + TileWidth * 1 + offx, y: ed.y + coefy * (TileLength * 1) + offy});
            sites.push({x: ed.x + TileWidth * 1 + offx, y: ed.y + coefy * (TileLength * 2) + offy});
            sites.push({x: ed.x + TileWidth * 2 + offx, y: ed.y + coefy * (TileLength * 0) + offy});
            sites.push({x: ed.x + TileWidth * 2 + offx, y: ed.y + coefy * (TileLength * 1) + offy});
            sites.push({x: ed.x + TileWidth * 2 + offx, y: ed.y + coefy * (TileLength * 2) + offy});
        }


        var diagram = voronoi.compute(sites, bbox);

        for (let cel = 0; cel < diagram.cells.length; cel++)
        {
            let cell = diagram.cells[cel];

            let poly = [];
            for(let e = 0; e < cell.halfedges.length; e++)
            {
                let vec = Vector.fromstruct(cell.halfedges[e].getStartpoint());
                vec.x = vec.x - TileWidth;
                vec.y = vec.y / coefy - TileLength;
                poly.push(vec);
            }
        
            Grad_Cell.Param.Polygon = poly;
            Grad_Cell.Param.Center = new Vector(cell.site.x  - TileWidth, cell.site.y / coefy  - TileLength, 0);
        
            sprite.FillPolygon(poly, Grad_Cell);
        }
        WaterData.push(sprite.ImageData())
    }

    


    previewCanvas.width = TileWidth;
    previewCanvas.height = TileLength;
    previewCanvas.style.transform = "scale(5) translate(0, 40%)";
    previewCanvas.parentNode.style.width = TileWidth * 5 + 10;
    previewCanvas.parentNode.style.height = TileLength * 5 + 10;
    let ctx2 = previewCanvas.getContext("2d");
    ctx2.putImageData(WaterData[0], 0, 0);

    fileName = "Water.png";


    let div = document.getElementById("Result");
    div.style.backgroundImage = "url(" + previewCanvas.toDataURL("image/png") + ")";

    WaterCreated = true;
}

function UpdateWater()
{
    if (WaterCreated)
    {
        tick++;
        let speed = 15;
        if (tick % speed == 0)
        {
            let frame = tick / speed;
            let ctx2 = previewCanvas.getContext("2d");
            ctx2.putImageData(WaterData[(frame % WaterData.length)], 0, 0);
        
            
            let div = document.getElementById("Result");
            div.style.backgroundImage = "url(" + previewCanvas.toDataURL("image/png") + ")";
        }
    }
}





function SaveImage(){
    let value = document.getElementById("TypeArt").value;

    if (fileName == "") return;
    var a = document.createElement('a');
    if (value == "Water")
    {
        previewCanvas.width = document.getElementById("TileSizeXWater").value * WaterData.length;
        let ctx2 = previewCanvas.getContext("2d");
        for(let i = 0; i < WaterData.length; i++)
        {
            ctx2.putImageData(WaterData[i], i * document.getElementById("TileSizeXWater").value, 0);
        }
    }

    a.href = previewCanvas.toDataURL("image/png");
    a.download = fileName;
    a.click();
    previewCanvas.width = document.getElementById("TileSizeXWater").value
}


window.FrameUpdate = function () {
    window.requestAnimationFrame( FrameUpdate );
    
    UpdateWater();
};
  
FrameUpdate();