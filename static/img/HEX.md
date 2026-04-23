Flat top hex formula
( -s/2, -h/2 )
(  s/2, -h/2 )
(   s,    0  )
(  s/2,  h/2 )
( -s/2,  h/2 )
(  -s,    0  )

s = side length
h = height = s * sqrt(3)
w = width = 2s
r = vertical distance between rows = 0.5h

If s = 20, then h = 20 * sqrt(3) ≈ 34.64, and the points are:
( -10, -17.32 )
(  10, -17.32 )
(  20,   0    )
(  10,  17.32 )
( -10,  17.32 )
( -20,   0    )

In order to connect hexes edge-to-edge, we must use
staggered rows. The formula is:
top: (0, -h)
bottom: (0, h)
top-right: (1.5s, -h/2)
bottom-right: (1.5s, h/2)
bottom-left: (-1.5s, h/2)
top-left: (-1.5s, -h/2)

Therefore, for s = 20, we have:
top: (0, -34.64)
bottom: (0, -34.64)
top-right: (30, -17.32)
bottom-right: (30, 17.32)
bottom-left: (-30, 17.32)
top-left: (-30, -17.32)

However, in order to simplify the translations, we can set a grid value using x and y coords of the hex centers,
at increments of 1. This means that if we want a hex above the center hex, we can just translate(0, -1) steps,
and the formula will take care of the actual pixel values. This also allows us to easily form hex clusters without
calucating the pixel values for each hex. The formula then becomes (n(x), n(y)) where n is the number of steps from the center hex,
and x and y are the values from the staggered row formula. 
For example, if we want a hex that is toward the bottom-right of the center hex, we can input the values of (1, 1) steps,
and the formula will calculate the pixel values as (1(1.5s), 0(h/2)). If we want a hex that is toward the bottom-left
of that hex, we can input the values (2, 2) and calculate (2(1.5s), 0(h/2)).
The axial coords for incremental steps are as follows:
top:          ( 0, -1)
bottom:       ( 0, +1)
top-right:    (+1, -1)
bottom-right: (+1,  0)
bottom-left:  (-1, +1)
top-left:     (-1,  0)

The conversion formula between the pixel-coordinates and the grid system can be written as:
x = s * 3/2 * q
y = h * (r + q/2)
using the pre-determined values of s, h, and r above.

Clusters of hexes are built using the above formulas, centered around (0,0) for easy rotation and translation.
Each cluster is then rotated and translated collectively using <g transform=""></g> to create a more dynamic pattern.
