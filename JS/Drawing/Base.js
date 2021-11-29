class Color{
    constructor(r, g, b, a) {
      this.R = r;
      this.G = g;
      this.B = b;
      this.A = a;
    }
    
    static transparent(){
      return new Color(0,0,0,0);
    }

    Variation(power){
        let v = Vector.Aleat();
        let r = Math.floor(this.R + v.x * power);
        let g = Math.floor(this.G + v.y * power);
        let b = Math.floor(this.B + v.z * power);
        let a = this.A;

        return new Color(r, g, b, a);
    }
}

class Gradiant{

    static GradiantStyle = {
        None: 0,
        Linear: 1,
        Polygonal: 2,
        PerlinNoise: 3
    }

    constructor(c1, c2 = null)
    {
        this.MainColor = c1;
        if (c2 != null) this.SecondColor = c2;
        else this.SecondColor = c1;
        this.Style = Gradiant.GradiantStyle.None;
        this.Param = {Variation: 0};
        this.Simplex = new SimplexNoise();
    }

    GetColor(p)
    {
        if (this.Style == 0) return this.MainColor.Variation(this.Param.Variation);
        else
        {
            let coef = 0;
            
            if(this.Style == 1) coef = this.GetLinearColor(p);
            else if(this.Style == 2) coef = this.GetPolygonColor2(p);
            else if(this.Style == 3) coef = this.GetPerlinColor(p);

            if (this.Param.Style == 0)
            {
            }
            else if (this.Param.Style == 1)
            {
                coef = Math.pow(coef, this.Param.Pow);
            }
            else if (this.Param.Style == 2)
            {
                coef = coef > this.Param.Change ? 1 : 0;
            }
            let c = new Color(
                this.MainColor.R * (1 - coef) + this.SecondColor.R * coef,
                this.MainColor.G * (1 - coef) + this.SecondColor.G * coef,
                this.MainColor.B * (1 - coef) + this.SecondColor.B * coef,
                this.MainColor.A * (1 - coef) + this.SecondColor.A * coef);

            if (this.Param.Variation) return c.Variation(this.Param.Variation);
            else return c;
        }
    }

    GetLinearColor(p)
    {
        let u = this.Param.P1.VectorTo(this.Param.P2);
        let v = this.Param.P1.VectorTo(p);
        let coef = u.Project(v) / u.length();

        return coef;
    }

    GetPolygonColor(p)
    {
        let v = new Vector(p.x - this.Param.Center.x, p.y - this.Param.Center.y, 0);
        let center_p = v.length();
        let center_u = 500;
        let coef = 500 / center_p;
        v.x = v.x * coef + this.Param.Center.x;
        v.y = v.y * coef + this.Param.Center.y;


        for (let j = 0; j < this.Param.Polygon.length; j++)
        {
            let u = Vector.intersect2D(v, this.Param.Center, this.Param.Polygon[j], this.Param.Polygon[(j + 1) % this.Param.Polygon.length]);
            if (u)
            {
                center_u = (new Vector(u.x - this.Param.Center.x, u.y - this.Param.Center.y, 0)).length();
            }
        }
        coef = center_p / center_u;

        return coef;
    }

    GetPolygonColor2(p)
    {
        let v = new Vector(p.x - this.Param.Center.x, p.y - this.Param.Center.y, 0);
        let center_p = v.length();
        let center_u = 500;
        let coef = 500 / center_p;
        v.x = v.x * coef + this.Param.Center.x;
        v.y = v.y * coef + this.Param.Center.y;

        let intersect, pa, pb;
        for (let j = 0; j < this.Param.Polygon.length; j++)
        {
            let u = Vector.intersect2D(v, this.Param.Center, this.Param.Polygon[j], this.Param.Polygon[(j + 1) % this.Param.Polygon.length]);
            if (u)
            {
                intersect = new Vector(u.x - this.Param.Center.x, u.y - this.Param.Center.y, 0);
                pa = this.Param.Polygon[j];
                pb = this.Param.Polygon[(j + 1) % this.Param.Polygon.length];
                center_u = intersect.length();
                break;
            }
        }
        coef = center_p / center_u;

        //if (intersect === null)
        //{
        //    return 0;
        //}

        intersect.x += this.Param.Center.x;
        intersect.y += this.Param.Center.y;

        let a = intersect.to(pa).length();
        let b = intersect.to(pb).length();
        let c = Math.max(pa.to(pb).length(), 5);
        a = Math.min(a,b);
        let coef2 = (1 - a * 2 / c) * 0.15 + 0.85;

        return coef * coef2;

    }

