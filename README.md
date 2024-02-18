# Web Particle System

> This is a simple [Particle System](https://en.wikipedia.org/wiki/Particle_system) with the aim to simulate water.

[GitHub Project](https://github.com/rigon/web-particle-system) - [Download](https://github.com/rigon/web-particle-system/archive/master.zip) - [Demo Version](http://rigon.github.io/web-particle-system/particle-system.html)

Each particle is represented by a square and a line. The square is the particle itself and the line is the velocity vector i.e. shows the direction that the particle is moving and with what force.

The script targets to updated at 60fps. In each frame, the vectors of all particles are recalculated. Each particle exercises small repelling force on the nearby particles and the resulting vector is calculated after summing all interactions.

For efficient neighbor search, the [space is partitioned](https://en.wikipedia.org/wiki/Space_partitioning#In_computer_graphics) in a grid of zones and each particle is assigned to one. Then we just have to look for particles in the adjacent zones to the particle.

Despite the resemblance of final result with actual water, it is still far away from good simulation. Other algorithms should be used.

## Interaction
- Mouse Move: it calculates the speed and heading based on the mouse movement and updates the particles accordingly. The bigger the movement, the bigger is the force applied to the particles.
- Mouse Click: simulates the effect of throwing a rock in the water, affecting particles within the specified interaction radius.
- Reset button: on the top right corner, resets the system to the initial state.
