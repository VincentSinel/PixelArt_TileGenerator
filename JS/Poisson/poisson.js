class Poisson {
    constructor(){
        this.width = null;
        this.height = null;
        this.point_nbr = null;
        this.new_point_count = 300;
        this.process_list = [];
        this.sample_points = [];
        this.sample_pointsbig = [];
        this.fail_points = [];

        this.Cell = null;
    }

    put_point(p)
    {
        this.process_list.push(p);

        let ajust = {x: ((p.x + this.width * 5) % this.width), y: ((p.y + this.height * 5) % this.height)};
        this.sample_points.push(ajust);

        for(let upx = -1; upx < 2; upx++)
        {
            for(let upy = -1; upy < 2; upy++)
            {
                let q = {x: p.x + this.width * upx, y: p.y + this.height * upy};
                this.sample_pointsbig.push(q);
            }
        }
    }

    generate_random_around(p)
    {
        let rr = Math.random()+1;
        let rt = Math.random() * 2 * Math.PI;

        return {x: p.x + this.Cell*rr*Math.cos(rt), y: p.y + this.Cell*rr*Math.sin(rt)};
    }

    in_neighbourhood(p)
    {
        for(let cell = 0; cell < this.sample_pointsbig.length; cell++)
        {
            let p1 = this.sample_pointsbig[cell];
            if (this.distance(p1, p) < this.Cell*this.Cell){
                return true;
            }
        }
        return false;
    }

    distance(p1, p2)
    {
        return (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y);
    }

    generate_poisson()
    {

        this.Cell = Math.sqrt(this.width * this.height / this.point_nbr) * 0.8;

        this.process_list = new RandomQueue();
        this.sample_points = [];
        
        this.put_point({x: Math.random() * this.width, y: Math.random() * this.height});

        while (!this.process_list.empty() && this.sample_points.length < this.point_nbr){
            let p = this.process_list.pop();
            for(let i = 0; i < this.new_point_count; i++)
            {
                let q = this.generate_random_around(p);
                if (!this.in_neighbourhood(q))
                {
                    this.put_point(q);
                    if (this.sample_points.length >= this.point_nbr) i = this.new_points_count;
                }
                else
                {
                    this.fail_points.push(q);
                }
            }
        }
        return this.sample_points;
    }
}

class RandomQueue{
    constructor(){
        this.array = [];
    }

    empty(){
        return this.array.length <= 0;
    }

    push(x){
        this.array.push(x);
    }

    pop(){
        let n = this.array.length;

        if (n <= 0)
        {
            throw new Error("Cannot pop from empty container !");
        }
        else if (n == 1)
        {
            return this.array.pop();
        }
        else
        {
            let j = n-1;
            let i = Math.floor(Math.random() * j);
            let temp = this.array[i];
            this.array[i] = this.array[j];
            this.array[j] = temp;
            return this.array.pop();
        }
    }
}