    GetPerlinColor(p){
        let scale = this.Param.Coef;
        let fNX = p.x / this.Param.Width;
        let fNY = p.y / this.Param.Height;
        let fRdx = fNX * 2 * Math.PI + this.Param.OffSetX;
        let fRdy = fNY * 2 * Math.PI + this.Param.OffSetY;
        let fRds = 500;
        let a = fRds * Math.sin(fRdx) * scale;
        let b = fRds * Math.cos(fRdx) * scale;
        let c = fRds * Math.sin(fRdy) * scale;
        let d = fRds * Math.cos(fRdy) * scale;
        let coef = this.Simplex.noise4D(a, b, c, d);

        coef = (coef + 1) / 2;

        return coef;
    }

}

class Vector{
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    mult(coef)
    {
        this.x *= coef;
        this.y *= coef;
        this.z *= coef;
    }

    to(v)
    {
        return new Vector(v.x - this.x, v.y - this.y, v.z - this.z);
    }

    length(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    VectorTo(vect)
    {
        return new Vector(vect.x - this.x, vect.y - this.y, vect.z - this.z);
    }

    Project(vect)
    {
        return (this.x * vect.x + this.y * vect.y + this.z * vect.z) / this.length();
    }
    
    static Aleat(){
        let a = 1 - Math.random()*2;
        let b = 1 - Math.random()*2;
        let c = 1 - Math.random()*2;
        return new Vector(a,b,c);
    }

    Normalize(){
        let l = length();
        return new Vector(this.x / l, this.y / l, this.z / l);
    }


    InsidePolygon(polygon){
        let A = []
        let B = []
        let C = []  
        for(let i = 0; i < polygon.length; i++)
        {
            let p1 = polygon[i];
            let p2 = polygon[(i + 1) % polygon.length];
            
            // calculate A, B and C
            let a = -(p2.y - p1.y);
            let b = p2.x - p1.x;
            let c = -(a * p1.x + b * p1.y);

            A.push(a);
            B.push(b);
            C.push(c);
        }

        let t1 = true;
        let t2 = true;
        for(let i = 0; i < A.length; i++)
        {
            let d = A[i] * this.x + B[i] * this.y + C[i];
            t1 = t1 && (d >= 0);
            t2 = t2 && (d <= 0);
        }

        return t1 || t2;
    }

    static v_sub(a,b)
    {
        return new Vector(a.x-b.x,a.y-b.y,a.z-b.z);
    }

    static cross_product(a,b)
    {
        return a.x*b.x-a.y*b.x;
    }

    // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
    // Determine the intersection point of two line segments
    // Return FALSE if the lines don't intersect
    static intersect2D(p1, p2, p3, p4) {

        // Check if none of the lines are of length 0
        if ((p1.x === p2.x && p1.y === p2.y) || (p3.x === p4.x && p3.y === p4.y)) {
            return false
        }
    
        let denominator = ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y))
    
        // Lines are parallel
        if (denominator === 0) {
            return false
        }
    
        let ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator
        let ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator
    
        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false
        }
    
        // Return a object with the x and y coordinates of the intersection
        let x = p1.x + ua * (p2.x - p1.x)
        let y = p1.y + ua * (p2.y - p1.y)
    
        return {x, y}
    }

    static fromstruct(p)
    {
        return new Vector(p.x, p.y, p.z);
    }
    }

