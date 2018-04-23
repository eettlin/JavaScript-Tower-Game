//////////////////////////////////////////////////////////////////////////////////
// Vector2d V1.0.0
// (c) 2010 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Please retain this copyright header in all versions of the software
//////////////////////////////////////////////////////////////////////////////////

// A handy 2d vector class.

var vector2d = function (vx, vy) {

    var vec = {
        // x and y components of vector stored in x,y.
        x: vx,
        y: vy,

        // scale() method allows us to scale the vector
        // either up or down.
        scale: function (scale) {
            vec.x *= scale;
            vec.y *= scale;
            return(this);
        },

        // add() method adds a vector.
        add: function (vec2) {
            vec.x += vec2.x;
            vec.y += vec2.y;
            return(this);
        },

        // sub() method subtracts a vector.
        sub: function (vec2) {
            vec.x -= vec2.x;
            vec.y -= vec2.y;
            return(this);
        },

            // 2-20-17 added dist()
        dist: function (vec2) {
         return(vec2.copy().sub(this).length());
        },

            // 2-20-17 added angleBetween()
        angleBetween: function (vec2) {
            return(vec2.angle() - this.angle());
        },

            // 2-20-17 added angle()
        angle: function () {
            return(Math.atan2(this.y, this.x));
        },

        // negate() method points the vector in the opposite direction.
        negate: function () {
            vec.x = -vec.x;
            vec.y = -vec.y;
            return(this);
        },

        // length() method returns the length of the vector using Pythagoras.
        length: function () {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
        },

        // A faster length calculation that returns the length squared.
        // Useful if all you want to know is that one vector is longer than another.
        lengthSquared: function () {
            return vec.x * vec.x + vec.y * vec.y;
        },

        // normalize() method turns the vector into a unit length vector
        // pointing in the same direction.
        normalize: function () {
            var len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
            if (len) {
                vec.x /= len;
                vec.y /= len;
            }
            return(this);
        },

        // Rotates the vector by an angle specified in radians.
        rotate: function (angle) {
            var x = vec.x,
                y = vec.y,
                cosVal = Math.cos(angle),
                sinVal = Math.sin(angle);
            vec.x = x * cosVal - y * sinVal;
            vec.y = x * sinVal + y * cosVal;
            return(this);
       },

        // toString() is a utility function for displaying the vector as text,
        // a useful debugging aid.
        toString: function () {
            return '(' + vec.x.toFixed(3) + ',' + vec.y.toFixed(3) + ')';
        },

        // 2-20-17 added dotProd
        dotProd: function(v2) {
 		    return (this.x * v2.x) + (this.y * v2.y);
        },

        // 2-20-17 added copy()
        copy: function() {
            return(vector2d(this.x, this.y));
        }
    };
    return vec;
};

function Vector2d()
{
	if (arguments.length == 1)
	{
		this.x = arguments[0].x;
		this.y = arguments[0].y;
	}
	else
	{
		this.x = arguments[0];
		this.y = arguments[1];
	}

	// Multiply vector.
	Vector2d.prototype.mul = function(mul)
	{
		this.x *= mul;
		this.y *= mul;
        return(this);
	};

	// Add a vector.
	Vector2d.prototype.add = function(v2)
	{
		this.x += v2.x;
		this.y += v2.y;
        return(this);
	};

	// Subtract a vector.
	Vector2d.prototype.sub = function(v2)
	{
		this.x -= v2.x;
		this.y -= v2.y;
        return(this);
	};

	// Length of vector.
	Vector2d.prototype.len = function()
	{
		return Math.sqrt(this.x*this.x + this.y*this.y);
	};

	// Normalize (unit length). Also returns length before normalisation.
	// 2-20-17 normalize the spelling of normalise to normalize
	Vector2d.prototype.normalize = function()
	{
		var len = Math.sqrt(this.x*this.x + this.y*this.y);
		if(len) {
			this.x /= len;
			this.y /= len;
		}
        return(this);
	};

	// Dot product.
	Vector2d.prototype.dotProd = function(v2)
	{
		return (this.x * v2.x) + (this.y * v2.y);
	};

	// Rotate vector by an angle in radians.
	Vector2d.prototype.rotate = function(ang)
	{
		this.x = (this.x * Math.cos(ang)) - (this.y * Math.sin(ang));
		this.y = (this.y * Math.cos(ang)) + (this.x * Math.sin(ang));
        return(this);
	};

	// Negate vector (point in opposite direction).
	Vector2d.prototype.negate = function()
	{
		this.x = -this.x;
		this.y = -this.y;
        return(this);
	};

	//toString function.
	Vector2d.prototype.toString = function()
	{
		return 'x = ' + this.x + ', y = ' + this.y;
	};

    Vector2d.prototype.rotate = function(angle) {
        this.x = Math.cos(angle) * this.x - Math.Sin(angle) * this.y
        this.y = Math.Sin(angle) * this.x + Math.Cos(angle) * this.y
        return(this);

    };

        // 2-20-17 added copy()
    Vector2d.prototype.copy =  function() {
        return(new Vector2d(this.x, this.y));
    };

        // 2-20-17 added dist()
    Vector2d.prototype.dist = function (vec2) {
     return(vec2.copy().sub(this).len());
    };

        // 2-20-17 added angleBetween()
    Vector2d.prototype.angleBetween = function (vec2) {
        return(vec2.angle() - this.angle());
    };

        // 2-20-17 added angle()
    Vector2d.prototype.angle =  function () {
        return(Math.atan2(this.y, this.x));
    };



   /* Vector2D CrossProduct(const Vector2D & v) const
    {
    return Vector2D(v.Y, -v.X);
    }
    */
};