class Bezier{
    constructor(){
        this.P = [
            new Vector(),
            new Vector(),
            new Vector(),
            new Vector()
        ];
        this.Direction = "XZ";
    }
}

class Sprite{

    constructor(width, height){
        this.Width = width;
        this.Height = height;
        this.Content = new Uint8ClampedArray(this.Width * this.Height * 4);
    }

    Fill(g)
    {
        for(let y = 0; y < this.Height; y++)
        {
            for (let x = 0; x < this.Width; x++)
            {
                let p = new Vector(x,y,0);
                this.SetPixel(x,y, g.GetColor(p));
            }
        }
    }

    DrawBezier(Bezier, color)
    {
        this.DrawBezierRecursive(Bezier, 5, color);
    }

    DrawBezierRecursive (b, level, gradiant)
    {
        if (level <= 0) {
            /* draw a line segment */
            this.DrawLine(
                Math.floor(b.P[0].x + 0.5), 
                Math.floor(b.P[0].y + 0.5),
                Math.floor(b.P[3].x + 0.5), 
                Math.floor(b.P[3].y + 0.5),
                gradiant);
        } else {
                let left = new Bezier();
                let right = new Bezier();                 
                /* subdivide into 2 Bezier segments */
                left.P[0].x = b.P[0].x;
                left.P[0].y = b.P[0].y;
                left.P[1].x = (b.P[0].x + b.P[1].x) / 2;
                left.P[1].y = (b.P[0].y + b.P[1].y) / 2;
                left.P[2].x = (b.P[0].x + 2*b.P[1].x + b.P[2].x) / 4;
                left.P[2].y = (b.P[0].y + 2*b.P[1].y + b.P[2].y) / 4;
                left.P[3].x = (b.P[0].x + 3*b.P[1].x + 3*b.P[2].x + b.P[3].x) / 8;
                left.P[3].y = (b.P[0].y + 3*b.P[1].y + 3*b.P[2].y + b.P[3].y) / 8;

                right.P[0].x = left.P[3].x;
                right.P[0].y = left.P[3].y;
                right.P[1].x = (b.P[1].x + 2*b.P[2].x + b.P[3].x) / 4;
                right.P[1].y = (b.P[1].y + 2*b.P[2].y + b.P[3].y) / 4;
                right.P[2].x = (b.P[2].x + b.P[3].x) / 2;
                right.P[2].y = (b.P[2].y + b.P[3].y) / 2;
                right.P[3].x = b.P[3].x;
                right.P[3].y = b.P[3].y;

                /* draw the 2 segments recursively */
                this.DrawBezierRecursive (left, level - 1, gradiant);
                this.DrawBezierRecursive (right, level - 1, gradiant);
        }

    }

    DrawLine(x0, y0, x1, y1, g) {
        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
     
        while(true) {
           this.SetPixel(x0, y0,g.GetColor(new Vector(x0,y0, 0)));
     
           if ((x0 === x1) && (y0 === y1)) break;
           var e2 = 2*err;
           if (e2 > -dy) { err -= dy; x0  += sx; }
           if (e2 < dx) { err += dx; y0  += sy; }
        }
    }

    FillPolygon(polygon, g, variation = false, val = 5)
    {
        let minx = 9999;
        let miny = 9999;
        let maxx = -999;
        let maxy = -999;
        for(let e = 0; e < polygon.length; e++)
        {
            minx = Math.floor(Math.min(minx, polygon[e].x));
            miny = Math.floor(Math.min(miny, polygon[e].y));
            maxx = Math.ceil(Math.max(maxx, polygon[e].x));
            maxy = Math.ceil(Math.max(maxy, polygon[e].y));
        }
        for(let x = minx; x < maxx; x++)
        {
            for(let y = miny; y < maxy; y++)
            {
                let p = new Vector(x,y,0);
                if (p.InsidePolygon(polygon))
                {
                    if (variation)  this.SetPixel(x,y,g.GetColor(p).Variation(val));
                    else this.SetPixel(x,y,g.GetColor(p));
                }
            }
        }
    }
        

    SetPixel(x,y,c)
    {
        if (x < 0 || x >= this.Width) return;
        if (y < 0 || y >= this.length) return;
        let xIndex = x * 4;
        let yIndex = y * this.Width * 4;
        this.Content[xIndex + yIndex + 0] = Math.floor(this.Content[xIndex + yIndex + 0] * (1 - c.A / 255.0) + c.R * c.A / 255.0);
        this.Content[xIndex + yIndex + 1] = Math.floor(this.Content[xIndex + yIndex + 1] * (1 - c.A / 255.0) + c.G * c.A / 255.0);
        this.Content[xIndex + yIndex + 2] = Math.floor(this.Content[xIndex + yIndex + 2] * (1 - c.A / 255.0) + c.B * c.A / 255.0);
        this.Content[xIndex + yIndex + 3] = Math.min(this.Content[xIndex + yIndex + 3]  + c.A, 255);
    }
    
    GetPixel(x, y)
    {
        if (x < 0 || x >= this.Width) return Color.transparent();
        if (y < 0 || y >= this.length) return Color.transparent();
        let xIndex = x * 4;
        let yIndex = y * this.Width * 4;
        let c = new Color(this.Content[xIndex + yIndex + 0], this.Content[xIndex + yIndex + 1], this.Content[xIndex + yIndex + 2], this.Content[xIndex + yIndex + 3]);
        return c;
    }

    ImageData(){
        return new ImageData(this.Content, this.Width);
    }

}

class TileSprite{

    constructor(width, height){
        this.Width = width;
        this.Height = height;
        this.Content = new Uint8ClampedArray(this.Width * this.Height * 4);
    }

    Fill(g)
    {
        for(let y = 0; y < this.Height; y++)
        {
            for (let x = 0; x < this.Width; x++)
            {
                let p = new Vector(x,y,0);
                this.SetPixel(x,y, g.GetColor(p));
            }
        }
    }

    DrawBezier(Bezier, color)
    {
        this.DrawBezierRecursive(Bezier, 5, color);
    }

    DrawBezierRecursive (b, level, gradiant)
    {
        if (level <= 0) {
            /* draw a line segment */
            this.DrawLine(
                Math.floor(b.P[0].x + 0.5), 
                Math.floor(b.P[0].y + 0.5),
                Math.floor(b.P[3].x + 0.5), 
                Math.floor(b.P[3].y + 0.5),
                gradiant);
        } else {
                let left = new Bezier();
                let right = new Bezier();                 
                /* subdivide into 2 Bezier segments */
                left.P[0].x = b.P[0].x;
                left.P[0].y = b.P[0].y;
                left.P[1].x = (b.P[0].x + b.P[1].x) / 2;
                left.P[1].y = (b.P[0].y + b.P[1].y) / 2;
                left.P[2].x = (b.P[0].x + 2*b.P[1].x + b.P[2].x) / 4;
                left.P[2].y = (b.P[0].y + 2*b.P[1].y + b.P[2].y) / 4;
                left.P[3].x = (b.P[0].x + 3*b.P[1].x + 3*b.P[2].x + b.P[3].x) / 8;
                left.P[3].y = (b.P[0].y + 3*b.P[1].y + 3*b.P[2].y + b.P[3].y) / 8;

                right.P[0].x = left.P[3].x;
                right.P[0].y = left.P[3].y;
                right.P[1].x = (b.P[1].x + 2*b.P[2].x + b.P[3].x) / 4;
                right.P[1].y = (b.P[1].y + 2*b.P[2].y + b.P[3].y) / 4;
                right.P[2].x = (b.P[2].x + b.P[3].x) / 2;
                right.P[2].y = (b.P[2].y + b.P[3].y) / 2;
                right.P[3].x = b.P[3].x;
                right.P[3].y = b.P[3].y;

                /* draw the 2 segments recursively */
                this.DrawBezierRecursive (left, level - 1, gradiant);
                this.DrawBezierRecursive (right, level - 1, gradiant);
        }

    }

    DrawLine(x0, y0, x1, y1, g) {
        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
     
        while(true) {
           this.SetPixel(x0, y0,g.GetColor(new Vector(x0,y0, 0)));
     
           if ((x0 === x1) && (y0 === y1)) break;
           var e2 = 2*err;
           if (e2 > -dy) { err -= dy; x0  += sx; }
           if (e2 < dx) { err += dx; y0  += sy; }
        }
    }
        
    SetPixel(x,y,c)
    {
        if (x < 0 || x >= this.Width) x = ((x % this.Width) + this.Width) % this.Width;
        if (y < 0 || y >= this.length) y = ((y % this.length) + this.length) % this.length;
        let xIndex = x * 4;
        let yIndex = y * this.Width * 4;
        this.Content[xIndex + yIndex + 0] = Math.floor(this.Content[xIndex + yIndex + 0] * (1 - c.A / 255.0) + c.R * c.A / 255.0);
        this.Content[xIndex + yIndex + 1] = Math.floor(this.Content[xIndex + yIndex + 1] * (1 - c.A / 255.0) + c.G * c.A / 255.0);
        this.Content[xIndex + yIndex + 2] = Math.floor(this.Content[xIndex + yIndex + 2] * (1 - c.A / 255.0) + c.B * c.A / 255.0);
        this.Content[xIndex + yIndex + 3] = Math.min(this.Content[xIndex + yIndex + 3]  + c.A, 255);
    }
    
    GetPixel(x, y)
    {
        if (x < 0 || x >= this.Width) x = ((x % this.Width) + this.Width) % this.Width;
        if (y < 0 || y >= this.length) y = ((y % this.length) + this.length) % this.length;
        let xIndex = x * 4;
        let yIndex = y * this.Width * 4;
        let c = new Color(this.Content[xIndex + yIndex + 0], this.Content[xIndex + yIndex + 1], this.Content[xIndex + yIndex + 2], this.Content[xIndex + yIndex + 3]);
        return c;
    }

    ImageData(){
        return new ImageData(this.Content, this.Width);
    }

}

class TileSprite3D{

    constructor(width, length, height){
        this.Width = width;
        this.length = length;
        this.Height = height;
        this.Content = new Uint8ClampedArray(this.Width * this.length * this.Height * 4);
    }

    Fill(g)
    {
        for(let y = 0; y < this.length; y++)
        {
            for (let x = 0; x < this.Width; x++)
            {
                let p = new Vector(x,y,0);
                this.SetPixel(x,y,0, g.GetColor(p));
            }
        }
    }

    DrawBezier(Bezier, gradiant)
    {
        this.DrawBezierRecursive(Bezier, 5, gradiant);
    }

    DrawBezierRecursive (b, level, gradiant)
    {
        if (level <= 0) {
            let vec1 = new Vector();
            vec1.x = b.P[0].x + 0.5;
            vec1.y = b.P[0].y + 0.5;
            vec1.z = b.P[0].z + 0.5;
            let vec2 = new Vector();
            vec2.x = b.P[3].x + 0.5;
            vec2.y = b.P[3].y + 0.5;
            vec2.z = b.P[3].z + 0.5;
            /* draw a line segment */
            this.DrawLine(vec1, vec2, gradiant);
        } else {
                let left = new Bezier();
                let right = new Bezier();                 
                /* subdivide into 2 Bezier segments */
                left.P[0].x = b.P[0].x;
                left.P[0].y = b.P[0].y;
                left.P[0].z = b.P[0].z;
                left.P[1].x = (b.P[0].x + b.P[1].x) / 2;
                left.P[1].y = (b.P[0].y + b.P[1].y) / 2;
                left.P[1].z = (b.P[0].z + b.P[1].z) / 2;
                left.P[2].x = (b.P[0].x + 2*b.P[1].x + b.P[2].x) / 4;
                left.P[2].y = (b.P[0].y + 2*b.P[1].y + b.P[2].y) / 4;
                left.P[2].z = (b.P[0].z + 2*b.P[1].z + b.P[2].z) / 4;
                left.P[3].x = (b.P[0].x + 3*b.P[1].x + 3*b.P[2].x + b.P[3].x) / 8;
                left.P[3].y = (b.P[0].y + 3*b.P[1].y + 3*b.P[2].y + b.P[3].y) / 8;
                left.P[3].z = (b.P[0].z + 3*b.P[1].z + 3*b.P[2].z + b.P[3].z) / 8;

                right.P[0].x = left.P[3].x;
                right.P[0].y = left.P[3].y;
                right.P[0].z = left.P[3].z;
                right.P[1].x = (b.P[1].x + 2*b.P[2].x + b.P[3].x) / 4;
                right.P[1].y = (b.P[1].y + 2*b.P[2].y + b.P[3].y) / 4;
                right.P[1].z = (b.P[1].z + 2*b.P[2].z + b.P[3].z) / 4;
                right.P[2].x = (b.P[2].x + b.P[3].x) / 2;
                right.P[2].y = (b.P[2].y + b.P[3].y) / 2;
                right.P[2].z = (b.P[2].z + b.P[3].z) / 2;
                right.P[3].x = b.P[3].x;
                right.P[3].y = b.P[3].y;
                right.P[3].z = b.P[3].z;

                /* draw the 2 segments recursively */
                this.DrawBezierRecursive (left, level - 1, gradiant);
                this.DrawBezierRecursive (right, level - 1, gradiant);
        }

    }

    DrawLine(vec1, vec2, g) {
        vec1.x = Math.round(vec1.x);
        vec1.y = Math.round(vec1.y);
        vec1.z = Math.round(vec1.z);
        vec2.x = Math.round(vec2.x);
        vec2.y = Math.round(vec2.y);
        vec2.z = Math.round(vec2.z);
        let c = g.GetColor(vec1);
        this.SetPixel(vec1.x, vec1.y, vec1.z, c);
        let dx = Math.abs(vec2.x - vec1.x);
        let dy = Math.abs(vec2.y - vec1.y);
        let dz = Math.abs(vec2.z - vec1.z);
        let xs, ys, zs;
        if (vec2.x > vec1.x)
        {
            xs = 1;
        }
        else
        {
            xs = -1;
        }
        if (vec2.y > vec1.y)
        {
            ys = 1;
        }
        else
        {
            ys = -1;
        }
        if (vec2.z > vec1.z)
        {
            zs = 1;
        }
        else
        {
            zs = -1;
        }
  
        // Driving axis is X-axis"
        if (dx >= dy && dx >= dz)
        {
            let p1 = 2 * dy - dx;
            let p2 = 2 * dz - dx;
            while (vec1.x != vec2.x)
            {
                vec1.x += xs;
                if (p1 >= 0)
                {
                    vec1.y += ys
                    p1 -= 2 * dx
                }
                if (p2 >= 0)
                {
                    vec1.z += zs
                    p2 -= 2 * dx
                }
                p1 += 2 * dy
                p2 += 2 * dz
                let c = g.GetColor(vec1);
                this.SetPixel(vec1.x, vec1.y, vec1.z, c);
            }
                
        }    
        // Driving axis is Y-axis"
        else if (dy >= dx && dy >= dz)
        {
            let p1 = 2 * dx - dy;
            let p2 = 2 * dz - dy;
            while (vec1.y != vec2.y)
            {
                vec1.y += ys;
                if (p1 >= 0)
                {
                    vec1.x += xs;
                    p1 -= 2 * dy;
                }
                if (p2 >= 0)
                {
                    vec1.z += zs;
                    p2 -= 2 * dy;
                }
                p1 += 2 * dx;
                p2 += 2 * dz;
                let c = g.GetColor(vec1);
                this.SetPixel(vec1.x, vec1.y, vec1.z, c);
            }
        }    
        // Driving axis is Z-axis"
        else
        {
            let p1 = 2 * dy - dz;
            let p2 = 2 * dx - dz;
            while (vec1.z != vec2.z)
            {
                vec1.z += zs
                if (p1 >= 0)
                {
                    vec1.y += ys;
                    p1 -= 2 * dz;
                }
                if (p2 >= 0)
                {
                    vec1.x += xs;
                    p2 -= 2 * dz;
                }
                p1 += 2 * dy;
                p2 += 2 * dx;
                let c = g.GetColor(vec1);
                this.SetPixel(vec1.x, vec1.y, vec1.z, c);
            }
        }     
    }
        

    SetPixel(x, y, z,c)
    {

        if (x < 0 || x >= this.Width) x = ((x % this.Width) + this.Width) % this.Width;
        if (y < 0 || y >= this.length) y = ((y % this.length) + this.length) % this.length;
        if (z >= this.Height || z < 0)
        {
            return;
        }
        let xIndex = x * 4;
        let yIndex = y * this.Width * 4;
        let zIndex = z * this.length * this.Width * 4;
        this.Content[xIndex + yIndex + zIndex + 0] = Math.floor(this.Content[xIndex + yIndex + zIndex + 0] * (1 - c.A / 255.0) + c.R * c.A / 255.0);
        this.Content[xIndex + yIndex + zIndex + 1] = Math.floor(this.Content[xIndex + yIndex + zIndex + 1] * (1 - c.A / 255.0) + c.G * c.A / 255.0);
        this.Content[xIndex + yIndex + zIndex + 2] = Math.floor(this.Content[xIndex + yIndex + zIndex + 2] * (1 - c.A / 255.0) + c.B * c.A / 255.0);
        this.Content[xIndex + yIndex + zIndex + 3] = Math.min(this.Content[xIndex + yIndex + zIndex + 3]  + c.A, 255);
    }
    
    GetPixel(x, y, z)
    {
        if (x < 0 || x >= this.Width) x = ((x % this.Width) + this.Width) % this.Width;
        if (y < 0 || y >= this.length) y = ((y % this.length) + this.length) % this.length;
        if (z >= this.Height || z < 0)
        {
            return Color.transparent();
        }
        let xIndex = x * 4;
        let yIndex = y * this.Width * 4;
        let zIndex = z * this.length * this.Width * 4;
        let c = new Color(this.Content[xIndex + yIndex + zIndex + 0], this.Content[xIndex + yIndex + zIndex + 1], this.Content[xIndex + yIndex + zIndex + 2], this.Content[xIndex + yIndex + zIndex + 3]);
        return c;
    }

    ImageData()
    {
        let result = new Uint8ClampedArray(this.Width * this.length * 4);
        for(let x = 0; x < this.Width; x++)
        {
            for (let y = 0; y < this.length; y++)
            {
                for(let z = 0; z < this.Height; z++)
                {
                    let indexX = x * 4;
                    let indexY = y * this.Width * 4;
                    let y1 = (y + z) % this.length;
                    let indexY1 = y1 * this.Width * 4;
                    let indexZ = z * this.Width * this.length * 4;
                    if (this.Content[indexX + indexY1 + indexZ + 3] == 255)
                    {
                        for(let l = 0; l < 4; l++)
                        {
                            result[indexX + indexY + l] = this.Content[indexX + indexY1 + indexZ + l];
                        }
                    }
                }
            }
        }
        return new ImageData(result, this.Width);
    }

}


String.prototype.convertToRGBA = function(){
    let aRGBAHex = this.match(/[0-9A-Fa-f]{1,2}/g);
    let aRGBA = [
        parseInt(aRGBAHex[0],16),
        parseInt(aRGBAHex[1],16),
        parseInt(aRGBAHex[2],16),
        parseInt(aRGBAHex[3],16)
    ];
    return aRGBA;
}
